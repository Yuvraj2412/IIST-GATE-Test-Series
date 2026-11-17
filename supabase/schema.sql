-- =====================================================================
-- IGTS – Supabase schema
-- Run this once in: Supabase Dashboard → SQL Editor → New query → Run
--
-- Column names intentionally keep the original camelCase names used by
-- the Mongoose models so API responses stay identical for the frontend.
--
-- Security model: RLS is ENABLED on every table with NO policies, so the
-- publishable (anon) key cannot read or write anything. All data access
-- happens in Next.js API routes using the secret key, after the route has
-- verified the caller's Supabase session.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- enums ----------
do $$ begin
  create type user_role as enum ('user', 'admin', 'testAdmin', 'evaluationAdmin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('created', 'paid');
exception when duplicate_object then null; end $$;

do $$ begin
  create type question_section as enum ('aptitude', 'subject');
exception when duplicate_object then null; end $$;

do $$ begin
  create type question_type as enum ('MCQ_SINGLE', 'MCQ_MULTIPLE', 'NUMERICAL');
exception when duplicate_object then null; end $$;

do $$ begin
  create type question_difficulty as enum ('easy', 'medium', 'hard');
exception when duplicate_object then null; end $$;

do $$ begin
  create type attempt_status as enum ('attempting', 'completed', 'evaluated');
exception when duplicate_object then null; end $$;

do $$ begin
  create type faq_category as enum ('General', 'Payments', 'Technical', 'Test', 'Other');
exception when duplicate_object then null; end $$;

-- ---------- updatedAt trigger ----------
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new."updatedAt" = now();
  return new;
end $$;

-- ---------- users (profile table, 1:1 with auth.users) ----------
create table if not exists public.users (
  id          uuid primary key default gen_random_uuid(),
  "userId"    uuid not null unique references auth.users(id) on delete cascade, -- Supabase auth uid
  username    text not null unique,
  name        text,
  mobile      bigint check (mobile between 1000000000 and 9999999999),
  role        user_role not null default 'user',
  email       text not null unique,
  college     text,
  branch      text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  constraint users_email_lowercase check (email = lower(email))
);

-- ---------- payments ----------
create table if not exists public.payments (
  id                 uuid primary key default gen_random_uuid(),
  amount             numeric not null,
  "updatedTime"      timestamptz not null default now(),
  receipt            text not null,
  "orderId"          text not null unique,
  "paymentId"        text not null default '',
  signature          text not null default '',
  status             payment_status not null default 'created',
  test               text,
  "detailObject"     text,
  "razorpayResponse" jsonb not null,
  "user"             uuid not null references public.users(id) on delete cascade,
  "createdAt"        timestamptz not null default now(),
  "updatedAt"        timestamptz not null default now()
);
create index if not exists payments_user_idx on public.payments ("user");

-- ---------- test registrations ----------
create table if not exists public.test_registrations (
  id                 uuid primary key default gen_random_uuid(),
  pid                text not null,
  oid                text not null,
  signature          text not null,
  name               text not null,
  test               text not null,
  "userId"           uuid not null references public.users(id) on delete cascade,
  payment            uuid not null references public.payments(id),
  "registrationDate" timestamptz not null default now(),
  "createdAt"        timestamptz not null default now(),
  "updatedAt"        timestamptz not null default now(),
  unique ("userId", test)
);
create index if not exists test_registrations_user_idx on public.test_registrations ("userId");

-- ---------- questions ----------
create table if not exists public.questions (
  id               uuid primary key default gen_random_uuid(),
  "questionId"     text not null unique,
  "domainId"       text not null,
  "packId"         text not null,
  "testId"         text not null,
  section          question_section not null,
  type             question_type not null,
  "questionText"   text not null,
  "diagramLink"    text,
  options          jsonb not null default '[]'::jsonb,   -- [{ optionId, optionText, optionImage }]
  "correctAnswers" text[] not null,
  marks            numeric not null,
  "negativeMarks"  numeric not null default 0,
  difficulty       question_difficulty not null default 'medium',
  "uploadedBy"     text,
  "createdAt"      timestamptz not null default now(),
  "updatedAt"      timestamptz not null default now()
);
create index if not exists questions_test_idx on public.questions ("domainId", "packId", "testId");

-- ---------- test attempts ----------
create table if not exists public.test_attempts (
  id                          uuid primary key default gen_random_uuid(),
  "userId"                    uuid not null references public.users(id) on delete cascade,
  "registeredTestId"          uuid not null references public.test_registrations(id) on delete cascade,
  "domainId"                  text not null,
  "packId"                    text not null,
  "testId"                    text not null,
  "startTime"                 timestamptz not null,
  "endTime"                   timestamptz not null,
  status                      attempt_status not null default 'attempting',
  "timeRemainingOnCompletion" text not null default '',
  responses                   jsonb not null default '{}'::jsonb,  -- { [question.id]: answer }
  "createdAt"                 timestamptz not null default now(),
  "updatedAt"                 timestamptz not null default now(),
  unique ("userId", "registeredTestId", "domainId", "packId", "testId")
);
create index if not exists test_attempts_user_idx on public.test_attempts ("userId");

-- ---------- reports (evaluation results) ----------
create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  "attemptId" uuid not null unique references public.test_attempts(id) on delete cascade,
  aptitude    jsonb not null,
  subject     jsonb not null,
  "gateRank"  text not null,
  score       jsonb not null,   -- { positive, negative, total }
  accuracy    numeric not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

-- ---------- FAQs ----------
create table if not exists public.faqs (
  id               uuid primary key default gen_random_uuid(),
  question         text not null unique,
  answer           text not null,
  category         faq_category not null default 'General',
  "createdByEmail" text not null,
  "createdAt"      timestamptz not null default now(),
  "updatedAt"      timestamptz not null default now()
);

-- ---------- signup email OTPs (server-side verification) ----------
create table if not exists public.email_otps (
  email       text primary key,
  otp_hash    text not null,
  expires_at  timestamptz not null,
  attempts    int not null default 0,
  "createdAt" timestamptz not null default now()
);

-- ---------- triggers ----------
do $$
declare t text;
begin
  foreach t in array array['users','payments','test_registrations','questions','test_attempts','reports','faqs']
  loop
    execute format('drop trigger if exists trg_%1$s_updated_at on public.%1$I', t);
    execute format('create trigger trg_%1$s_updated_at before update on public.%1$I
                    for each row execute function set_updated_at()', t);
  end loop;
end $$;

-- ---------- Row Level Security: deny all for anon/authenticated ----------
alter table public.users              enable row level security;
alter table public.payments           enable row level security;
alter table public.test_registrations enable row level security;
alter table public.questions          enable row level security;
alter table public.test_attempts      enable row level security;
alter table public.reports            enable row level security;
alter table public.faqs               enable row level security;
alter table public.email_otps         enable row level security;

-- ---------- server-only helper to find orphan auth.users by email ----------
create or replace function public.get_auth_user_id_by_email(target_email text)
returns uuid
language sql
security definer
set search_path = ''
as $$
  select id from auth.users where lower(email) = lower(target_email) limit 1;
$$;
revoke all on function public.get_auth_user_id_by_email(text) from public, anon, authenticated;
grant execute on function public.get_auth_user_id_by_email(text) to service_role;

import nodemailer from "nodemailer";

function buildTransports() {
  const transports = [];

  if (process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS) {
    const port = Number(process.env.MAIL_PORT || 465);
    transports.push({
      name: "primary-smtp",
      from: process.env.MAIL_USER,
      transport: nodemailer.createTransport({
        host: process.env.MAIL_HOST.trim(),
        port,
        secure: port === 465,
        auth: {
          user: process.env.MAIL_USER.trim(),
          pass: process.env.MAIL_PASS.trim(),
        },
        connectionTimeout: 10000,
      }),
    });
  }

  if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
    transports.push({
      name: "gmail-smtp",
      from: process.env.SMTP_EMAIL.trim(),
      transport: nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_EMAIL.trim(),
          pass: process.env.SMTP_PASSWORD.trim(),
        },
        connectionTimeout: 10000,
      }),
    });
  }

  return transports;
}

export async function sendMail({
  to,
  name = "IGTS Dhanak 2027",
  subject,
  body,
  replyTo,
}) {
  const transports = buildTransports();

  if (transports.length === 0) {
    throw new Error("No SMTP email transport is configured.");
  }

  let lastError = null;
  for (const entry of transports) {
    try {
      await entry.transport.verify();
      const sendResult = await entry.transport.sendMail({
        from: `"IGTS · Dhanak 2027" <${entry.from}>`,
        to,
        ...(replyTo ? { replyTo } : {}),
        subject,
        html: body,
      });
      console.log(`Email sent via ${entry.name}:`, sendResult.messageId);
      return sendResult;
    } catch (error) {
      lastError = error;
      console.warn(`Email attempt via ${entry.name} failed:`, error.message);
    }
  }

  throw lastError || new Error("Failed to send email via configured transports.");
}

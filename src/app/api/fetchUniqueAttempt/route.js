import { getSupabaseAdmin, withId } from "@/libs/supabase/admin";
import { requireProfile } from "@/libs/supabase/server";

const rankRanges = {
  Aerospace: [
    { minScore: 80, maxScore: 100, rankRange: "1-500" },
    { minScore: 70, maxScore: 79, rankRange: "500-1000" },
    { minScore: 60, maxScore: 69, rankRange: "1000-2000" },
    { minScore: 50, maxScore: 59, rankRange: "2000-5000" },
    { minScore: 40, maxScore: 49, rankRange: "5000-10000" },
    { minScore: 30, maxScore: 39, rankRange: "10000-15000" },
    { minScore: 20, maxScore: 29, rankRange: "15000-20000" },
    { minScore: 10, maxScore: 19, rankRange: "20000-30000" },
    { minScore: 0, maxScore: 9, rankRange: "30000+" },
  ],
  Mechanical: [
    { minScore: 85, maxScore: 100, rankRange: "1-500" },
    { minScore: 75, maxScore: 84, rankRange: "500-1000" },
    { minScore: 65, maxScore: 74, rankRange: "1000-2000" },
    { minScore: 55, maxScore: 64, rankRange: "2000-5000" },
    { minScore: 45, maxScore: 54, rankRange: "5000-10000" },
    { minScore: 35, maxScore: 44, rankRange: "10000-15000" },
    { minScore: 25, maxScore: 34, rankRange: "15000-20000" },
    { minScore: 15, maxScore: 24, rankRange: "20000-30000" },
    { minScore: 0, maxScore: 14, rankRange: "30000+" },
  ],
  ECE: [
    { minScore: 90, maxScore: 100, rankRange: "1-500" },
    { minScore: 80, maxScore: 89, rankRange: "500-1000" },
    { minScore: 70, maxScore: 79, rankRange: "1000-2000" },
    { minScore: 60, maxScore: 69, rankRange: "2000-5000" },
    { minScore: 50, maxScore: 59, rankRange: "5000-10000" },
    { minScore: 40, maxScore: 49, rankRange: "10000-15000" },
    { minScore: 30, maxScore: 39, rankRange: "15000-20000" },
    { minScore: 20, maxScore: 29, rankRange: "20000-30000" },
    { minScore: 0, maxScore: 19, rankRange: "30000+" },
  ],
};

const emptySection = () => ({
  correctedQuestions: [],
  incorrectQuestions: [],
  unattemptedQuestions: [],
  score: {
    positive: 0,
    negative: 0,
    total: 0,
  },
  accuracy: 0,
});

const isAnswered = (response) =>
  response !== undefined &&
  response !== null &&
  response !== "" &&
  !(Array.isArray(response) && response.length === 0);

class EvaluatedResult {
  constructor(attemptId, responses, questions) {
    this.attemptId = attemptId;
    this.aptitude = emptySection();
    this.subject = emptySection();

    questions.forEach((row) => {
      const question = withId(row); // keep `_id` inside the stored report for the frontend
      const qid = question.id;
      const section = question.section;
      const response = responses[qid];

      if (!this[section]) {
        this[section] = emptySection();
      }

      if (isAnswered(response)) {
        if (question.type === "MCQ_MULTIPLE") {
          // Order of selected options does not matter
          const given = [...(Array.isArray(response) ? response : [response])].map(String).sort();
          const expected = [...question.correctAnswers].map(String).sort();
          const isCorrect =
            given.length === expected.length &&
            given.every((val, index) => val === expected[index]);

          if (isCorrect) {
            this[section].correctedQuestions.push({
              question: question,
              correctAnswer: question.correctAnswers,
              yourAnswer: response,
              marks: Number(question.marks),
            });
          } else {
            this[section].incorrectQuestions.push({
              question: question,
              correctAnswer: question.correctAnswers,
              yourAnswer: response,
              marks: -1 * Number(question.negativeMarks),
            });
          }
        } else {
          // MCQ_SINGLE / NUMERICAL – single correct answer
          const isCorrect = String(response) === String(question.correctAnswers[0]);

          if (isCorrect) {
            this[section].correctedQuestions.push({
              question: question,
              correctAnswer: question.correctAnswers[0],
              yourAnswer: response,
              marks: Number(question.marks),
            });
          } else {
            this[section].incorrectQuestions.push({
              question: question,
              correctAnswer: question.correctAnswers[0],
              yourAnswer: response,
              marks: -1 * Number(question.negativeMarks),
            });
          }
        }
      } else {
        this[section].unattemptedQuestions.push({
          question: question,
          correctAnswer:
            question.type === "MCQ_MULTIPLE"
              ? question.correctAnswers
              : question.correctAnswers[0],
          yourAnswer: "Not Attempted",
          marks: 0,
        });
      }
    });
  }

  static sum(list) {
    return parseFloat(list.reduce((acc, curr) => acc + curr.marks, 0).toFixed(2));
  }

  static accuracyOf(correct, incorrect) {
    const attempted = correct + incorrect;
    return attempted === 0 ? 0 : parseFloat((100 * (correct / attempted)).toFixed(2));
  }

  calculateScores() {
    this.score = { positive: 0, negative: 0, total: 0 };
    this.accuracy = 0;

    for (const name of ["aptitude", "subject"]) {
      const s = this[name];
      s.score.positive = EvaluatedResult.sum(s.correctedQuestions);
      s.score.negative = EvaluatedResult.sum(s.incorrectQuestions);
      s.score.total = parseFloat((s.score.positive + s.score.negative).toFixed(2));
      s.accuracy = EvaluatedResult.accuracyOf(s.correctedQuestions.length, s.incorrectQuestions.length);
    }

    this.score.positive = parseFloat((this.aptitude.score.positive + this.subject.score.positive).toFixed(2));
    this.score.negative = parseFloat((this.aptitude.score.negative + this.subject.score.negative).toFixed(2));
    this.score.total = Math.max(
      parseFloat((this.aptitude.score.total + this.subject.score.total).toFixed(2)),
      0
    );
    this.accuracy = EvaluatedResult.accuracyOf(
      this.aptitude.correctedQuestions.length + this.subject.correctedQuestions.length,
      this.aptitude.incorrectQuestions.length + this.subject.incorrectQuestions.length
    );
  }

  giveRank(domain) {
    this.gateRank = "Not Ranked"; // Default value
    const rankTable = rankRanges[domain] || [];
    const totalScore = this.score.total;
    for (const range of rankTable) {
      if (totalScore >= range.minScore && totalScore <= range.maxScore) {
        this.gateRank = range.rankRange;
        break;
      }
    }
  }
}

// Evaluates the attempt (once) and returns the saved report.
async function evaluateAttempt(attempt) {
  const supabase = getSupabaseAdmin();

  const { data: existingReport, error: reportErr } = await supabase
    .from("reports")
    .select("*")
    .eq("attemptId", attempt.id)
    .maybeSingle();
  if (reportErr) throw reportErr;
  if (existingReport) return existingReport;

  const { data: allQuestions, error: qErr } = await supabase
    .from("questions")
    .select("id, questionId, domainId, packId, testId, section, type, questionText, diagramLink, options, correctAnswers, marks, negativeMarks, difficulty")
    .eq("packId", attempt.packId)
    .eq("testId", attempt.testId)
    .eq("domainId", attempt.domainId);
  if (qErr) throw qErr;

  const result = new EvaluatedResult(attempt.id, attempt.responses || {}, allQuestions || []);
  result.calculateScores();
  result.giveRank(attempt.domainId);

  // upsert on the unique attemptId guards against concurrent evaluations
  const { data: report, error: insertErr } = await supabase
    .from("reports")
    .upsert(
      {
        attemptId: attempt.id,
        aptitude: result.aptitude,
        subject: result.subject,
        gateRank: result.gateRank,
        score: result.score,
        accuracy: result.accuracy,
      },
      { onConflict: "attemptId", ignoreDuplicates: false }
    )
    .select()
    .single();
  if (insertErr) throw insertErr;

  const { error: updErr } = await supabase
    .from("test_attempts")
    .update({ status: "evaluated" })
    .eq("id", attempt.id);
  if (updErr) throw updErr;

  return report;
}

export async function POST(req) {
  try {
    const { profile, response } = await requireProfile();
    if (response) return response;

    // Parse the request body
    const { AttemptId, testPack, testNumber, domain } = await req.json();

    // Validate required fields
    if (!AttemptId || !testPack || !testNumber || !domain) {
      return new Response(
        JSON.stringify({
          error:
            "All fields (AttemptId, testPack, testNumber, domain) are required.",
        }),
        { status: 400 }
      );
    }

    // Query the database for the specific attempt (must belong to the caller)
    const { data: attempt, error } = await getSupabaseAdmin()
      .from("test_attempts")
      .select("*")
      .eq("id", AttemptId)
      .eq("userId", profile.id)
      .eq("packId", testPack)
      .eq("testId", testNumber)
      .eq("domainId", domain)
      .maybeSingle();

    if (error && error.code !== "22P02") throw error; // 22P02 = invalid uuid → treat as not found

    // Handle case where no attempt is found
    if (!attempt) {
      return new Response(
        JSON.stringify({ error: "Test attempt not found." }),
        { status: 404 }
      );
    }

    // Evaluate once the attempt is submitted, or once its time window is over.
    const timeOver = new Date(attempt.endTime).getTime() < Date.now();
    const readyForEvaluation =
      attempt.status === "evaluated" ||
      attempt.status === "completed" ||
      (attempt.status === "attempting" && timeOver);

    if (!readyForEvaluation) {
      return new Response(JSON.stringify(withId(attempt)), { status: 200 });
    }

    const report = await evaluateAttempt(attempt);

    return new Response(
      JSON.stringify({ ...withId(attempt), status: "evaluated", report: withId(report) }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching unique test attempt:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch test attempt." }),
      { status: 500 }
    );
  }
}

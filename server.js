import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: "100kb" }));
app.use(express.static(path.join(__dirname, "public")));

const subjects = {
  "Maths": "Pearson Edexcel GCSE Maths (1MA1)",
  "Statistics": "Pearson Edexcel GCSE Statistics (1ST0)",
  "History": "Pearson Edexcel History (1HI0/FR)",
  "Religious Studies": "Pearson Edexcel Religious Studies (1RA0/2RS)",
  "Health & Social Care": "Pearson BTEC Health and Social Care (RH53)",
  "English Literature": "AQA GCSE English Literature (8702)",
  "English Language": "AQA GCSE English Language (8700)",
  "Combined Science": "AQA GCSE Combined Science: Trilogy (8464)",
  "Biology": "AQA GCSE Biology (8461)",
  "Chemistry": "AQA GCSE Chemistry (8462)",
  "Physics": "AQA GCSE Physics (8463)",
  "Geography": "AQA GCSE Geography (8035)",
  "Art": "AQA GCSE Art and Design (8202)",
  "Photography": "AQA GCSE Photography (8206)",
  "French": "AQA GCSE French (8658)",
  "Drama": "AQA GCSE Drama (8261)",
  "Business": "AQA GCSE Business (8132)",
  "Further Maths": "AQA Level 2 Certificate in Further Maths (8365)",
  "Sociology": "AQA GCSE Sociology (8192)",
  "Citizenship": "AQA GCSE Citizenship Studies (8100)",
  "HPQ": "AQA Level 2 Higher Project Qualification (7992)",
  "Sport Studies": "OCR Cambridge National Sport Studies (J829)",
  "iMedia": "OCR Cambridge National Creative iMedia (J834)",
  "IT": "OCR Cambridge National IT (J836)",
  "Music": "Eduqas/WJEC GCSE Music (C660QS)",
  "Construction": "Eduqas/WJEC Construction BTEC (E819QA)"
};

app.get("/api/status", (_req, res) => {
  res.json({
    configured: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "add_your_api_key_here"),
    model: process.env.OPENAI_MODEL || "gpt-6-astra"
  });
});

app.post("/api/lesson", async (req, res) => {
  const { subject, week, lessonType = "New topic", previousTopics = [] } = req.body || {};
  if (!subjects[subject]) return res.status(400).json({ error: "Please choose a subject from the timetable." });
  if (!Number.isInteger(week) || week < 1 || week > 52) return res.status(400).json({ error: "Week must be between 1 and 52." });
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "add_your_api_key_here") {
    return res.status(503).json({ error: "AI is not connected yet. Add your API key to the .env file, then restart the website. You can still explore the timetable and track progress." });
  }

  const prior = Array.isArray(previousTopics)
    ? previousTopics.filter(x => typeof x === "string").slice(-30)
    : [];

  const prompt = `You are a careful, encouraging UK Year 10 revision tutor.
Subject: ${subject}
Exam board and qualification: ${subjects[subject]}
Study week: ${week}
Lesson type: ${lessonType}
Lesson duration: exactly 20 minutes.
Topics already used in this subject (avoid repeating them; if the list is empty, choose a suitable new topic): ${JSON.stringify(prior)}

Create ONE fresh, age-appropriate, accurate lesson aligned to the named qualification where possible. Choose a different topic from the used list. Do not claim certainty about exact school teaching order; if a specification detail is uncertain, teach a clearly labelled relevant foundational topic. Avoid fabricating quotations or exam-board-specific requirements. For English Literature, ask which set text only if necessary; otherwise teach a transferable skill such as analysing language or structure. For practical/coursework subjects, give a useful theory, planning, analysis or evaluation lesson.

Return ONLY valid JSON, no markdown fences, using this exact shape:
{
 "title":"short lesson title",
 "topic":"specific topic name, used to avoid repeats",
 "objective":"one sentence learning goal",
 "minutes":[
  {"time":"0–5 min","heading":"Learn","content":"Clear explanation with a small example"},
  {"time":"5–10 min","heading":"Make notes","content":"Concise facts/definitions the learner should write"},
  {"time":"10–15 min","heading":"Practise","content":"One worked example or a guided activity; do not solve the quiz questions"},
  {"time":"15–20 min","heading":"Check your learning","content":"Tell learner to answer the quiz without notes"}
 ],
 "keyFacts":["3 to 5 short useful facts"],
 "questions":[
  {"question":"clear question","options":["option 1","option 2","option 3","option 4"],"answer":0,"explanation":"brief explanation of why the answer is correct"},
  {"question":"clear question","options":["option 1","option 2","option 3","option 4"],"answer":1,"explanation":"brief explanation"},
  {"question":"clear question","options":["option 1","option 2","option 3","option 4"],"answer":2,"explanation":"brief explanation"}
 ],
 "challenge":"one optional stretch task",
 "recap":"one-sentence summary"
}
Ensure exactly 3 multiple-choice questions, exactly 4 options per question, and answer is a zero-based integer from 0 to 3. Keep the whole lesson useful for a 20-minute session.`;

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6-astra",
      input: prompt
    });
    const output = response.output_text || "";
    const cleaned = output.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    const lesson = JSON.parse(cleaned);
    if (!lesson.title || !lesson.topic || !Array.isArray(lesson.minutes) || !Array.isArray(lesson.questions)) {
      throw new Error("The AI returned an incomplete lesson. Please try again.");
    }
    lesson.subject = subject;
    lesson.examBoard = subjects[subject];
    lesson.week = week;
    res.json({ lesson });
  } catch (error) {
    console.error("Lesson generation error:", error?.message || error);
    res.status(502).json({ error: "I couldn't generate that lesson just now. Check that your API key and model name are correct, then try again." });
  }
});

app.listen(port, () => {
  console.log(`Year 10 Study Hub is running at http://localhost:${port}`);
});

# Year 10 Study Hub 2.0

A free-to-host GCSE revision website starter built from the supplied Study Hub project.

## What's included in this update

- Student profile sign-up and login prototype.
- Subject selection instead of forcing every catalogue subject into the timetable.
- Exam-board labels and a per-subject Foundation / Higher / N/A selector.
- A custom weekly timetable with a maximum of two Homework Days.
- Individual past-paper countdowns for selected subjects. Defaults: Maths in 3 weeks, Science in 6 weeks, other subjects in 4 weeks. Deadlines can be edited.
- Maths Genie link for Maths; subject/exam-board resource links for other subjects.
- Past-paper completion history and optional marks.
- 20-minute lesson structure, 10-question quiz interface, question-use tracking and weaker-topic tracking.
- Expanded GCSE topic checklists across Maths, English, Sciences and a wide range of other subjects; Recall Mode can use the listed topic map after topics are marked studied.
- Progress dashboard and light/dark theme.
- Corrected AQA Combined Science: Trilogy code to 8464.

## Important limitations before public launch

This is a functional starter, not a completed or verified GCSE course platform.

1. The topic checklists are substantially expanded broad GCSE topic maps, but are not yet verified line-by-line against every exam-board specification, tier and school-selected option. History routes and English Literature set texts especially depend on the exact course. Match each student's actual qualification before treating the syllabus as complete.
2. The current quiz bank remains much smaller than the expanded topic checklist. It contains starter questions rather than a full topic-by-topic, tier-specific GCSE question bank. Add and quality-check more original questions for every topic before relying on it for long-term exam preparation.
3. Foundation/Higher selection is saved and displayed, but most starter questions are not yet fully tier-separated. The expanded Maths checklist labels many Higher-only routes, but the actual question banks still need distinct Foundation and Higher versions.
4. Sign-up/login in this version is a **local browser prototype**. Profiles and progress are stored in localStorage on that device only. Passwords are hashed in the browser, but this is not production authentication, is not a secure substitute for a server-side auth provider, and does not sync between devices. Before public launch, integrate a real authentication service and hosted database (for example Supabase Auth + Postgres) and apply appropriate privacy/security controls for student accounts.
5. Browser localStorage can be cleared and is not a backup. The project currently stores each local profile's progress in that browser.
6. Countdown dates use the device's current date. They are study reminders, not official exam dates. Always check the correct paper, tier, specification and paper code before starting.
7. Past-paper links take users to external providers. The site does not reproduce copyrighted exam papers. Use official exam-board papers and mark schemes or the linked Maths Genie resources.
8. The three-week learning / strengthen / past-paper cycle is represented in the planner concept, but this starter uses per-subject editable deadlines rather than an automated full three-week scheduler.

## Run locally

1. Install Node.js LTS.
2. Extract the ZIP.
3. Open a terminal in this folder.
4. Run `npm install`.
5. Run `npm start`.
6. Visit `http://localhost:3000`.

The current frontend does not require an OpenAI API key for the included preset starter experience. The legacy optional `/api/lesson` endpoint remains in `server.js`, but the new frontend uses its local starter topic/question data.

## Deploy

For Render:
- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`
- Root directory: leave blank if deploying this project root.
- Free instance can serve the starter, subject to Render's current free-service limits.

For persistent accounts and cross-device progress, configure a hosted database/auth service before public use. Do not put secret keys in `public/index.html` or commit `.env` files.


## English Literature set texts
The English Literature topic route is specifically focused on **Macbeth** by William Shakespeare and **An Inspector Calls** by J. B. Priestley. It includes character, theme, context, writer's methods, structure, quotation analysis and timed essay practice for both plays. Check your school's exam-board specification for the exact question format and assessment requirements.


## History course topics added in V2
The History topic checklist now follows the four course areas shown in the supplied exam overview: Medicine in Britain c1250–present and the British sector of the Western Front; Superpower Relations and the Cold War 1941–1991; Elizabethan England 1558–1588; and Weimar and Nazi Germany 1918–1939. It includes supporting chronology, content and exam-skill topics. Confirm the precise qualification and specification with the school before treating this checklist as exhaustive.

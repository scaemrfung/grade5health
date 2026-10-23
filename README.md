# Grade 5 Health

Weekly 30-minute Alberta Physical Education and Wellness lessons for Grade 5.

**Live site:** https://scaemrfung.github.io/grade5health/

Printable unit packets are on the home page and each unit page (Print packet or Download PDF).

**Teacher answer keys (not for students):**
- All 36 weeks: https://scaemrfung.github.io/grade5health/keys/
- Combined PDF: https://scaemrfung.github.io/grade5health/pdfs/Grade5-Health-Teacher-Answer-Keys.pdf

## "Updated" stamp

`updated-stamp.js` adds the "Updated … MT" stamp to every page. The date is baked into the file (`SITE_UPDATED`), so pages make no GitHub API calls. Before committing a change, run:

    sh tools/bake-updated.sh && git add updated-stamp.js

**Standing rule (Oct 3, 2026): no other-sites footer.** Do not add a "Mr. Fung's sites" footer or any list of links to Mr. Fung's other sites at the bottom of any page (removed at the request of Mr. Fung; the footer code and `.mf-sites` styles are gone). Navigation links inside this site are fine.

## Chalkie lesson links

`chalkie-links.json` maps lesson number → Chalkie lesson URL (`{"1": "https://…"}`; one lesson per week, so Week N = Lesson N, 1–36). Each weekly lesson page shows an **Open this lesson in Chalkie** button under the title (opens in a new tab, hidden in print) when its week has an https URL; no entry means nothing is shown. The button is rendered by the week route (`assets/week._week-*.js`) and styled in `chalkie-link.css`. Update the links with:

    python3 tools/set-chalkie-links.py mapping.json    # mapping.json = {"1": "https://…", …}

## Assessment (EIPS 2026–27, Grades 3–6)

- **Levels.** Unit rubrics use the EIPS Grades 3–6 levels: Not Yet Meeting, Minimally Meeting, Solidifying, and Mastering Expectations, plus INS (insufficient evidence). No numbers or percentages. Solidifying Expectations is the target. The rubric is in `assets/rubric-scorer-*.js`. It saves `NYM`, `MME`, `SE`, `ME`, or `INS` on the device. Older saved scores (1–4) are read as 1 = Not Yet Meeting, 2 = Minimally Meeting, 3 = Solidifying, and 4 = Mastering. The Growth row "Respectful participation" is a learner attribute (Respects Self and Others), not achievement.
- **The mark book is PowerTeacher Pro.** The site saves only on the device in use.
- **Summative pieces:** Week 6; Weeks 11 and 12; Week 17 plus a Week 18 conversation; Week 24; Weeks 27 and 30; Week 36. Every other weekly sheet is formative. These are marked on each unit page and in the teacher keys.
- **Static teacher pages (plain HTML, not part of the app build):**
  - `assessment/`: hub
  - `assessment/checklist/`: printable class checklist, one landscape page per unit, blank class list
  - `assessment/reassess/`: one second-chance task per unit
  - `assessment/alternate-task/`: for students without a signed Growth opt-in
- **No family letter.** The site no longer has a family letter page (removed Oct 2026 at Mr. Fung's request). Teacher notes say: confirm family opt-in through the school's consent process before Week 25 (Alberta: opt-in, at least 30 calendar days' notice).
- **PDFs.** Teacher-key PDFs were regenerated from `/keys/` pages with faith notes off. The Growth student packet was regenerated from `/print/growth/` while unlocked.
- **Curriculum wording.** Organizing ideas, guiding questions, learning outcomes, and quoted KUSP statements match LearnAlberta PDE5 (read Oct 22, 2026) word for word. Growth has two guiding questions (`extraQuestions`) and two outcomes (`extraOutcomes`). Fertilization and implantation (Grade 5 knowledge) are taught in Week 27.

## Growth & Development lock (Weeks 25–30)

- `assets/growth-gate.js` asks for the classroom password on the Growth unit, keys, print and practice pages, and on Weeks 25–30. It stores only the SHA-256 hash. The unlock key is `g5h-growth-unlock-v2`, changed Oct 22, 2026 when the password changed, so every device has to enter the new password once. This is a courtesy lock, not real security: the lesson text is still in the public site files.
- **Growth PDFs** (`pdfs/Grade5-Health-Growth-and-Development.pdf` and `-Teacher-Keys.pdf`) are AES-256 encrypted with the classroom password. They are built from `/print/growth/` and `/keys/growth/` while unlocked, then encrypted with pikepdf. Their download links stay hidden until the device is unlocked.
- The combined `Grade5-Health-Teacher-Answer-Keys.pdf` leaves out Weeks 25–30. A one-page note points to the separate Growth keys PDF.
- Never commit the password in plain text.

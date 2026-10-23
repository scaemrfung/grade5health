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
- **Family letter.** The letter uses opt-in consent (Education Act, in effect Sept 1, 2025): at least 30 calendar days' notice before Week 25. Check EIPS procedure with the principal before sending. `assessment/letter-print.css` lets the letter print on two pages, with the return slip on page 2.
- **PDFs.** Teacher-key PDFs were regenerated from `/keys/` pages with faith notes off.

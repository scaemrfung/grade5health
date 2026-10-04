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

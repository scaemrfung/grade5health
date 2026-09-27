# Grade 5 Health

Weekly 30-minute Alberta Physical Education and Wellness lessons for Grade 5.

**Live site:** https://scaemrfung.github.io/grade5health/

Printable unit packets are on the home page and each unit page (Print packet or Download PDF).

**Teacher answer keys (not for students):**
- All 36 weeks: https://scaemrfung.github.io/grade5health/keys/
- Combined PDF: https://scaemrfung.github.io/grade5health/pdfs/Grade5-Health-Teacher-Answer-Keys.pdf

## "Updated" stamp and "Mr. Fung's sites" footer

`updated-stamp.js` adds the "Updated … MT" stamp and the shared "Mr. Fung's sites" footer to every page. The date is baked into the file (`SITE_UPDATED`), so pages make no GitHub API calls. Before committing a change, run:

    sh tools/bake-updated.sh && git add updated-stamp.js

The footer never links to Sub Day Plans (student-facing site).

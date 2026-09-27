/* ==========================================================================
   SCHOOL-YEAR SETTINGS — Grade 5 Health (the one file to review each August)
   Week N of the 36 lessons is placed on the real EIPS school calendar:
   breaks are skipped, three catch-up weeks are left open, and short weeks
   are labelled. Used by the home page "This week's lesson" card, the week
   pages (date range + short-week note), Progress and the Question box.
   ========================================================================== */
(function (root) {
  "use strict";
  /* ---- School calendar (EIPS Division Calendar 2026-27) ------------------
     Source: https://www.eips.ca/download/480909  (verified Sept 27, 2026)
     To roll over to a new year: change the dates in CAL below. Everything
     else (school weeks, lesson numbers, short-week notes) is worked out
     from these dates.
     Test any date with ?today=YYYY-MM-DD in the page URL.            */
  var CAL = {
    label: "2026–2027",
    timeZone: "America/Edmonton",
    firstDay: "2026-08-31",        // Classes begin (Mon)
    lastDay: "2027-06-28",         // Last instructional day (Mon)
    semester2: "2027-02-01",
    lessons: 36,
    // Catch-up weeks (Monday of the week). No new lesson; finish or review.
    catchUp: ["2026-12-14", "2027-02-01", "2027-06-21"],
    catchUpWhy: {
      "2026-12-14": "Catch-up week before Christmas (concerts, finish Week 14 or review)",
      "2027-02-01": "Catch-up week (Teachers' Convention Thu–Fri; semester 2 starts)",
      "2027-06-21": "Catch-up week (year-end: finish Week 36 or review)"
    },
    // Weekday non-school days: [first, last, reason]
    closed: [
      ["2026-09-07", "2026-09-07", "Labour Day"],
      ["2026-09-30", "2026-09-30", "Truth and Reconciliation Day"],
      ["2026-10-02", "2026-10-02", "PL day"],
      ["2026-10-12", "2026-10-12", "Thanksgiving"],
      ["2026-11-09", "2026-11-13", "November Break"],
      ["2026-12-21", "2027-01-01", "Christmas Break"],
      ["2027-01-29", "2027-01-29", "PL day"],
      ["2027-02-04", "2027-02-05", "Teachers' Convention"],
      ["2027-02-15", "2027-02-15", "Family Day"],
      ["2027-03-05", "2027-03-05", "PL day"],
      ["2027-03-19", "2027-03-19", "School closure"],
      ["2027-03-22", "2027-03-26", "Spring Break"],
      ["2027-03-29", "2027-03-29", "Easter Monday"],
      ["2027-05-07", "2027-05-07", "PL day"],
      ["2027-05-20", "2027-05-21", "School closure"],
      ["2027-05-24", "2027-05-24", "Victoria Day"],
      ["2027-06-29", "2027-06-29", "Operational day (no students)"]
    ],
    earlyDismissal: 3 // Wednesday: one hour early every week
  };

  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var DOW_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var DAY = 864e5;

  function parse(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ""));
    return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function iso(t) { return new Date(t).toISOString().slice(0, 10); }
  function dow(t) { return new Date(t).getUTCDay(); }
  function mondayOf(t) { var d = dow(t); return t - ((d + 6) % 7) * DAY; }
  function short(t) { var d = new Date(t); return MON[d.getUTCMonth()] + " " + d.getUTCDate(); }
  function dayLabel(t) { return DOW[dow(t)] + " " + short(t); }
  function range(a, b) {
    if (a === b) return dayLabel(a);
    var da = new Date(a), db = new Date(b);
    return short(a) + "–" + (da.getUTCMonth() === db.getUTCMonth() ? db.getUTCDate() : short(b));
  }

  var CLOSED = {};
  CAL.closed.forEach(function (c) {
    for (var t = parse(c[0]); t <= parse(c[1]); t += DAY) CLOSED[iso(t)] = c[2];
  });
  var FIRST = parse(CAL.firstDay), LAST = parse(CAL.lastDay);

  /* Build every week from the first Monday to the last day. */
  var WEEKS = [], BREAKS = [];
  (function build() {
    var lesson = 0, n = 0;
    for (var mon = mondayOf(FIRST); mon <= LAST; mon += 7 * DAY) {
      var days = [], off = [];
      for (var i = 0; i < 5; i++) {
        var t = mon + i * DAY, k = iso(t);
        if (t < FIRST || t > LAST) continue;
        if (CLOSED[k]) off.push({ date: k, why: CLOSED[k], label: dayLabel(t) });
        else days.push(k);
      }
      if (!days.length) {
        var why = off.length ? off[0].why : "No school";
        var prev = BREAKS[BREAKS.length - 1];
        if (prev && prev.name === why && parse(prev.end) + 3 * DAY >= mon) prev.end = iso(mon + 4 * DAY), prev.range = range(parse(prev.start), mon + 4 * DAY);
        else BREAKS.push({ name: why, start: iso(mon), end: iso(mon + 4 * DAY), range: range(mon, mon + 4 * DAY) });
        continue;
      }
      n++;
      var w = { n: n, monday: iso(mon), start: days[0], end: days[days.length - 1], days: days, off: off,
        range: range(parse(days[0]), parse(days[days.length - 1])) };
      if (CAL.catchUp.indexOf(iso(mon)) >= 0) { w.kind = "catchup"; w.lesson = null; w.why = CAL.catchUpWhy[iso(mon)] || "Catch-up week"; }
      else if (lesson >= CAL.lessons) { w.kind = "yearend"; w.lesson = null; w.why = "Last day of school"; }
      else { lesson++; w.kind = "lesson"; w.lesson = lesson; }
      var partialStart = mon < FIRST, partialEnd = mon + 4 * DAY > LAST;
      if (days.length < 5) {
        var bits = off.map(function (o) { return o.label + " off (" + o.why + ")"; });
        if (partialEnd && !off.length) w.note = days.length + "-day week: last day of school " + dayLabel(parse(days[days.length - 1]));
        else if (partialStart && !off.length) w.note = days.length + "-day week: first day of school " + dayLabel(parse(days[0]));
        else w.note = days.length + "-day week: " + bits.join(", ");
      } else w.note = "";
      WEEKS.push(w);
    }
  })();

  function weekOfLesson(n) { for (var i = 0; i < WEEKS.length; i++) if (WEEKS[i].lesson === n) return WEEKS[i]; return null; }
  function weekOfDate(k) {
    var mon = iso(mondayOf(parse(k)));
    for (var i = 0; i < WEEKS.length; i++) if (WEEKS[i].monday === mon) return WEEKS[i];
    return null;
  }
  function nextWeekAfter(k) { for (var i = 0; i < WEEKS.length; i++) if (WEEKS[i].start > k) return WEEKS[i]; return null; }
  function nextLessonWeekFrom(w) {
    for (var i = WEEKS.indexOf(w); i >= 0 && i < WEEKS.length; i++) if (WEEKS[i].lesson) return WEEKS[i];
    return null;
  }
  function breakOf(k) {
    for (var i = 0; i < BREAKS.length; i++) if (BREAKS[i].start <= k && k <= BREAKS[i].end) return BREAKS[i];
    return null;
  }

  /** Today's date (school time zone) as "YYYY-MM-DD". ?today=YYYY-MM-DD wins. */
  function todayISO() {
    try {
      var o = root && root.SCHOOL_TODAY;
      if (!o && root && root.location) o = new URLSearchParams(root.location.search).get("today");
      if (o && parse(o) != null) return o;
    } catch (e) { /* ignore */ }
    try {
      var p = new Intl.DateTimeFormat("en-CA", { timeZone: CAL.timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
      var g = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return g("year") + "-" + g("month") + "-" + g("day");
    } catch (e) { var d = new Date(); return iso(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); }
  }

  /** What to show for a date (default: today).
      kind: lesson | catchup | break | closed | before | summer | yearend
      lesson: the lesson number to feature; week: the school week it belongs to. */
  function status(k) {
    k = k || todayISO();
    var t = parse(k), d = dow(t), out = { date: k };
    if (t < FIRST) {
      var w1 = WEEKS[0];
      return { date: k, kind: "before", label: "First lesson", lesson: 1, week: w1,
        message: "School starts " + DOW_LONG[dow(parse(w1.start))] + " " + short(parse(w1.start)) + ". Week 1 is ready." };
    }
    if (t > LAST) {
      return { date: k, kind: "summer", label: "Start here", lesson: 1, week: null,
        message: "The " + CAL.label + " school year is over. Week 1 is here so you can plan for next year." };
    }
    // Weekend: look at the week that starts next Monday.
    var probe = k;
    if (d === 6 || d === 0) probe = iso(t + (d === 6 ? 2 : 1) * DAY);
    var w = weekOfDate(probe);
    if (!w) {
      var br = breakOf(probe) || { name: "No school", range: "" };
      var nx = nextWeekAfter(probe), nl = nx && nextLessonWeekFrom(nx);
      return { date: k, kind: "break", label: "Next lesson", lesson: nl ? nl.lesson : 36, week: nl,
        message: br.name + (br.range ? " (" + br.range + ")" : "") + " — no school." +
          (nx ? " Back " + DOW_LONG[dow(parse(nx.start))] + " " + short(parse(nx.start)) + (nl ? " with Week " + nl.lesson + "." : ".") : "") };
    }
    out.week = w;
    if (w.kind === "catchup") {
      var prevL = 0; for (var i = 0; i < WEEKS.length && WEEKS[i] !== w; i++) if (WEEKS[i].lesson) prevL = WEEKS[i].lesson;
      var nl2 = nextLessonWeekFrom(w);
      out.kind = "catchup"; out.label = "Catch-up week"; out.lesson = prevL || 1;
      out.message = "Catch-up week (" + w.range + "): no new lesson. Finish Week " + prevL + " or review." +
        (nl2 ? " Week " + nl2.lesson + " starts " + short(parse(nl2.start)) + "." : "") + (w.note ? " " + w.note + "." : "");
      return out;
    }
    if (w.kind === "yearend") {
      out.kind = "yearend"; out.label = "Last day"; out.lesson = CAL.lessons;
      out.message = "Last day of school: " + dayLabel(parse(w.start)) + ". Week " + CAL.lessons + " was the last lesson.";
      return out;
    }
    out.kind = "lesson"; out.label = "This week’s lesson"; out.lesson = w.lesson;
    if (CLOSED[k]) out.message = "No school today (" + CLOSED[k] + "). " + (w.note || "");
    else out.message = w.note || "";
    return out;
  }

  function weekInfo(n) {
    var w = weekOfLesson(n);
    if (!w) return null;
    return { lesson: n, week: w.n, range: w.range, note: w.note, start: w.start, end: w.end, days: w.days, off: w.off };
  }
  /** "Sept 28–Oct 1 · 3-day week: Wed Sept 30 off (...)" */
  function lessonLine(n) {
    var w = weekOfLesson(n);
    return w ? w.range + (w.note ? " · " + w.note : "") : "";
  }
  /** Is a date a school day? Returns null if yes, else the reason. */
  function closedReason(k) {
    var t = parse(k); if (t == null) return "Not a date";
    var d = dow(t);
    if (d === 0 || d === 6) return "Weekend";
    if (t < FIRST) return "Before the first day of school";
    if (t > LAST) return CLOSED[k] || "Summer (after the last day of school)";
    return CLOSED[k] || null;
  }

  var API = { config: CAL, weeks: WEEKS, breaks: BREAKS, todayISO: todayISO, status: status,
    weekOfLesson: weekOfLesson, weekInfo: weekInfo, lessonLine: lessonLine, closedReason: closedReason,
    range: function (a, b) { return range(parse(a), parse(b || a)); } };
  if (root) root.SCHOOL_YEAR = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  if (!root || !root.document) return;

  /* Week pages (/grade5health/week/N/): add the date range and short-week note
     under the lesson title. Added after React renders, like lesson-audio.js. */
  var BASE = "/grade5health";
  function weekNum() {
    var p = location.pathname.replace(/\/+$/, "");
    var m = p.slice(p.indexOf(BASE) === 0 ? BASE.length : 0).match(/^\/week\/(\d+)$/);
    var n = m ? +m[1] : 0;
    return n >= 1 && n <= CAL.lessons ? n : 0;
  }
  function styles() {
    if (document.getElementById("sy-style")) return;
    var s = document.createElement("style");
    s.id = "sy-style";
    s.textContent = ".sy-dates{margin-top:.5rem;display:flex;flex-wrap:wrap;align-items:center;gap:.4rem;font-size:.875rem;color:var(--color-muted,#6b6158)}" +
      ".sy-dates b{font-weight:600;color:var(--color-foreground,#2b2118)}" +
      ".sy-pill{display:inline-block;border-radius:999px;padding:.1rem .55rem;font-size:.72rem;font-weight:600;background:var(--color-primary-soft,#e6f0ef);color:var(--color-primary,#0f6b6b)}" +
      ".sy-short{display:inline-block;border-radius:10px;padding:.15rem .55rem;line-height:1.35;font-size:.72rem;font-weight:600;background:#fdf1dc;color:#8a5a00}";
    document.head.appendChild(s);
  }
  function inject() {
    var n = weekNum();
    var old = document.getElementById("sy-dates");
    if (!n) { if (old) old.remove(); return; }
    if (old && old.getAttribute("data-week") === String(n)) return;
    var h1 = document.querySelector("main h1") || document.querySelector("h1");
    if (!h1 || !h1.parentElement) return;
    if (old) old.remove();
    styles();
    var w = weekOfLesson(n), st = status();
    var el = document.createElement("p");
    el.id = "sy-dates"; el.className = "sy-dates"; el.setAttribute("data-week", String(n));
    var html = "<b>" + w.range + "</b>";
    if (st.kind === "lesson" && st.lesson === n) html += ' <span class="sy-pill">This week</span>';
    if (w.note) html += ' <span class="sy-short">' + w.note + "</span>";
    el.innerHTML = html;
    h1.parentElement.appendChild(el);
  }
  var queued = false;
  function soon() { if (queued) return; queued = true; setTimeout(function () { queued = false; inject(); }, 60); }
  function start() {
    inject();
    new MutationObserver(soon).observe(document.body, { childList: true, subtree: true });
    window.addEventListener("popstate", soon);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();

})(typeof window !== "undefined" ? window : null);

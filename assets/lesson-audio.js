(() => {
  const BASE = "/grade5health";

  function path() {
    let p = location.pathname || "/";
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p;
  }

  function weekNum() {
    const rel = path().startsWith(BASE) ? path().slice(BASE.length) || "/" : path();
    const m = rel.match(/^\/week\/(\d+)$/);
    if (!m) return null;
    const n = Number(m[1]);
    return n >= 1 && n <= 36 ? n : null;
  }

  function ensureStyles() {
    if (document.getElementById("g5h-lesson-audio-style")) return;
    const s = document.createElement("style");
    s.id = "g5h-lesson-audio-style";
    s.textContent = `
.g5h-audio-row{margin-top:.75rem;margin-bottom:.25rem;display:flex;flex-direction:column;gap:.35rem}
.g5h-audio-row label{font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--color-primary,#0f6b6b)}
.g5h-audio-row audio{width:100%;max-width:28rem;height:2.5rem}
.g5h-audio-row.faith{margin-top:.85rem}
@media print{.g5h-audio-row{display:none!important}}
`;
    document.documentElement.appendChild(s);
  }

  function makeRow(id, label, src, extraClass) {
    const row = document.createElement("div");
    row.className = "g5h-audio-row" + (extraClass ? " " + extraClass : "");
    row.id = id;
    const lab = document.createElement("label");
    lab.setAttribute("for", id + "-el");
    lab.textContent = label;
    const audio = document.createElement("audio");
    audio.id = id + "-el";
    audio.controls = true;
    audio.preload = "metadata";
    audio.src = src;
    row.appendChild(lab);
    row.appendChild(audio);
    return row;
  }

  function clearInjected() {
    document.querySelectorAll(".g5h-audio-row").forEach((el) => el.remove());
  }

  function inject() {
    const w = weekNum();
    if (!w) {
      clearInjected();
      return;
    }
    ensureStyles();
    const ww = String(w).padStart(2, "0");
    const storySrc = `${BASE}/audio/week-${ww}-story.mp3`;
    const faithSrc = `${BASE}/audio/week-${ww}-faith.mp3`;

    // Story player under "Example story (read aloud)"
    if (!document.getElementById("g5h-audio-story")) {
      const h2 = [...document.querySelectorAll("h2")].find((el) =>
        /example story/i.test(el.textContent || "")
      );
      if (h2) {
        const row = makeRow("g5h-audio-story", "Listen to the story", storySrc);
        // Prefer insert after the heading row (h2 may be inside a flex header)
        const header = h2.closest("div.flex") || h2;
        header.insertAdjacentElement("afterend", row);
      }
    }

    // Faith player inside faith aside when visible
    if (!document.getElementById("g5h-audio-faith")) {
      const faithLabel = [...document.querySelectorAll("p,span,div")].find((el) =>
        /faith connection/i.test(el.textContent || "")
      );
      if (faithLabel) {
        const aside = faithLabel.closest("aside") || faithLabel.parentElement;
        if (aside) {
          const row = makeRow(
            "g5h-audio-faith",
            "Listen to the Bible verse",
            faithSrc,
            "faith"
          );
          // Place after the verse blockquote if present
          const bq = aside.querySelector("blockquote");
          if (bq) bq.insertAdjacentElement("afterend", row);
          else aside.appendChild(row);
        }
      }
    }
  }

  let obs = null;
  function watch() {
    if (obs) obs.disconnect();
    inject();
    obs = new MutationObserver(() => inject());
    if (document.body) {
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }

  function patchHistory() {
    const wrap = (type) => {
      const orig = history[type];
      history[type] = function () {
        const ret = orig.apply(this, arguments);
        queueMicrotask(watch);
        return ret;
      };
    };
    wrap("pushState");
    wrap("replaceState");
    window.addEventListener("popstate", watch);
  }

  function boot() {
    patchHistory();
    watch();
    setTimeout(watch, 400);
    setTimeout(watch, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

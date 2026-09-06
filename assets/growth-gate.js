(() => {
  const STORAGE_KEY = "g5h-growth-unlock-v1";
  // SHA-256 of the classroom password (courtesy lock — not server auth)
  const PASS_HASH =
    "ec73439877864f41cc055a07121539abd8f519c4fa2a92ce5e87c02cc6fcc673";
  const BASE = "/grade5health";

  function path() {
    let p = location.pathname || "/";
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p;
  }

  function isLockedPath(p) {
    const rel = p.startsWith(BASE) ? p.slice(BASE.length) || "/" : p;
    if (rel === "/unit/growth") return true;
    if (rel === "/practice/growth") return true;
    if (rel === "/print/growth") return true;
    if (rel === "/keys/growth") return true;
    if (/^\/week\/(25|26|27|28|29|30)$/.test(rel)) return true;
    return false;
  }

  function unlocked() {
    try {
      return localStorage.getItem(STORAGE_KEY) === PASS_HASH;
    } catch {
      return false;
    }
  }

  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(buf)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  let root = null;

  function ensureStyles() {
    if (document.getElementById("g5h-growth-gate-style")) return;
    const s = document.createElement("style");
    s.id = "g5h-growth-gate-style";
    s.textContent = `
#g5h-growth-gate{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:1.25rem;background:rgba(14,40,40,.72);backdrop-filter:blur(6px)}
#g5h-growth-gate[hidden]{display:none!important}
#g5h-growth-gate .card{width:min(28rem,100%);border-radius:18px;border:1px solid #c5d4d3;background:#f7fbfb;box-shadow:0 8px 32px rgba(20,50,50,.2);padding:1.35rem 1.35rem 1.2rem;color:#143232;font-family:Figtree,system-ui,sans-serif}
#g5h-growth-gate h1{margin:0;font-family:Newsreader,Georgia,serif;font-size:1.45rem;font-weight:600;letter-spacing:-0.02em}
#g5h-growth-gate p{margin:.55rem 0 0;font-size:.92rem;line-height:1.45;color:#4a6666}
#g5h-growth-gate label{display:block;margin-top:1rem;font-size:.75rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#0f6b6b}
#g5h-growth-gate input{margin-top:.35rem;width:100%;box-sizing:border-box;height:2.75rem;border-radius:10px;border:1px solid #9bb0ae;padding:0 .85rem;font-size:1rem;background:#fff}
#g5h-growth-gate input:focus{outline:2px solid #0f6b6b;outline-offset:1px}
#g5h-growth-gate .row{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}
#g5h-growth-gate button{height:2.75rem;border-radius:10px;border:0;padding:0 1rem;font-size:.92rem;font-weight:600;cursor:pointer}
#g5h-growth-gate .primary{background:#0f6b6b;color:#eef7f6}
#g5h-growth-gate .ghost{background:transparent;color:#0f6b6b;border:1px solid #9bb0ae}
#g5h-growth-gate .err{margin-top:.65rem;font-size:.85rem;color:#8b3a2a;min-height:1.2em}
html.g5h-growth-locked body{overflow:hidden}
`;
    document.documentElement.appendChild(s);
  }

  function ensureRoot() {
    if (root && document.body.contains(root)) return root;
    ensureStyles();
    root = document.createElement("div");
    root.id = "g5h-growth-gate";
    root.hidden = true;
    root.innerHTML = `
      <div class="card" role="dialog" aria-modal="true" aria-labelledby="g5h-growth-gate-title">
        <h1 id="g5h-growth-gate-title">Growth &amp; Development is locked</h1>
        <p>This unit (weeks 25–30) is marked sensitive. Enter the classroom password to open it on this device.</p>
        <form id="g5h-growth-gate-form">
          <label for="g5h-growth-gate-pass">Password</label>
          <input id="g5h-growth-gate-pass" type="password" autocomplete="current-password" required />
          <div class="row">
            <button class="primary" type="submit">Unlock</button>
            <button class="ghost" type="button" id="g5h-growth-gate-back">Back to year map</button>
          </div>
          <p class="err" id="g5h-growth-gate-err" aria-live="polite"></p>
        </form>
      </div>`;
    (document.body || document.documentElement).appendChild(root);
    root.querySelector("#g5h-growth-gate-form").addEventListener("submit", onSubmit);
    root.querySelector("#g5h-growth-gate-back").addEventListener("click", () => {
      location.href = BASE + "/";
    });
    return root;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    const input = root.querySelector("#g5h-growth-gate-pass");
    const err = root.querySelector("#g5h-growth-gate-err");
    err.textContent = "";
    const hex = await sha256Hex(input.value || "");
    if (hex !== PASS_HASH) {
      err.textContent = "That password doesn’t match. Try again.";
      input.select();
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, PASS_HASH);
    } catch {}
    hide();
  }

  function show() {
    const el = ensureRoot();
    el.hidden = false;
    document.documentElement.classList.add("g5h-growth-locked");
    const input = el.querySelector("#g5h-growth-gate-pass");
    if (input) setTimeout(() => input.focus(), 50);
  }

  function hide() {
    if (root) root.hidden = true;
    document.documentElement.classList.remove("g5h-growth-locked");
  }

  function sync() {
    if (isLockedPath(path()) && !unlocked()) show();
    else hide();
  }

  function patchHistory() {
    const wrap = (type) => {
      const orig = history[type];
      history[type] = function () {
        const ret = orig.apply(this, arguments);
        queueMicrotask(sync);
        return ret;
      };
    };
    wrap("pushState");
    wrap("replaceState");
    window.addEventListener("popstate", sync);
  }

  function boot() {
    patchHistory();
    sync();
    // SPA may finish routing slightly later
    setTimeout(sync, 300);
    setTimeout(sync, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

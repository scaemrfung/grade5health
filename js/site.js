(function () {
  const lessons = () => document.querySelectorAll("details.lesson");
  document.getElementById("expandAll")?.addEventListener("click", () =>
    lessons().forEach((d) => (d.open = true))
  );
  document.getElementById("collapseAll")?.addEventListener("click", () =>
    lessons().forEach((d) => (d.open = false))
  );

  document.querySelectorAll("[data-open]").forEach((a) => {
    a.addEventListener("click", () => {
      const id = a.getAttribute("data-open");
      const el = document.getElementById(id);
      if (el) el.open = true;
    });
  });

  document.querySelectorAll("[data-print]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-print");
      const el = document.getElementById(id);
      if (!el) return;
      document.querySelectorAll(".printing").forEach((n) => n.classList.remove("printing"));
      const lesson = el.closest("details.lesson") || (el.matches("details.lesson") ? el : null);
      if (lesson) {
        lesson.open = true;
        lesson.classList.add("printing");
      }
      el.classList.add("printing");
      const wrap = el.closest("details.teacher-answers");
      if (wrap) {
        wrap.open = true;
        wrap.classList.add("printing");
      }
      document.body.classList.add("print-sheet");
      const cleanup = () => {
        document.body.classList.remove("print-sheet");
        document.querySelectorAll(".printing").forEach((n) => n.classList.remove("printing"));
        window.removeEventListener("afterprint", cleanup);
      };
      window.addEventListener("afterprint", cleanup);
      window.print();
      setTimeout(cleanup, 500);
    });
  });

  const btn = document.getElementById("backTop");
  if (btn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) btn.classList.add("show");
      else btn.classList.remove("show");
    });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
})();

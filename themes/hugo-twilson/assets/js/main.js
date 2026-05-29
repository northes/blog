(function () {
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initBlurChars() {
    if (prefersReducedMotion) return;
    document.querySelectorAll("[data-blur-text]").forEach(function (el) {
      var text = el.getAttribute("data-blur-text");
      if (!text) return;
      el.textContent = "";
      var sr = document.createElement("span");
      sr.className = "sr-only";
      sr.textContent = text;
      el.appendChild(sr);
      Array.from(text).forEach(function (ch, i) {
        var span = document.createElement("span");
        span.className = "animate-blur-in-char";
        span.style.animationDelay = 0.2 + i * 0.025 + "s";
        span.setAttribute("aria-hidden", "true");
        span.textContent = ch;
        el.appendChild(span);
      });
    });
  }

  function initHighlightVideos() {
    document.querySelectorAll("[data-highlight-video]").forEach(function (wrap) {
      var btn = wrap.querySelector(".highlight-card__play");
      var video = wrap.querySelector("video");
      if (!video) return;
      if (!btn) return;
      btn.addEventListener("click", function () {
        btn.hidden = true;
        var poster = wrap.querySelector(".highlight-card__poster");
        if (poster) poster.hidden = true;
        video.hidden = false;
        video.controls = true;
        video.play();
      });
    });
  }

  function initBackTop() {
    var btn = document.getElementById("back-top");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      if (window.scrollY > 200) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
    });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  initBlurChars();
  initHighlightVideos();
  initBackTop();
})();

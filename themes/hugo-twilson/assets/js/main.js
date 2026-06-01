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

  function initClickableCards() {
    document.querySelectorAll("[data-card-link]").forEach(function (card) {
      function shouldIgnore(target) {
        return !!target.closest("a, button, input, select, textarea, label, video");
      }

      function openCard(event) {
        var href = card.getAttribute("data-card-link");
        if (!href) return;
        var target = card.getAttribute("data-card-target") || "_self";
        var openInNewTab = target === "_blank" || event.metaKey || event.ctrlKey || event.button === 1;
        if (openInNewTab) {
          window.open(href, "_blank", "noopener");
          return;
        }
        window.location.href = href;
      }

      card.addEventListener("click", function (event) {
        if (shouldIgnore(event.target)) return;
        openCard(event);
      });

      card.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        if (shouldIgnore(event.target)) return;
        event.preventDefault();
        openCard(event);
      });
    });
  }

  initBlurChars();
  initHighlightVideos();
  initBackTop();
  initClickableCards();
})();

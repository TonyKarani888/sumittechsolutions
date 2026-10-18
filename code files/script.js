(() => {
  const carousel = document.querySelector("#hero-carousel");
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".carousel-dot"));
  const previousButton = document.querySelector("#slide-previous");
  const nextButton = document.querySelector("#slide-next");
  const pauseButton = document.querySelector("#slide-pause");
  const currentSlideLabel = document.querySelector("#current-slide");
  const menuToggle = document.querySelector("#menu-toggle");
  const siteNav = document.querySelector("#site-nav");
  const navLinks = Array.from(document.querySelectorAll(".site-nav__link"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (slides.length) {
    let currentIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    let timerId = null;
    let isPaused = reducedMotion;
    let isPointerInside = false;
    const delay = 3000;

    function stopTimer() {
      if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
      }
    }

    function startTimer() {
      stopTimer();
      if (!isPaused && !isPointerInside && slides.length > 1) {
        timerId = window.setInterval(() => showSlide(currentIndex + 1, false), delay);
      }
    }

    function updatePauseButton() {
      if (!pauseButton) return;
      pauseButton.innerHTML = isPaused
        ? '<i class="fa-solid fa-play" aria-hidden="true"></i><span>Play</span>'
        : '<i class="fa-solid fa-pause" aria-hidden="true"></i><span>Pause</span>';
      pauseButton.setAttribute("aria-label", isPaused ? "Resume automatic slide rotation" : "Pause automatic slide rotation");
      pauseButton.setAttribute("aria-pressed", String(isPaused));
    }

    function showSlide(index, resetTimer = true) {
      currentIndex = ((index % slides.length) + slides.length) % slides.length;

      slides.forEach((slide, slideIndex) => {
        const isCurrent = slideIndex === currentIndex;
        slide.hidden = !isCurrent;
        slide.classList.toggle("is-active", isCurrent);
        slide.setAttribute("aria-label", `Slide ${slideIndex + 1} of ${slides.length}`);
      });

      dots.forEach((dot, dotIndex) => {
        const isCurrent = dotIndex === currentIndex;
        dot.classList.toggle("is-active", isCurrent);
        if (isCurrent) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });

      if (currentSlideLabel) currentSlideLabel.textContent = String(currentIndex + 1).padStart(2, "0");
      if (resetTimer) startTimer();
    }

    previousButton?.addEventListener("click", () => showSlide(currentIndex - 1));
    nextButton?.addEventListener("click", () => showSlide(currentIndex + 1));
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const index = Number(dot.dataset.slideTo);
        if (Number.isInteger(index)) showSlide(index);
      });
    });

    pauseButton?.addEventListener("click", () => {
      isPaused = !isPaused;
      updatePauseButton();
      startTimer();
    });

    carousel?.addEventListener("pointerenter", () => {
      isPointerInside = true;
      stopTimer();
    });
    carousel?.addEventListener("pointerleave", () => {
      isPointerInside = false;
      startTimer();
    });

    if (reducedMotion && pauseButton) pauseButton.hidden = true;
    updatePauseButton();
    showSlide(currentIndex, false);
    startTimer();
  }

  // Mobile navigation
  function closeMenu() {
    if (!menuToggle || !siteNav) return;
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu();
    } else {
      siteNav?.classList.add("is-open");
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Close navigation");
      menuToggle.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
    }
  });

  navLinks.forEach((link) => link.addEventListener("click", () => {
    closeMenu();
    navLinks.forEach((item) => item.classList.toggle("is-current", item === link));
  }));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 780) closeMenu();
  });

  // Each Book a call button reveals that section's contact details.
  document.querySelectorAll(".book-call-button").forEach((button) => {
    button.addEventListener("click", () => {
      const panelId = button.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      const shouldOpen = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(shouldOpen));
      panel.hidden = !shouldOpen;
      button.innerHTML = shouldOpen
        ? 'Close contact details <i class="fa-solid fa-xmark" aria-hidden="true"></i>'
        : 'Book a call <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
    });
  });

  const year = document.querySelector("#copyright-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();

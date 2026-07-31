(() => {
  const frontPreviewCaptionText = {
    "1 to 2": "Front example: 2 window sets.",
    "3 to 4": "Front example: 4 window sets.",
    "5 to 6": "Front example: 5 window sets.",
    "7 to 8": "Front example: 7 window sets."
  };

  const style = document.createElement("style");
  style.textContent = `
    @media (min-width: 641px) {
      .counter-control {
        grid-template-columns: 42px minmax(96px, auto) 42px;
      }

      .counter-control output {
        padding: 0 10px;
        font-size: 1.05rem;
        line-height: 1.1;
        white-space: nowrap;
      }

      .window-set-preview {
        align-content: center;
        padding-top: 34px;
      }
    }

    .mobile-price-builder-intro {
      display: none;
    }

    @media (max-width: 640px) {
      .price-builder-panel > .price-builder-intro {
        display: none !important;
      }

      .window-set-preview > .mobile-price-builder-intro {
        display: block !important;
        width: 100%;
        max-width: none;
        margin: 0 0 12px;
        text-align: left;
      }

      .mobile-action-bar {
        opacity: 0;
        pointer-events: none;
        transform: translateY(calc(100% + 24px));
        transition: opacity 180ms ease, transform 220ms ease;
      }

      .mobile-action-bar.mobile-banner-visible {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
      }
    }
  `;
  document.head.append(style);

  const updateCaption = () => {
    const frontCount = document.querySelector("#front-window-count");
    const caption = document.querySelector("#window-preview-caption");
    if (!frontCount || !caption) return;

    const captionText = frontPreviewCaptionText[frontCount.textContent.trim()];
    if (captionText) caption.textContent = captionText;
  };

  const addMobileIntro = () => {
    const originalIntro = document.querySelector(".price-builder-panel > .price-builder-intro");
    const preview = document.querySelector(".window-set-preview");
    const house = preview?.querySelector(".preview-house");

    if (!originalIntro || !preview || !house) return;

    let mobileIntro = preview.querySelector(".mobile-price-builder-intro");
    if (!mobileIntro) {
      mobileIntro = originalIntro.cloneNode(true);
      mobileIntro.classList.add("mobile-price-builder-intro");
      preview.insertBefore(mobileIntro, house);
    }
  };

  const initialiseMobileBanner = () => {
    const banner = document.querySelector(".mobile-action-bar");
    const quoteSection = document.querySelector("#quote");

    if (!banner || !quoteSection) return;

    let hasBeenRevealed = false;

    const revealBanner = () => {
      if (hasBeenRevealed) return;
      hasBeenRevealed = true;
      banner.classList.add("mobile-banner-visible");
    };

    const checkPosition = () => {
      if (window.innerWidth > 640 || hasBeenRevealed) return;
      const quoteTop = quoteSection.getBoundingClientRect().top;
      if (quoteTop <= window.innerHeight) revealBanner();
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            revealBanner();
            observer.disconnect();
          }
        },
        { threshold: 0.01 }
      );
      observer.observe(quoteSection);
    }

    window.addEventListener("scroll", checkPosition, { passive: true });
    window.addEventListener("resize", checkPosition);
    checkPosition();
  };

  const initialise = () => {
    addMobileIntro();
    updateCaption();
    initialiseMobileBanner();

    document
      .querySelectorAll('[data-counter-action][data-counter-target="front"]')
      .forEach((button) => {
        button.addEventListener("click", () => window.setTimeout(updateCaption, 0));
      });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();
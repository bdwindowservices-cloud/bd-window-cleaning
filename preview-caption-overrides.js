(() => {
  const frontPreviewCaptionText = {
    "1 to 2": "Front example: 2 window sets.",
    "3 to 4": "Front example: 4 window sets.",
    "5 to 6": "Front example: 5 window sets.",
    "7 to 8": "Front example: 7 window sets."
  };

  const style = document.createElement("style");
  style.textContent = `
    #services {
      scroll-margin-top: 96px;
    }

    @media (max-width: 900px) {
      #services {
        scroll-margin-top: 132px;
      }
    }

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

      .quote-total {
        display: none !important;
      }

      .counter-control {
        grid-template-columns: 36px minmax(78px, auto) 36px;
      }

      .counter-control button {
        width: 36px;
        min-width: 36px;
        height: 36px;
        min-height: 36px;
        padding: 0;
      }

      .counter-control output {
        min-height: 36px;
        padding: 5px 8px;
        line-height: 1.05;
      }

      .preview-house.mobile-three-four-fit {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 0;
      }

      .preview-house.mobile-three-four-fit .house-preview-photo {
        width: 100%;
        height: auto;
        min-height: 0 !important;
        aspect-ratio: auto;
        object-fit: contain !important;
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

  const updateMobileThreeFourImageFit = () => {
    const frontCount = document.querySelector("#front-window-count");
    const previewHouse = document.querySelector(".preview-house");
    if (!frontCount || !previewHouse) return;

    const useFullImage = window.innerWidth <= 640 && frontCount.textContent.trim() === "3 to 4";
    previewHouse.classList.toggle("mobile-three-four-fit", useFullImage);
  };

  const updateFrontInstruction = () => {
    const instruction = document.querySelector('[data-counter-card="front"] span');
    if (instruction) instruction.textContent = "Choose the best match";
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

  const showExistingMobilePrice = () => {
    if (window.innerWidth > 640) return;

    const bannerLink = document.querySelector("#mobile-quote-amount");
    const price = document.querySelector("#quote-total-price");
    const monthly = document.querySelector("#quote-total-monthly");
    if (!bannerLink || !price || !monthly) return;

    const priceText = price.textContent.trim();
    const monthlyText = monthly.textContent.trim();
    if (!priceText || priceText === "£-") return;

    if (priceText === "Bespoke quote") {
      bannerLink.innerHTML = `<span>${priceText}</span><small>We will confirm the price</small>`;
    } else {
      bannerLink.innerHTML = `<span>${priceText} per clean</span><small>${monthlyText}</small>`;
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
      showExistingMobilePrice();
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
    window.addEventListener("resize", () => {
      checkPosition();
      updateMobileThreeFourImageFit();
    });
    checkPosition();
  };

  const refreshPreviewEnhancements = () => {
    queueMicrotask(() => {
      updateCaption();
      updateMobileThreeFourImageFit();
    });
  };

  const initialise = () => {
    addMobileIntro();
    updateCaption();
    updateFrontInstruction();
    updateMobileThreeFourImageFit();
    initialiseMobileBanner();

    document
      .querySelectorAll('[data-counter-action][data-counter-target="front"]')
      .forEach((button) => {
        button.addEventListener("click", refreshPreviewEnhancements);
      });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();
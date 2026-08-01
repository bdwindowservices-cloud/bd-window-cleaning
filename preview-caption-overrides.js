(() => {
  const frontPreviewCaptionText = {
    "1 to 2": "Front example: 2 window sets.",
    "3 to 4": "Front example: 4 window sets.",
    "5 to 6": "Front example: 5 window sets.",
    "7 to 8": "Front example: 7 window sets."
  };

  const frontPrices = {
    "1 to 2": 12,
    "3 to 4": 15,
    "5 to 6": 18,
    "7 to 8": 21
  };

  const backPrices = {
    "0": 0,
    "1 to 2": 5,
    "3 to 4": 8,
    "5 to 6": 11,
    "7 to 8": 14
  };

  let customBackSevenToEight = false;

  const formatMoney = (value) => Number.isInteger(value) ? `£${value}` : `£${value.toFixed(2)}`;

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

  const applyUpdatedPricing = () => {
    const frontOutput = document.querySelector("#front-window-count");
    const backOutput = document.querySelector("#back-window-count");
    const frontOnly = document.querySelector("#front-only-clean");
    const totalPriceElement = document.querySelector("#quote-total-price");
    const monthlyElement = document.querySelector("#quote-total-monthly");
    const estimatedInput = document.querySelector("#estimated-quote");
    const backInput = document.querySelector("#back-side-window-sets-input");

    if (!frontOutput || !backOutput || !totalPriceElement || !monthlyElement) return;

    if (customBackSevenToEight && !frontOnly?.checked) {
      backOutput.textContent = "7 to 8";
      if (backInput) backInput.value = "Back or side: 7 to 8 sets";
    }

    const frontLabel = frontOutput.textContent.trim();
    if (frontLabel === "9+ bespoke") return;

    const frontPrice = frontPrices[frontLabel];
    if (typeof frontPrice !== "number") return;

    const backLabel = frontOnly?.checked ? "0" : backOutput.textContent.trim();
    const backPrice = backPrices[backLabel] ?? 0;
    const selectedExtra = document.querySelector('[data-extra-button].is-selected');
    const extraPrice = selectedExtra ? Number(selectedExtra.dataset.extraPrice || 0) : 0;

    const total = frontPrice + backPrice + extraPrice;
    const monthly = total * 2 / 3;
    const priceText = formatMoney(total);
    const monthlyText = `${formatMoney(monthly)} per month`;

    totalPriceElement.textContent = priceText;
    monthlyElement.textContent = monthlyText;
    if (estimatedInput) estimatedInput.value = `${priceText} (${formatMoney(monthly)} per month)`;

    const desktopMain = document.querySelector("#desktop-estimate-main");
    const desktopSub = document.querySelector("#desktop-estimate-sub");
    if (desktopMain && desktopMain.textContent.includes("£")) desktopMain.textContent = `${priceText} per clean`;
    if (desktopSub && desktopSub.textContent) desktopSub.textContent = monthlyText;

    showExistingMobilePrice();
  };

  const syncBackButtons = () => {
    const increase = document.querySelector('[data-counter-action="increase"][data-counter-target="back"]');
    const decrease = document.querySelector('[data-counter-action="decrease"][data-counter-target="back"]');
    const output = document.querySelector("#back-window-count");
    const frontOnly = document.querySelector("#front-only-clean");

    if (!increase || !decrease || !output || frontOnly?.checked) return;

    if (customBackSevenToEight) {
      output.textContent = "7 to 8";
      increase.disabled = true;
      decrease.disabled = false;
    } else if (output.textContent.trim() === "5 to 6") {
      increase.disabled = false;
    }
  };

  const initialiseBackSevenToEight = () => {
    const increase = document.querySelector('[data-counter-action="increase"][data-counter-target="back"]');
    const decrease = document.querySelector('[data-counter-action="decrease"][data-counter-target="back"]');
    const output = document.querySelector("#back-window-count");

    if (!increase || !decrease || !output) return;

    increase.addEventListener("click", (event) => {
      if (output.textContent.trim() !== "5 to 6" || customBackSevenToEight) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      customBackSevenToEight = true;
      output.textContent = "7 to 8";
      syncBackButtons();
      applyUpdatedPricing();
    }, true);

    decrease.addEventListener("click", (event) => {
      if (!customBackSevenToEight) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      customBackSevenToEight = false;
      output.textContent = "5 to 6";
      syncBackButtons();
      applyUpdatedPricing();
    }, true);

    syncBackButtons();
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
    window.addEventListener("resize", checkPosition);
    checkPosition();
  };

  const initialise = () => {
    addMobileIntro();
    updateCaption();
    updateFrontInstruction();
    initialiseMobileBanner();
    initialiseBackSevenToEight();
    applyUpdatedPricing();

    document
      .querySelectorAll('[data-counter-action], [data-extra-button], #front-only-clean')
      .forEach((control) => {
        control.addEventListener("click", () => {
          window.setTimeout(() => {
            updateCaption();
            syncBackButtons();
            applyUpdatedPricing();
          }, 0);
        });
      });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();
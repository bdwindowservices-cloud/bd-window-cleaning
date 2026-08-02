(() => {
  const exactPictureCaptions = {
    "1 to 2": "Front example: 2 window sets.",
    "3 to 4": "Front example: 4 window sets.",
    "5 to 6": "Front example: 5 window sets.",
    "7 to 8": "Front example: 7 window sets.",
    "9+ bespoke": "9+ front window sets selected. We will confirm a bespoke quote."
  };

  const frontCount = document.querySelector("#front-window-count");
  const caption = document.querySelector("#window-preview-caption");

  if (frontCount && caption) {
    let applyingCaption = false;

    const applyExactPictureCaption = () => {
      if (applyingCaption) return;

      const exactCaption = exactPictureCaptions[frontCount.textContent.trim()];
      if (!exactCaption || caption.textContent.trim() === exactCaption) return;

      applyingCaption = true;
      caption.textContent = exactCaption;
      applyingCaption = false;
    };

    const scheduleExactPictureCaption = () => {
      queueMicrotask(applyExactPictureCaption);
      window.setTimeout(applyExactPictureCaption, 0);
      window.requestAnimationFrame(applyExactPictureCaption);
    };

    const frontCountObserver = new MutationObserver(scheduleExactPictureCaption);
    frontCountObserver.observe(frontCount, {
      childList: true,
      characterData: true,
      subtree: true
    });

    const captionObserver = new MutationObserver(applyExactPictureCaption);
    captionObserver.observe(caption, {
      childList: true,
      characterData: true,
      subtree: true
    });

    document
      .querySelectorAll('[data-counter-action][data-counter-target="front"]')
      .forEach((button) => {
        button.addEventListener("click", scheduleExactPictureCaption);
      });

    scheduleExactPictureCaption();
  }

  const quoteDetails = document.querySelector("#quote-details");
  const quoteNextButton = document.querySelector("#quote-next-button");
  const bookingDateStep = document.querySelector("#booking-date-step");
  const bookingDateOptions = document.querySelectorAll("[data-booking-option]");
  const bookingNextHint = document.querySelector("#booking-next-hint");
  const bookingNextButton = document.querySelector("#booking-next-button");
  const bookCleanButton = document.querySelector("#book-clean-button");
  const desktopEstimateCta = document.querySelector("#desktop-estimate-cta");
  const mobileQuoteAmount = document.querySelector("#mobile-quote-amount");
  const appointmentPrompt = "Step 3: choose your appointment date and time";
  const chooseDateLabel = "Choose a date";
  const bookingSummaryLabel = "Booking Summary";
  const datePromptSuffix = " - Choose a cleaning date";

  const hasSelectedBookingDate = () =>
    Array.from(bookingDateOptions).some((option) => option.checked);

  const removeDatePromptFromMobileBanner = () => {
    const mobileMain = mobileQuoteAmount?.querySelector("span");
    if (mobileMain && mobileMain.textContent.includes(datePromptSuffix)) {
      mobileMain.textContent = mobileMain.textContent.replace(datePromptSuffix, "");
    }
  };

  const updateAppointmentStep = () => {
    if (!bookingDateStep) return;

    const legend = bookingDateStep.querySelector(":scope > legend");
    if (legend) legend.remove();

    bookingDateStep.setAttribute("aria-label", "Choose your appointment date and time");

    const stepTwoIsOpen = Boolean(quoteDetails && !quoteDetails.hidden);
    const stepThreeIsOpen = !bookingDateStep.hidden;
    const dateSelected = hasSelectedBookingDate();
    const targetButtonLabel = dateSelected ? bookingSummaryLabel : chooseDateLabel;

    if (quoteNextButton && quoteNextButton.hidden !== stepTwoIsOpen) {
      quoteNextButton.hidden = stepTwoIsOpen;
    }

    if (bookingNextButton && bookingNextButton.hidden !== stepThreeIsOpen) {
      bookingNextButton.hidden = stepThreeIsOpen;
    }

    if (
      bookingNextHint &&
      stepThreeIsOpen &&
      bookingNextHint.textContent.trim() !== appointmentPrompt
    ) {
      bookingNextHint.textContent = appointmentPrompt;
    }

    if (bookCleanButton) {
      const isSubmitting =
        bookCleanButton.disabled &&
        bookCleanButton.textContent.toLowerCase().includes("sending");

      if (!isSubmitting && bookCleanButton.textContent.trim() !== targetButtonLabel) {
        bookCleanButton.textContent = targetButtonLabel;
      }
    }

    if (desktopEstimateCta) {
      const currentLabel = desktopEstimateCta.textContent.trim();

      if (stepThreeIsOpen && currentLabel !== targetButtonLabel) {
        desktopEstimateCta.textContent = targetButtonLabel;
      } else if (
        !stepThreeIsOpen &&
        (currentLabel === chooseDateLabel || currentLabel === bookingSummaryLabel)
      ) {
        desktopEstimateCta.textContent = "Book clean";
      }
    }

    if (stepThreeIsOpen) {
      removeDatePromptFromMobileBanner();
    }
  };

  if (quoteDetails) {
    const quoteDetailsObserver = new MutationObserver(updateAppointmentStep);
    quoteDetailsObserver.observe(quoteDetails, {
      attributes: true,
      attributeFilter: ["hidden"]
    });
  }

  if (bookingDateStep) {
    const bookingStepObserver = new MutationObserver(updateAppointmentStep);
    bookingStepObserver.observe(bookingDateStep, {
      attributes: true,
      attributeFilter: ["hidden"],
      childList: true
    });
  }

  if (bookingNextHint) {
    const bookingHintObserver = new MutationObserver(updateAppointmentStep);
    bookingHintObserver.observe(bookingNextHint, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  if (bookCleanButton) {
    const bookButtonObserver = new MutationObserver(updateAppointmentStep);
    bookButtonObserver.observe(bookCleanButton, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  if (desktopEstimateCta) {
    const desktopCtaObserver = new MutationObserver(updateAppointmentStep);
    desktopCtaObserver.observe(desktopEstimateCta, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  if (mobileQuoteAmount) {
    const mobileBannerObserver = new MutationObserver(updateAppointmentStep);
    mobileBannerObserver.observe(mobileQuoteAmount, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  bookingDateOptions.forEach((option) => {
    option.addEventListener("change", updateAppointmentStep);
  });

  if (bookingNextButton) {
    bookingNextButton.addEventListener("click", () => {
      window.setTimeout(updateAppointmentStep, 0);
    });
  }

  updateAppointmentStep();
})();
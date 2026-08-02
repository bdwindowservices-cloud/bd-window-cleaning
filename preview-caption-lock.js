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

  const bookingDateStep = document.querySelector("#booking-date-step");
  const bookingNextHint = document.querySelector("#booking-next-hint");
  const bookingNextButton = document.querySelector("#booking-next-button");
  const appointmentPrompt = "Step 3: choose your appointment date and time";

  const updateAppointmentStep = () => {
    if (!bookingDateStep) return;

    const legend = bookingDateStep.querySelector(":scope > legend");
    if (legend) legend.remove();

    bookingDateStep.setAttribute("aria-label", "Choose your appointment date and time");

    if (
      bookingNextHint &&
      !bookingDateStep.hidden &&
      bookingNextHint.textContent.trim() !== appointmentPrompt
    ) {
      bookingNextHint.textContent = appointmentPrompt;
    }
  };

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

  if (bookingNextButton) {
    bookingNextButton.addEventListener("click", () => {
      window.setTimeout(updateAppointmentStep, 0);
    });
  }

  updateAppointmentStep();
})();
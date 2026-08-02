(() => {
  const params = new URLSearchParams(window.location.search);
  const bookingWasSent = params.get("quote") === "sent";

  if (bookingWasSent) {
    const confirmation = document.querySelector("#quote-status");

    if (confirmation) {
      confirmation.innerHTML = `
        <strong>Thank you, your appointment request has been sent successfully.</strong>
        <span>We will email you confirmation of your booked appointment. For any changes to your appointment or anything urgent please email us on <a href="mailto:bdwindowservices@gmail.com">bdwindowservices@gmail.com</a>.</span>
      `;

      const positionMobileConfirmation = () => {
        if (window.innerWidth > 640) return;

        const header = document.querySelector(".site-header");
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        const confirmationTop =
          window.scrollY + confirmation.getBoundingClientRect().top;
        const destination = Math.max(0, confirmationTop - headerHeight - 18);

        window.scrollTo({ top: destination, behavior: "auto" });
      };

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(positionMobileConfirmation);
      });
      window.setTimeout(positionMobileConfirmation, 450);
    }

    document
      .querySelectorAll(".desktop-action-bar, .mobile-action-bar")
      .forEach((banner) => {
        banner.hidden = true;
        banner.setAttribute("aria-hidden", "true");
        banner.style.setProperty("display", "none", "important");
      });
  }

  const quoteForm = document.querySelector("#quote-form");
  const quoteDetails = document.querySelector("#quote-details");
  const bookingNextButton = document.querySelector("#booking-next-button");

  if (!quoteForm || !quoteDetails) return;

  let mobileInput = quoteForm.elements.namedItem("Mobile number");

  if (!mobileInput) {
    const postcodeInput = quoteForm.elements.namedItem("Postcode");
    const postcodeLabel = postcodeInput?.closest("label");
    const mobileLabel = document.createElement("label");

    mobileLabel.innerHTML = 'Mobile number<input name="Mobile number" type="tel" autocomplete="tel" inputmode="tel" placeholder="e.g. 07598 123456" required>';

    if (postcodeLabel) {
      postcodeLabel.insertAdjacentElement("afterend", mobileLabel);
    } else {
      quoteDetails.prepend(mobileLabel);
    }

    mobileInput = mobileLabel.querySelector("input");
  }

  if (bookingNextButton && mobileInput) {
    bookingNextButton.addEventListener(
      "click",
      (event) => {
        if (mobileInput.checkValidity()) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        mobileInput.reportValidity();
        mobileInput.focus();
      },
      true
    );
  }

  const addMobileToSummary = () => {
    const overlay = document.querySelector("#booking-summary-overlay");
    const summaryEmail = overlay?.querySelector("#summary-email");
    if (!overlay || !summaryEmail) return false;

    let summaryMobile = overlay.querySelector("#summary-mobile");

    if (!summaryMobile) {
      const mobileRow = document.createElement("div");
      mobileRow.className = "booking-summary-row";
      mobileRow.innerHTML = '<dt>Mobile number</dt><dd id="summary-mobile"></dd>';
      summaryEmail.closest(".booking-summary-row")?.insertAdjacentElement("afterend", mobileRow);
      summaryMobile = mobileRow.querySelector("#summary-mobile");
    }

    const updateMobileSummary = () => {
      if (!summaryMobile) return;
      summaryMobile.textContent = mobileInput?.value.trim() || "Not provided";
    };

    const overlayObserver = new MutationObserver(() => {
      if (!overlay.hidden) updateMobileSummary();
    });

    overlayObserver.observe(overlay, {
      attributes: true,
      attributeFilter: ["hidden"]
    });

    if (!overlay.hidden) updateMobileSummary();
    return true;
  };

  if (!addMobileToSummary()) {
    const bodyObserver = new MutationObserver(() => {
      if (addMobileToSummary()) bodyObserver.disconnect();
    });

    bodyObserver.observe(document.body, { childList: true });
  }
})();
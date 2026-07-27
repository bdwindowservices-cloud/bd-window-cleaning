const year = document.querySelector("#year");
const quoteForm = document.querySelector("#quote-form");
const quoteStatus = document.querySelector("#quote-status");
const params = new URLSearchParams(window.location.search);
const frontWindowOptions = document.querySelectorAll("[data-front-window-option]");
const backSideWindowOptions = document.querySelector("#back-side-window-options");
const backSideInputs = document.querySelectorAll("[data-back-side-window-option]");
const extraOptions = document.querySelector("#extra-options");
const extraInputs = document.querySelectorAll("[data-extra-option]");
const quoteTotal = document.querySelector("#quote-total");
const quoteTotalPrice = document.querySelector("#quote-total-price");
const quoteTotalMonthly = document.querySelector("#quote-total-monthly");
const estimatedQuoteInput = document.querySelector("#estimated-quote");
const mobileActionBar = document.querySelector(".mobile-action-bar");
const mobileQuoteAmount = document.querySelector("#mobile-quote-amount");
const desktopActionBar = document.querySelector(".desktop-action-bar");
const desktopEstimateAction = document.querySelector("#desktop-estimate-action");
const desktopEstimateMain = document.querySelector("#desktop-estimate-main");
const desktopEstimateSub = document.querySelector("#desktop-estimate-sub");
const desktopEstimateCta = document.querySelector("#desktop-estimate-cta");
const quoteNextButton = document.querySelector("#quote-next-button");
const quoteNextHint = document.querySelector("#quote-next-hint");
const quoteDetails = document.querySelector("#quote-details");
const requiredQuoteDetailInputs = document.querySelectorAll("#quote-details input[required]");
const bookingNextButton = document.querySelector("#booking-next-button");
const bookingNextHint = document.querySelector("#booking-next-hint");
const bookingDateStep = document.querySelector("#booking-date-step");
const bookingDateOptions = document.querySelectorAll("[data-booking-option]");
const bookCleanButton = document.querySelector("#book-clean-button");
const formStatus = document.querySelector("#form-status");
const mobileQuoteDefaultHref = mobileQuoteAmount ? mobileQuoteAmount.getAttribute("href") : "";
const mobileQuoteDefaultText = mobileQuoteAmount ? mobileQuoteAmount.textContent : "";
const desktopEstimateDefaultMain = desktopEstimateMain ? desktopEstimateMain.textContent : "";
const desktopEstimateDefaultSub = desktopEstimateSub ? desktopEstimateSub.textContent : "";
const desktopEstimateDefaultCta = desktopEstimateCta ? desktopEstimateCta.textContent : "";
const formatCleaningDate = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long"
});

if (year) {
  year.textContent = new Date().getFullYear();
}

if (quoteStatus && params.get("quote") === "sent") {
  quoteStatus.hidden = false;
  quoteStatus.focus({ preventScroll: true });
  quoteStatus.scrollIntoView({ behavior: "smooth", block: "center" });
}

const formatMoney = (value) => {
  const number = Number(value);
  return Number.isInteger(number) ? `£${number}` : `£${number.toFixed(2)}`;
};

const getCheckedOption = (options) => Array.from(options).find((option) => option.checked);

const hasCompleteQuoteSelection = () => Boolean(
  getCheckedOption(frontWindowOptions) && getCheckedOption(backSideInputs)
);

const setSingleCheckedOption = (selectedOption, options) => {
  if (!selectedOption.checked) {
    return;
  }

  options.forEach((option) => {
    if (option !== selectedOption) {
      option.checked = false;
    }
  });
};

const clearOptions = (options) => {
  options.forEach((option) => {
    option.checked = false;
  });
};

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const isCleaningDay = (date) => {
  const day = date.getDay();
  return day >= 1 && day <= 4;
};

const moveToCleaningDay = (date) => {
  let nextDate = new Date(date);
  while (!isCleaningDay(nextDate)) {
    nextDate = addDays(nextDate, 1);
  }
  return nextDate;
};

const getAvailableCleaningDates = () => {
  const firstDate = moveToCleaningDay(addDays(new Date(), 2));
  const dates = [firstDate];

  while (dates.length < 4) {
    const followingDate = moveToCleaningDay(addDays(dates[dates.length - 1], 1));
    dates.push(followingDate);
  }

  return dates;
};

const updateBookingDateOptions = () => {
  const dates = getAvailableCleaningDates();

  document.querySelectorAll("[data-booking-date-index]").forEach((option) => {
    const dateIndex = Number(option.dataset.bookingDateIndex);
    const slot = option.dataset.bookingSlot;
    const dateText = formatCleaningDate.format(dates[dateIndex]);
    const label = `${dateText}, ${slot}`;
    option.value = label;
    option.parentElement.lastChild.textContent = label;
  });
};

const validateQuoteDetails = () => {
  const invalidField = Array.from(requiredQuoteDetailInputs).find((field) => !field.checkValidity());
  if (!invalidField) {
    return true;
  }

  invalidField.reportValidity();
  invalidField.focus();
  return false;
};

const closeBookingDateStep = () => {
  if (bookingDateStep) {
    bookingDateStep.hidden = true;
  }
  clearOptions(bookingDateOptions);
  if (formStatus) {
    formStatus.textContent = "";
  }
};

const setQuoteProgressState = (isInProgress) => {
  if (quoteTotal) {
    quoteTotal.classList.toggle("is-in-progress", isInProgress);
  }
};

const setMobileActionText = (text) => {
  if (!mobileQuoteAmount) {
    return;
  }

  mobileQuoteAmount.textContent = text;
  mobileQuoteAmount.setAttribute("href", "#quote");
  if (mobileActionBar) {
    mobileActionBar.classList.add("is-single-action");
  }
};

const resetMobileQuoteAmount = () => {
  if (!mobileQuoteAmount) {
    return;
  }

  mobileQuoteAmount.textContent = mobileQuoteDefaultText;
  mobileQuoteAmount.setAttribute("href", mobileQuoteDefaultHref);
  if (mobileActionBar) {
    mobileActionBar.classList.add("is-single-action");
  }
};

const updateMobileQuoteAmount = (price, monthly) => {
  if (!mobileQuoteAmount) {
    return;
  }

  mobileQuoteAmount.innerHTML = `<span>${price} per clean</span><small>${monthly} per month</small>`;
  mobileQuoteAmount.setAttribute("href", "#quote");
  if (mobileActionBar) {
    mobileActionBar.classList.add("is-single-action");
  }
};

const setDesktopEstimateState = (main, sub, cta, state) => {
  if (desktopEstimateMain) {
    desktopEstimateMain.textContent = main;
  }
  if (desktopEstimateSub) {
    desktopEstimateSub.textContent = sub;
  }
  if (desktopEstimateCta) {
    desktopEstimateCta.textContent = cta;
  }
  if (desktopActionBar) {
    desktopActionBar.classList.toggle("is-progress", state === "progress");
    desktopActionBar.classList.toggle("is-ready", state === "ready");
  }
};

const resetDesktopEstimateAmount = () => {
  setDesktopEstimateState(
    desktopEstimateDefaultMain,
    desktopEstimateDefaultSub,
    desktopEstimateDefaultCta,
    "idle"
  );
};

const setDesktopEstimateProgress = () => {
  setDesktopEstimateState(
    "Estimate in progress",
    "Choose a back/side option to see your price.",
    "Continue",
    "progress"
  );
};

const updateDesktopEstimateAmount = (price, monthly) => {
  setDesktopEstimateState(
    `${price} per clean`,
    `${monthly} per month`,
    "Book clean",
    "ready"
  );
};

const setFloatingBookingDatePrompt = () => {
  const price = quoteTotalPrice ? quoteTotalPrice.textContent : "";
  const monthly = quoteTotalMonthly ? quoteTotalMonthly.textContent : "";

  if (price && desktopEstimateMain) {
    desktopEstimateMain.textContent = `${price} per clean - Choose a cleaning date`;
  }
  if (desktopEstimateSub) {
    desktopEstimateSub.textContent = monthly;
  }
  if (desktopEstimateCta) {
    desktopEstimateCta.textContent = "Book clean";
  }
  if (desktopActionBar) {
    desktopActionBar.classList.add("is-ready");
    desktopActionBar.classList.remove("is-progress");
  }
  if (price && monthly && mobileQuoteAmount) {
    mobileQuoteAmount.innerHTML = `<span>${price} per clean - Choose a cleaning date</span><small>${monthly}</small>`;
  }
};

const openBookingDateStep = () => {
  if (!validateQuoteDetails()) {
    return;
  }

  updateBookingDateOptions();
  if (bookingDateStep) {
    bookingDateStep.hidden = false;
  }
  if (bookingNextHint) {
    bookingNextHint.textContent = "Step 3: choose a cleaning date before sending your request.";
  }
  setFloatingBookingDatePrompt();
  if (bookingDateStep) {
    bookingDateStep.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const closeQuoteDetails = () => {
  if (quoteDetails) {
    quoteDetails.hidden = true;
  }
  closeBookingDateStep();
};

const openQuoteDetails = () => {
  if (!hasCompleteQuoteSelection()) {
    updateQuoteStep(false);
    if (backSideWindowOptions && !getCheckedOption(backSideInputs)) {
      backSideWindowOptions.scrollIntoView({ behavior: "smooth", block: "center" });
      const firstBackSideInput = backSideInputs[0];
      if (firstBackSideInput) {
        firstBackSideInput.focus();
      }
    }
    return;
  }

  if (quoteDetails) {
    quoteDetails.hidden = false;
  }
  closeBookingDateStep();
  if (quoteNextHint) {
    quoteNextHint.textContent = "Step 2: send your details to book a clean right now.";
  }
  if (quoteDetails) {
    quoteDetails.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const handleFloatingEstimateAction = (event) => {
  if (!hasCompleteQuoteSelection()) {
    return;
  }

  event.preventDefault();

  if (quoteDetails && !quoteDetails.hidden) {
    openBookingDateStep();
    return;
  }

  openQuoteDetails();
};

const updateQuoteStep = (hasCompleteSelection) => {
  if (quoteNextButton) {
    quoteNextButton.disabled = !hasCompleteSelection;
  }
  if (!quoteNextHint) {
    return;
  }

  if (hasCompleteSelection) {
    quoteNextHint.textContent = "Your estimate is ready. Continue to send your details.";
    return;
  }

  quoteNextHint.textContent = getCheckedOption(frontWindowOptions)
    ? "Choose a back/side option to continue."
    : "Choose a front window option to continue.";
};

const updateQuoteTotal = () => {
  const selectedFront = getCheckedOption(frontWindowOptions);
  const selectedBackSide = getCheckedOption(backSideInputs);
  const selectedExtra = getCheckedOption(extraInputs);

  if (extraOptions) {
    extraOptions.hidden = !selectedBackSide;
  }

  if (!selectedFront) {
    if (backSideWindowOptions) {
      backSideWindowOptions.hidden = true;
    }
    if (extraOptions) {
      extraOptions.hidden = true;
    }
    clearOptions(backSideInputs);
    clearOptions(extraInputs);
    setQuoteProgressState(false);
    if (quoteTotal) {
      quoteTotal.hidden = false;
    }
    if (quoteTotalPrice) {
      quoteTotalPrice.textContent = "£-";
    }
    if (quoteTotalMonthly) {
      quoteTotalMonthly.textContent = "Choose a front window option to see your quote.";
    }
    if (estimatedQuoteInput) {
      estimatedQuoteInput.value = "";
    }
    resetMobileQuoteAmount();
    resetDesktopEstimateAmount();
    updateQuoteStep(false);
    closeQuoteDetails();
    return;
  }

  if (!selectedBackSide) {
    if (extraOptions) {
      extraOptions.hidden = true;
    }
    clearOptions(extraInputs);
    setQuoteProgressState(true);
    if (quoteTotal) {
      quoteTotal.hidden = false;
    }
    if (quoteTotalPrice) {
      quoteTotalPrice.textContent = "Estimate in progress";
    }
    if (quoteTotalMonthly) {
      quoteTotalMonthly.textContent = "Choose a back/side option to see your price.";
    }
    if (estimatedQuoteInput) {
      estimatedQuoteInput.value = "";
    }
    setMobileActionText("Estimate in progress");
    setDesktopEstimateProgress();
    updateQuoteStep(false);
    closeQuoteDetails();
    return;
  }

  setQuoteProgressState(false);
  const frontPrice = Number(selectedFront.dataset.price || 0);
  const backSideExtra = Number(selectedBackSide.dataset.extra || 0);
  const extraPrice = selectedExtra ? Number(selectedExtra.dataset.extra || 0) : 0;
  const totalPrice = frontPrice + backSideExtra + extraPrice;
  const monthlyPrice = totalPrice * 2 / 3;
  const price = formatMoney(totalPrice);
  const monthly = formatMoney(monthlyPrice);
  const estimateText = `${price} (${monthly} per month)`;

  if (quoteTotal) {
    quoteTotal.hidden = false;
  }
  if (quoteTotalPrice) {
    quoteTotalPrice.textContent = price;
  }
  if (quoteTotalMonthly) {
    quoteTotalMonthly.textContent = `${monthly} per month`;
  }
  if (estimatedQuoteInput) {
    estimatedQuoteInput.value = estimateText;
  }
  updateQuoteStep(hasCompleteQuoteSelection());
  updateMobileQuoteAmount(price, monthly);
  updateDesktopEstimateAmount(price, monthly);
};

frontWindowOptions.forEach((option) => {
  option.addEventListener("change", () => {
    setSingleCheckedOption(option, frontWindowOptions);

    const hasFrontSelection = Boolean(getCheckedOption(frontWindowOptions));
    if (backSideWindowOptions) {
      backSideWindowOptions.hidden = !hasFrontSelection;
    }
    if (!hasFrontSelection) {
      clearOptions(backSideInputs);
      clearOptions(extraInputs);
      if (extraOptions) {
        extraOptions.hidden = true;
      }
    }

    updateQuoteTotal();
  });
});

backSideInputs.forEach((option) => {
  option.addEventListener("change", () => {
    setSingleCheckedOption(option, backSideInputs);
    const hasBackSideSelection = Boolean(getCheckedOption(backSideInputs));
    if (extraOptions) {
      extraOptions.hidden = !hasBackSideSelection;
    }
    if (!hasBackSideSelection) {
      clearOptions(extraInputs);
    }
    updateQuoteTotal();
  });
});

extraInputs.forEach((option) => {
  option.addEventListener("change", () => {
    setSingleCheckedOption(option, extraInputs);
    updateQuoteTotal();
  });
});

bookingDateOptions.forEach((option) => {
  option.addEventListener("change", () => {
    setSingleCheckedOption(option, bookingDateOptions);
    if (formStatus) {
      formStatus.textContent = "";
    }
  });
});

if (desktopEstimateAction) {
  desktopEstimateAction.addEventListener("click", handleFloatingEstimateAction);
}

if (mobileQuoteAmount) {
  mobileQuoteAmount.addEventListener("click", handleFloatingEstimateAction);
}

if (quoteNextButton && quoteDetails) {
  quoteNextButton.addEventListener("click", openQuoteDetails);
}

if (bookingNextButton && bookingDateStep) {
  bookingNextButton.addEventListener("click", openBookingDateStep);
}

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    if (!validateQuoteDetails()) {
      event.preventDefault();
      return;
    }

    if (bookingDateOptions.length && !getCheckedOption(bookingDateOptions)) {
      event.preventDefault();
      if (formStatus) {
        formStatus.textContent = "Please choose a cleaning date option before sending your request.";
      }
      if (bookingDateStep) {
        bookingDateStep.hidden = false;
        bookingDateStep.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setFloatingBookingDatePrompt();
      return;
    }

    if (bookCleanButton) {
      bookCleanButton.disabled = true;
      bookCleanButton.textContent = "Sending clean request...";
    }
    if (formStatus) {
      formStatus.textContent = "Sending your clean request. The next step will confirm it has gone through.";
    }
  });
}

updateBookingDateOptions();
updateQuoteTotal();
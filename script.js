const year = document.querySelector("#year");
const quoteForm = document.querySelector("#quote-form");
const quoteStatus = document.querySelector("#quote-status");
const params = new URLSearchParams(window.location.search);
const counterButtons = document.querySelectorAll("[data-counter-action]");
const frontWindowCount = document.querySelector("#front-window-count");
const backWindowCount = document.querySelector("#back-window-count");
const frontWindowSetsInput = document.querySelector("#front-window-sets-input");
const backSideWindowSetsInput = document.querySelector("#back-side-window-sets-input");
const extrasInput = document.querySelector("#extras-input");
const extraButtons = document.querySelectorAll("[data-extra-button]");
const previewGrid = document.querySelector("#window-preview-grid");
const previewCaption = document.querySelector("#window-preview-caption");
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
const maxWindowSets = 6;
const quoteState = {
  front: 0,
  back: 0,
  extra: "",
  extraPrice: 0
};
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

const getWindowBandPrice = (count, bands) => {
  if (count <= 0) {
    return 0;
  }
  if (count <= 2) {
    return bands[0];
  }
  if (count <= 4) {
    return bands[1];
  }
  return bands[2];
};

const getWindowSetLabel = (label, count) => {
  if (count <= 0) {
    return `${label}: 0 sets`;
  }
  return `${label}: ${count} ${count === 1 ? "set" : "sets"} of windows`;
};

const hasCompleteQuoteSelection = () => quoteState.front > 0;

const getCheckedOption = (options) => Array.from(options).find((option) => option.checked);

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

const updateDesktopEstimateAmount = (price, monthly) => {
  setDesktopEstimateState(
    `${price} per clean`,
    `${monthly} per month`,
    "Book clean",
    "ready"
  );
};

const updateHiddenQuoteFields = () => {
  if (frontWindowSetsInput) {
    frontWindowSetsInput.value = quoteState.front > 0 ? getWindowSetLabel("Front", quoteState.front) : "";
  }
  if (backSideWindowSetsInput) {
    backSideWindowSetsInput.value = quoteState.back > 0
      ? getWindowSetLabel("Back or side", quoteState.back)
      : "Back or side: 0 sets / fronts only";
  }
  if (extrasInput) {
    extrasInput.value = quoteState.extra || "No extras selected";
  }
};

const updateWindowPreview = () => {
  if (!previewGrid) {
    return;
  }

  const totalSets = quoteState.front + quoteState.back;
  previewGrid.innerHTML = "";

  const visibleSets = Math.max(totalSets, 0);
  for (let index = 0; index < visibleSets; index += 1) {
    const windowSet = document.createElement("span");
    windowSet.className = "preview-window-set";
    windowSet.setAttribute("aria-hidden", "true");
    previewGrid.append(windowSet);
  }

  if (previewCaption) {
    if (totalSets === 0) {
      previewCaption.textContent = "Add window sets to see the preview.";
      return;
    }
    previewCaption.textContent = `${totalSets} ${totalSets === 1 ? "set" : "sets"} of windows selected.`;
  }
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

const closeQuoteDetails = () => {
  if (quoteDetails) {
    quoteDetails.hidden = true;
  }
  closeBookingDateStep();
};

const updateQuoteStep = (hasCompleteSelection) => {
  if (quoteNextButton) {
    quoteNextButton.disabled = !hasCompleteSelection;
  }
  if (!quoteNextHint) {
    return;
  }

  quoteNextHint.textContent = hasCompleteSelection
    ? "Your estimate is ready. Continue to send your details."
    : "Add front window sets to continue.";
};

const updateQuoteTotal = () => {
  const frontPrice = getWindowBandPrice(quoteState.front, [12, 15, 18]);
  const backSideExtra = getWindowBandPrice(quoteState.back, [6, 8, 10]);
  const totalPrice = frontPrice + backSideExtra + quoteState.extraPrice;
  const monthlyPrice = totalPrice * 2 / 3;
  const price = formatMoney(totalPrice);
  const monthly = formatMoney(monthlyPrice);

  setQuoteProgressState(false);
  if (quoteTotal) {
    quoteTotal.hidden = false;
  }

  if (!hasCompleteQuoteSelection()) {
    if (quoteTotalPrice) {
      quoteTotalPrice.textContent = "£-";
    }
    if (quoteTotalMonthly) {
      quoteTotalMonthly.textContent = "Add front window sets to see your estimate.";
    }
    if (estimatedQuoteInput) {
      estimatedQuoteInput.value = "";
    }
    resetMobileQuoteAmount();
    resetDesktopEstimateAmount();
    updateQuoteStep(false);
    updateHiddenQuoteFields();
    updateWindowPreview();
    closeQuoteDetails();
    return;
  }

  if (quoteTotalPrice) {
    quoteTotalPrice.textContent = price;
  }
  if (quoteTotalMonthly) {
    quoteTotalMonthly.textContent = `${monthly} per month`;
  }
  if (estimatedQuoteInput) {
    estimatedQuoteInput.value = `${price} (${monthly} per month)`;
  }

  updateQuoteStep(true);
  updateHiddenQuoteFields();
  updateWindowPreview();
  updateMobileQuoteAmount(price, monthly);
  updateDesktopEstimateAmount(price, monthly);
};

const updateCounters = () => {
  if (frontWindowCount) {
    frontWindowCount.textContent = quoteState.front;
  }
  if (backWindowCount) {
    backWindowCount.textContent = quoteState.back;
  }

  counterButtons.forEach((button) => {
    const target = button.dataset.counterTarget;
    const action = button.dataset.counterAction;
    const value = quoteState[target];
    button.disabled = (action === "decrease" && value <= 0) || (action === "increase" && value >= maxWindowSets);
  });
};

const updateExtraButtons = () => {
  extraButtons.forEach((button) => {
    const isSelected = quoteState.extra === button.dataset.extraValue;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
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

const openQuoteDetails = () => {
  if (!hasCompleteQuoteSelection()) {
    updateQuoteStep(false);
    if (quoteTotal) {
      quoteTotal.scrollIntoView({ behavior: "smooth", block: "center" });
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

counterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.counterTarget;
    const action = button.dataset.counterAction;
    const direction = action === "increase" ? 1 : -1;
    quoteState[target] = Math.min(maxWindowSets, Math.max(0, quoteState[target] + direction));
    updateCounters();
    updateQuoteTotal();
  });
});

extraButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.extraValue;
    const isSelected = quoteState.extra === value;
    quoteState.extra = isSelected ? "" : value;
    quoteState.extraPrice = isSelected ? 0 : Number(button.dataset.extraPrice || 0);
    updateExtraButtons();
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
updateCounters();
updateExtraButtons();
updateQuoteTotal();
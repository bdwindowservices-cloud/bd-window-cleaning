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
const quoteNextButton = document.querySelector("#quote-next-button");
const quoteNextHint = document.querySelector("#quote-next-hint");
const quoteDetails = document.querySelector("#quote-details");
const bookingNextButton = document.querySelector("#booking-next-button");
const bookingNextHint = document.querySelector("#booking-next-hint");
const bookingDateStep = document.querySelector("#booking-date-step");
const bookingDateOptions = document.querySelectorAll("[data-booking-option]");
const formStatus = document.querySelector("#form-status");
const mobileQuoteDefaultHref = mobileQuoteAmount ? mobileQuoteAmount.getAttribute("href") : "";
const mobileQuoteDefaultText = mobileQuoteAmount ? mobileQuoteAmount.textContent : "";
const dateLabels = ["First", "Second", "Third", "Fourth"];
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
    const label = `${dateLabels[dateIndex]} available date - ${dateText}, ${slot}`;
    option.value = label;
    option.parentElement.lastChild.textContent = label;
  });
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
    : "Choose your front and back/side options to continue.";
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
      quoteTotalPrice.textContent = "Quote in progress";
    }
    if (quoteTotalMonthly) {
      quoteTotalMonthly.textContent = "Choose a back/side option to see your price.";
    }
    if (estimatedQuoteInput) {
      estimatedQuoteInput.value = "";
    }
    setMobileActionText("Quote in progress");
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
  updateQuoteStep(true);
  updateMobileQuoteAmount(price, monthly);
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

if (quoteNextButton && quoteDetails) {
  quoteNextButton.addEventListener("click", () => {
    quoteDetails.hidden = false;
    closeBookingDateStep();
    if (quoteNextHint) {
      quoteNextHint.textContent = "Step 2: send your details so we can arrange your clean.";
    }
    quoteDetails.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (bookingNextButton && bookingDateStep) {
  bookingNextButton.addEventListener("click", () => {
    updateBookingDateOptions();
    bookingDateStep.hidden = false;
    if (bookingNextHint) {
      bookingNextHint.textContent = "Step 3: choose a cleaning date before sending your request.";
    }
    bookingDateStep.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    if (bookingDateOptions.length && !getCheckedOption(bookingDateOptions)) {
      event.preventDefault();
      if (formStatus) {
        formStatus.textContent = "Please choose a cleaning date option before sending your request.";
      }
      if (bookingDateStep) {
        bookingDateStep.hidden = false;
        bookingDateStep.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
}

updateBookingDateOptions();
updateQuoteTotal();
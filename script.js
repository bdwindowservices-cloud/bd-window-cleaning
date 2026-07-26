const year = document.querySelector("#year");
const quoteStatus = document.querySelector("#quote-status");
const params = new URLSearchParams(window.location.search);
const frontWindowOptions = document.querySelectorAll("[data-front-window-option]");
const backSideWindowOptions = document.querySelector("#back-side-window-options");
const backSideInputs = document.querySelectorAll("[data-back-side-window-option]");
const quoteTotal = document.querySelector("#quote-total");
const quoteTotalPrice = document.querySelector("#quote-total-price");
const quoteTotalMonthly = document.querySelector("#quote-total-monthly");
const estimatedQuoteInput = document.querySelector("#estimated-quote");
const mobileActionBar = document.querySelector(".mobile-action-bar");
const mobileQuoteAmount = document.querySelector("#mobile-quote-amount");
const mobileSeePricesLink = document.querySelector("#mobile-see-prices-link");
const quoteNextButton = document.querySelector("#quote-next-button");
const quoteNextHint = document.querySelector("#quote-next-hint");
const quoteDetails = document.querySelector("#quote-details");
const mobileQuoteDefaultHref = mobileQuoteAmount ? mobileQuoteAmount.getAttribute("href") : "";
const mobileQuoteDefaultText = mobileQuoteAmount ? mobileQuoteAmount.textContent : "";

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

const resetMobileQuoteAmount = () => {
  if (!mobileQuoteAmount) {
    return;
  }

  mobileQuoteAmount.textContent = mobileQuoteDefaultText;
  mobileQuoteAmount.setAttribute("href", mobileQuoteDefaultHref);
  if (mobileActionBar) {
    mobileActionBar.classList.add("is-single-action");
  }
  if (mobileSeePricesLink) {
    mobileSeePricesLink.hidden = true;
  }
};

const updateMobileQuoteAmount = (price) => {
  if (!mobileQuoteAmount) {
    return;
  }

  mobileQuoteAmount.textContent = `Quote: ${price}`;
  mobileQuoteAmount.setAttribute("href", "#quote");
  if (mobileActionBar) {
    mobileActionBar.classList.remove("is-single-action");
  }
  if (mobileSeePricesLink) {
    mobileSeePricesLink.hidden = false;
  }
};

const closeQuoteDetails = () => {
  if (quoteDetails) {
    quoteDetails.hidden = true;
  }
};

const updateQuoteStep = (hasFrontSelection) => {
  if (quoteNextButton) {
    quoteNextButton.disabled = !hasFrontSelection;
  }
  if (!quoteNextHint) {
    return;
  }

  quoteNextHint.textContent = hasFrontSelection
    ? "Your quote is ready. Continue to send your details."
    : "Choose a front window option to continue.";
};

const updateQuoteTotal = () => {
  const selectedFront = getCheckedOption(frontWindowOptions);
  const selectedBackSide = getCheckedOption(backSideInputs);

  if (!selectedFront) {
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

  const frontPrice = Number(selectedFront.dataset.price || 0);
  const backSideExtra = selectedBackSide ? Number(selectedBackSide.dataset.extra || 0) : 0;
  const totalPrice = frontPrice + backSideExtra;
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
  updateMobileQuoteAmount(price);
};

frontWindowOptions.forEach((option) => {
  option.addEventListener("change", () => {
    setSingleCheckedOption(option, frontWindowOptions);

    const hasFrontSelection = Boolean(getCheckedOption(frontWindowOptions));
    if (backSideWindowOptions) {
      backSideWindowOptions.hidden = !hasFrontSelection;
    }
    if (!hasFrontSelection) {
      backSideInputs.forEach((backSideInput) => {
        backSideInput.checked = false;
      });
    }

    updateQuoteTotal();
  });
});

backSideInputs.forEach((option) => {
  option.addEventListener("change", () => {
    setSingleCheckedOption(option, backSideInputs);
    updateQuoteTotal();
  });
});

if (quoteNextButton && quoteDetails) {
  quoteNextButton.addEventListener("click", () => {
    quoteDetails.hidden = false;
    if (quoteNextHint) {
      quoteNextHint.textContent = "Step 2: send your details so we can arrange the quote.";
    }
    quoteDetails.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

updateQuoteTotal();

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

const updateQuoteTotal = () => {
  const selectedFront = getCheckedOption(frontWindowOptions);
  const selectedBackSide = getCheckedOption(backSideInputs);
  const selectedPricedBackSide = selectedBackSide && selectedBackSide.dataset.price ? selectedBackSide : null;
  const priceSource = selectedPricedBackSide || selectedFront;

  if (!selectedFront || !priceSource) {
    if (quoteTotal) {
      quoteTotal.hidden = true;
    }
    if (estimatedQuoteInput) {
      estimatedQuoteInput.value = "";
    }
    return;
  }

  const price = formatMoney(priceSource.dataset.price);
  const monthly = formatMoney(priceSource.dataset.monthly);
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

const year = document.querySelector("#year");
const quoteStatus = document.querySelector("#quote-status");
const params = new URLSearchParams(window.location.search);
const frontWindowOptions = document.querySelectorAll("[data-front-window-option]");
const backSideWindowOptions = document.querySelector("#back-side-window-options");
const backSideInputs = backSideWindowOptions ? backSideWindowOptions.querySelectorAll("input") : [];

if (year) {
  year.textContent = new Date().getFullYear();
}

if (quoteStatus && params.get("quote") === "sent") {
  quoteStatus.hidden = false;
  quoteStatus.focus({ preventScroll: true });
  quoteStatus.scrollIntoView({ behavior: "smooth", block: "center" });
}

frontWindowOptions.forEach((option) => {
  option.addEventListener("change", () => {
    if (option.checked) {
      frontWindowOptions.forEach((otherOption) => {
        if (otherOption !== option) {
          otherOption.checked = false;
        }
      });
      if (backSideWindowOptions) {
        backSideWindowOptions.hidden = false;
      }
      return;
    }

    const hasFrontSelection = Array.from(frontWindowOptions).some((frontOption) => frontOption.checked);
    if (!hasFrontSelection && backSideWindowOptions) {
      backSideWindowOptions.hidden = true;
      backSideInputs.forEach((backSideInput) => {
        backSideInput.checked = false;
      });
    }
  });
});

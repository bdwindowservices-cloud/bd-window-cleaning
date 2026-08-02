(() => {
  const oneOffCheckbox = document.querySelector("#front-only-clean");
  const quoteNextHint = document.querySelector("#quote-next-hint");
  const quoteDetails = document.querySelector("#quote-details");
  const monthlyPaymentMessage = "Monthly payments spread the cost throughout the year.";

  if (!oneOffCheckbox || !quoteNextHint || !quoteDetails) return;

  const updateHint = () => {
    if (!quoteDetails.hidden) return;

    const currentText = quoteNextHint.textContent.trim();

    if (oneOffCheckbox.checked && currentText === monthlyPaymentMessage) {
      quoteNextHint.textContent = "";
      return;
    }

    if (!oneOffCheckbox.checked && currentText === "") {
      quoteNextHint.textContent = monthlyPaymentMessage;
    }
  };

  oneOffCheckbox.addEventListener("change", () => queueMicrotask(updateHint));

  const observer = new MutationObserver(updateHint);
  observer.observe(quoteNextHint, {
    childList: true,
    characterData: true,
    subtree: true
  });
  observer.observe(quoteDetails, {
    attributes: true,
    attributeFilter: ["hidden"]
  });

  updateHint();
})();
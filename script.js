const year = document.querySelector("#year");
const quoteStatus = document.querySelector("#quote-status");
const params = new URLSearchParams(window.location.search);

if (year) {
  year.textContent = new Date().getFullYear();
}

if (quoteStatus && params.get("quote") === "sent") {
  quoteStatus.hidden = false;
  quoteStatus.focus({ preventScroll: true });
  quoteStatus.scrollIntoView({ behavior: "smooth", block: "center" });
}

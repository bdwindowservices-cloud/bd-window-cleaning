const year = document.querySelector("#year");
const form = document.querySelector("#quote-form");
const status = document.querySelector("#form-status");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (form && status) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const lines = [
      "Quote request for B D Window Cleaning Services",
      "",
      `Name: ${data.get("name") || ""}`,
      `Contact: ${data.get("contact") || ""}`,
      `Postcode / area: ${data.get("area") || ""}`,
      `Property type: ${data.get("property") || ""}`,
      `Frequency: ${data.get("frequency") || ""}`,
      `Access notes: ${data.get("access") || ""}`
    ];

    const body = encodeURIComponent(lines.join("\n"));
    const emailAddress = "bdwindowservices@gmail.com";

    status.textContent = "Message prepared. Your email app should open with the quote details ready to send.";
    window.location.href = `mailto:${emailAddress}?subject=Window cleaning quote request&body=${body}`;
  });
}

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
      `Size / windows: ${data.get("size") || ""}`,
      `Frequency: ${data.get("frequency") || ""}`,
      `Access notes: ${data.get("access") || ""}`,
      `Preferred dates / extra notes: ${data.get("notes") || ""}`
    ];

    const body = encodeURIComponent(lines.join("\n"));
    const emailPlaceholder = "ADD_EMAIL_ADDRESS";

    status.textContent = "Message prepared. Add your email address in script.js to make this button open an email automatically.";

    if (emailPlaceholder.includes("@")) {
      window.location.href = `mailto:${emailPlaceholder}?subject=Window cleaning quote request&body=${body}`;
    }
  });
}

const makePreviewImage = (label, windowCount) => {
  const columns = windowCount <= 4 ? 2 : 4;
  const rows = Math.ceil(windowCount / columns);
  const windowWidth = columns === 2 ? 78 : 54;
  const windowHeight = rows > 1 ? 54 : 70;
  const gapX = columns === 2 ? 42 : 24;
  const gapY = 30;
  const totalWidth = columns * windowWidth + (columns - 1) * gapX;
  const startX = (360 - totalWidth) / 2;
  const startY = rows === 1 ? 132 : 106;
  const windows = Array.from({ length: windowCount }, (_, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const x = startX + col * (windowWidth + gapX);
    const y = startY + row * (windowHeight + gapY);
    return `
      <rect x="${x}" y="${y}" width="${windowWidth}" height="${windowHeight}" rx="3" fill="#eff9fb" stroke="#f8ffff" stroke-width="7"/>
      <line x1="${x + windowWidth / 2}" y1="${y + 6}" x2="${x + windowWidth / 2}" y2="${y + windowHeight - 6}" stroke="#a7cbd4" stroke-width="3"/>
      <line x1="${x + 6}" y1="${y + windowHeight / 2}" x2="${x + windowWidth - 6}" y2="${y + windowHeight / 2}" stroke="#a7cbd4" stroke-width="3"/>
    `;
  }).join("");

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 270" role="img" aria-label="Example front with ${label} window sets">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#dff5fb"/>
          <stop offset="1" stop-color="#eef8f7"/>
        </linearGradient>
        <linearGradient id="brick" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#b35d3e"/>
          <stop offset="0.62" stop-color="#8d412f"/>
          <stop offset="1" stop-color="#aa5538"/>
        </linearGradient>
      </defs>
      <rect width="360" height="270" fill="url(#sky)"/>
      <path d="M35 88 L72 42 H288 L326 88 Z" fill="#5e4b40"/>
      <rect x="48" y="86" width="264" height="148" rx="6" fill="url(#brick)"/>
      <g opacity="0.25" stroke="#f4c7b4" stroke-width="2">
        <path d="M54 112 H306 M54 139 H306 M54 166 H306 M54 193 H306 M54 220 H306"/>
        <path d="M88 88 V234 M132 88 V234 M176 88 V234 M220 88 V234 M264 88 V234"/>
      </g>
      ${windows}
      <rect x="0" y="234" width="360" height="36" fill="#d6ead8"/>
      <text x="180" y="258" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#07575b">${label} window sets</text>
    </svg>
  `)}`;
};

const frontHousePreviewImages = {
  "1 to 2": makePreviewImage("1 to 2", 2),
  "3 to 4": makePreviewImage("3 to 4", 4),
  "5 to 6": makePreviewImage("5 to 6", 6),
  "7 to 8": makePreviewImage("7 to 8", 8)
};

const updateHousePhotoPreview = () => {
  const house = document.querySelector(".preview-house");
  const frontCount = document.querySelector("#front-window-count");
  const caption = document.querySelector("#window-preview-caption");
  if (!house || !frontCount) {
    return;
  }

  const label = frontCount.textContent.trim();
  const imageSource = frontHousePreviewImages[label];
  house.style.marginTop = "18px";

  house.innerHTML = imageSource
    ? `<img class="house-preview-photo" src="${imageSource}" alt="Example front of a house with ${label} window sets">`
    : `<div class="house-preview-bespoke" aria-hidden="true">9+</div>`;

  if (caption) {
    caption.textContent = imageSource
      ? `Front example: ${label} window sets.`
      : "9+ front window sets selected. We will confirm a bespoke quote.";
  }
};

const scheduleHousePhotoPreview = () => window.setTimeout(updateHousePhotoPreview, 0);

document.querySelectorAll('[data-counter-action][data-counter-target="front"]').forEach((button) => {
  button.addEventListener("click", scheduleHousePhotoPreview);
});

updateHousePhotoPreview();

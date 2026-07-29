const desktopCounterLabelStyle = document.createElement("style");
desktopCounterLabelStyle.textContent = `
  @media (min-width: 641px) {
    .counter-control {
      grid-template-columns: 42px minmax(96px, auto) 42px;
    }

    .counter-control output {
      padding: 0 10px;
      font-size: 1.05rem;
      line-height: 1.1;
      white-space: nowrap;
    }
  }
`;
document.head.append(desktopCounterLabelStyle);

const frontPreviewCaptionText = {
  "1 to 2": "Front example: 2 window sets.",
  "3 to 4": "Front example: 4 window sets.",
  "5 to 6": "Front example: 5 window sets."
};

const updateFrontPreviewCaptionText = () => {
  const frontCount = document.querySelector("#front-window-count");
  const caption = document.querySelector("#window-preview-caption");
  if (!frontCount || !caption) {
    return;
  }

  const captionText = frontPreviewCaptionText[frontCount.textContent.trim()];
  if (captionText) {
    caption.textContent = captionText;
  }
};

document.querySelectorAll('[data-counter-action][data-counter-target="front"]').forEach((button) => {
  button.addEventListener("click", () => window.setTimeout(updateFrontPreviewCaptionText, 1));
});

updateFrontPreviewCaptionText();

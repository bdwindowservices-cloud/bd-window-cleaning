if (typeof frontHousePreviewImages !== "undefined") {
  frontHousePreviewImages["1 to 2"] = "assets/front-1-2-preview.webp";
}

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

    .window-set-preview {
      align-content: center;
      padding-top: 34px;
    }
  }

  @media (max-width: 640px) {
    .window-set-preview > .price-builder-intro {
      width: 100%;
      max-width: none;
      margin: 0 0 12px;
      text-align: left;
    }
  }
`;
document.head.append(desktopCounterLabelStyle);

const frontPreviewCaptionText = {
  "1 to 2": "Front example: 2 window sets.",
  "3 to 4": "Front example: 4 window sets.",
  "5 to 6": "Front example: 5 window sets.",
  "7 to 8": "Front example: 7 window sets."
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

const arrangeQuoteBuilderForScreen = () => {
  const panel = document.querySelector(".price-builder-panel");
  const preview = document.querySelector(".window-set-preview");
  const intro = document.querySelector(".price-builder-intro");
  const previewHouse = preview ? preview.querySelector(".preview-house") : null;
  const quoteTotal = panel ? panel.querySelector(".quote-total") : null;

  if (!panel || !preview || !intro || !previewHouse) {
    return;
  }

  if (window.matchMedia("(max-width: 640px)").matches) {
    preview.insertBefore(intro, previewHouse);
  } else if (quoteTotal) {
    panel.insertBefore(intro, quoteTotal);
  } else {
    panel.prepend(intro);
  }
};

document.querySelectorAll('[data-counter-action][data-counter-target="front"]').forEach((button) => {
  button.addEventListener("click", () => window.setTimeout(updateFrontPreviewCaptionText, 1));
});

window.addEventListener("resize", arrangeQuoteBuilderForScreen);

if (typeof updateHousePhotoPreview === "function") {
  updateHousePhotoPreview();
}
arrangeQuoteBuilderForScreen();
updateFrontPreviewCaptionText();
# B D Window Cleaning Services website

Free static website for **B D Window Cleaning Services**, ready for GitHub Pages.

## Files

- `index.html` - the website page and quote questionnaire.
- `styles.css` - mobile-friendly styling.
- `script.js` - prepares the static quote form message.
- `assets/window-cleaning-hero.svg` - the hero visual used at the top of the site.

## Before going live

Replace these placeholders:

- `ADD PHONE NUMBER`
- `ADD EMAIL ADDRESS`
- Any service wording that does not match what you offer yet.

To make the quote button open an email, edit `script.js` and replace:

```js
const emailPlaceholder = "ADD_EMAIL_ADDRESS";
```

with your real email address.

This is a static website, so it does not store form submissions by itself. To collect enquiries automatically later, connect a free form service or a small backend.

## Turn on GitHub Pages

1. Open this repository on GitHub.
2. Go to **Settings**.
3. Open **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose the `main` branch and `/root` folder.
6. Save and wait a minute or two.

The live website should appear at:

```text
https://bdwindowservices-cloud.github.io/bd-window-cleaning/
```

Test the live URL on your phone before making or printing a QR code.

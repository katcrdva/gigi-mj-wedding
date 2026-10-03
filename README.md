# Gillan & Merry Jane — Wedding Invitation Website

A luxury burgundy-and-gold digital wedding invitation, built with plain HTML/CSS/JS
so it can be edited in VS Code and hosted for free on GitHub Pages, with RSVPs
saved straight to a Google Sheet.

```
wedding-invitation/
├── index.html            ← all page content & sections
├── style.css              ← full design system (colors, type, layout)
├── script.js               ← countdown, RSVP, nav, music, animations
├── images/                 ← drop your real photos here
├── music/                  ← drop wedding-piano.mp3 here
├── apps-script/Code.gs      ← paste into Google Apps Script
└── README.md
```

## 1. Preview it locally

Just open `index.html` in a browser, or use VS Code's "Live Server" extension
for the best experience (some browsers restrict local audio/file access
without a local server).

## 2. Your photos

The site now uses your real images directly — nothing to swap in, just make
sure these exact files exist in `images/`:

```text
images/initials.jpg   ← your G&M monogram/stamp — used in the curtain,
                         RSVP confirmation, closing section, and footer
images/couple.jpg      ← Meet the Couple section
images/church.jpg      ← Ceremony venue card
images/hotel.jpg       ← Reception venue card
images/style.jpg       ← Attire Guide section
images/gallery-1.jpg through images/gallery-6.jpg  ← Gallery
images/story-1.jpg through images/story-13.jpg     ← Our Story slideshow
```

If you rename or replace any of these, update the matching `src="images/…"`
path in `index.html` — each `<img>` is easy to find by its section `id`
(`#couple`, `#details`, `#attire`, `#gallery`, etc.).

## 3. Add the background music

Drop an MP3 (soft piano wedding instrumental) into `music/` as
`wedding-piano.mp3`. Music only starts after the guest taps to open the
velvet curtain on the opening screen, since mobile browsers block autoplay
before any interaction — this is already handled in `script.js`.

## 4. Connect the RSVP form to Google Sheets

1. Go to [sheets.google.com](https://sheets.google.com) and create a new,
   blank spreadsheet (name it anything, e.g. "Gillan & Merry Jane RSVPs").
2. Open **Extensions → Apps Script**.
3. Delete the placeholder code and paste in the entire contents of
   `apps-script/Code.gs`.
4. In the function dropdown at the top, choose `runSetup` and click **Run**
   once (this creates the `RSVPs` sheet and header row). Approve the
   permissions prompt.
5. Click **Deploy → New deployment**.
   - Select type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy**, then copy the **Web app URL** it gives you.
7. Open `script.js` and paste that URL into:
   ```js
   RSVP_ENDPOINT: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",
   ```
8. Save, and test the RSVP form. New rows should appear in your Google Sheet
   instantly, and submitting the same name or email twice will show
   **"RSVP Already Submitted"** instead of creating a duplicate row.

> If you ever edit `Code.gs` again, you must create a **new deployment
> version** (Deploy → Manage deployments → Edit → New version) for the
> changes to go live.

## 5. Deploy to GitHub Pages

1. Create a new GitHub repository (public) and push this whole
   `wedding-invitation` folder to it.
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment," set **Source: Deploy from a branch**,
   branch `main`, folder `/ (root)`.
4. Save. GitHub will give you a live URL like
   `https://yourusername.github.io/wedding-invitation/` within a minute or two.

## 6. Make the Save-the-Date QR card

Once your GitHub Pages URL is live, generate a QR code for it (e.g. at
[qr-code-generator.com](https://www.qr-code-generator.com) or any free QR
tool) and place it on a printed Save-the-Date card with the line
**"Scan to open our wedding invitation."** The card is just a teaser — the
full invitation, story, program, and RSVP all live on the website.

## Editing content

Nearly everything guests read — names, the love story, program order, the
wedding party, sponsors, FAQ answers — lives as plain text directly inside
`index.html`, organized section by section with matching HTML `id`s
(`#story`, `#details`, `#party`, `#rsvp`, `#faq`, etc.) so it's easy to find
and update. Colors and fonts live at the top of `style.css` under `:root`
(`--bg-deep`, `--bg-wine`, `--gold`, `--ivory`, `--plum`).

# Rivaldi Syaputra — Portfolio

Personal portfolio of Rivaldi Syaputra, Full-stack Developer & IT Support, based in Bandung, Indonesia.

Live: https://rivaldi12.netlify.app

## What is here

| Path | What it is |
|---|---|
| `index.html` | The whole site: one page, Tailwind CSS from the CDN, no build step |
| `public/js/main.js` | Interactions: hero terminal, woven canvas, skill tabs, project details dialog |
| `public/images`, `public/pdf` | Screenshots, logos, certificates, and the CVs |
| `cv/build.py` | Builds the two ATS CVs (English and Indonesian) into `public/pdf/` |
| `temanair/` | Teman Air, a dependency-free landing page, hosted here as a live demo at `/temanair/` |
| `linkedin/` | Source and export of the LinkedIn banner |

## Run locally

```bash
python3 -m http.server 8123
```

Then open http://localhost:8123.

## Rebuild the CVs

Edit the text in `cv/build.py`, then run (needs Google Chrome):

```bash
python3 cv/build.py
```

## Deploy

Netlify publishes the `main` branch on every push.

## Notes

- The page stays readable if `main.js` fails to load, and motion is reduced for visitors who ask for it.
- The photos in `temanair/` are stock photos from Unsplash, and its contact details are placeholders.

# EcoStruxure Geo SCADA Field Engineering Guide (PWA)

Offline-first, mobile-responsive Progressive Web App for Geo SCADA Expert field engineering at agac.ae.
Static files only: no build step, no dependencies.

## Deploy on GitHub Pages

1. Create a repository and upload the **contents** of this folder to the repository root
   (or unzip locally, then `git add . && git commit && git push`).
2. Repo **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.
3. Open `https://<user>.github.io/<repo>/` once while online; the service worker caches everything for offline use.

All paths are relative, so it works both from a repo sub-path and a custom domain.

## Files

| File | Purpose |
|------|---------|
| `index.html` | App shell, glossary, 5 tutorials, mimic preview |
| `styles.css` | Dark/light themes, responsive layout, safe-area insets, print styles |
| `app.js` | Routing, search, theme, install prompt, online status, mimic demo |
| `sw.js` | Precache + stale-while-revalidate, offline fallback |
| `manifest.webmanifest` | Install metadata (standalone, scope, start_url, maskable icons) |
| `offline.html` | Fallback when a page is not cached |
| `icons/`, `apple-touch-icon.png`, `favicon.*` | Icon set |

## Releasing updates

Edit content, then bump `VERSION` in `sw.js` so clients drop the old cache and reload.

## Notes

- Install prompt: Chrome/Edge/Android show an **Install app** button; iOS shows Share → Add to Home Screen instructions.
- Content values (ports, tagging, priorities, thresholds) are agac.ae example standards. Verify against the Geo SCADA help for your installed version before applying to a live system.
- Independent reference; not an official Schneider Electric document.

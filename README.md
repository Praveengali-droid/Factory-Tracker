# Furdo Factory Tracker

Minimal Vite wrapper for the single-file Furdo tracker app.

## Requirements

- Node.js 18+ recommended
- npm

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite, usually `http://localhost:5173`.

## Build

```bash
npm run build
```

## Files

- `FurdoFactoryTracker.jsx`: main single-file application
- `src/main.jsx`: React entry point
- `index.html`: Vite app shell
- `furdo-preview.html`: standalone browser preview wrapper

## Data storage

The app stores data in browser `localStorage` using the key `furdo_tracker_data`.

# Case Tinder

A mobile-first "Tinder for Cannes cases" website – swipe through creative advertising case studies daily.

## Live Site

🔗 **https://huirumay28.github.io/case-tinder/**

This site is hosted on GitHub Pages from the `main` branch.

## Overview

Case Tinder presents creative advertising case studies (from Cannes Lions and other awards) in an engaging flashcard format. Each day, users get 10 cases to explore:

- **Swipe right / tap ♥** to like a case
- **Swipe left / tap ✕** to pass
- **Scroll down** on any card to read detailed Background, Idea, Execution, and Awards
- **Watch the case film** via the bottom link

## Current Status

This is the **initial shell** with 3 placeholder cases to demonstrate the swipe/scroll interface. Real Cannes cases and daily case rotation will be added in a future update.

## Tech Stack

- Static HTML/CSS/JavaScript
- No backend or build process
- Mobile-first design with desktop support
- Hosted on GitHub Pages

## Local Development

Simply open `index.html` in a browser or run a local server:

```bash
python -m http.server 8000
# or
npx serve
```

Then visit `http://localhost:8000`

## Files

- `index.html` – Main HTML structure
- `styles.css` – Mobile-first styles with hot pink theme
- `app.js` – Swipe/scroll interactions and card rendering
- `.nojekyll` – Tells GitHub Pages not to process with Jekyll

## Design

- **Colors**: Hot pink (#FF4458) + white + black
- **Typography**: System sans-serif stack
- **Layout**: Phone-width viewport, centered on desktop
- **Interactions**: Touch swipe on mobile, mouse drag on desktop
- **Language**: Traditional Chinese UI

## Roadmap

- [ ] Add real Cannes case data
- [ ] Implement daily case rotation
- [ ] Add user accounts and saved favorites
- [ ] Backend API for case management
- [ ] Advanced filtering and search

---

Made with ♥ for creative professionals

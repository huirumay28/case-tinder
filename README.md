# Case Tinder

A mobile-first "Tinder for Cannes cases" website – swipe through creative advertising case studies daily and track your progress with a cute lion character!

## Live Site

🔗 **https://huirumay28.github.io/case-tinder/**

This site is hosted on GitHub Pages from the `main` branch.

## Overview

Case Tinder presents creative advertising case studies (from Cannes Lions and other awards) in an engaging flashcard format. Swipe through cases, track your daily streak, and unlock merch for your lion companion!

### Daily Case Flashcards

Each day, users get cases to explore:

- **Swipe right / tap ♥** to like a case
- **Swipe left / tap ✕** to pass
- **Scroll down** on any card to read detailed Background, Idea, Execution, and Awards
- **Watch the case film** via the bottom link

### My Bio - Lion Progress Tracker

Track your creative learning journey with a cute lion character:

- **Streak tracking**: See how many consecutive days you've viewed cases
- **Lion character**: Starts naked and earns creative accessories as you progress
- **Merch unlocks**: Every 2 unique days with swipes unlocks new accessories:
  1. 第1趟 貝雷帽 (Beret) - 2 days
  2. 第2趟 墨鏡 (Sunglasses) - 4 days
  3. 第3趟 金獅項鍊 (Golden lion necklace) - 6 days
  4. 第4趟 創意小包 (Creative bag) - 8 days
  5. 第5趟 滑雪板 (Snowboard) - 10 days
  6. 第6趟 小皇冠 (Crown) - 12 days
- **Progress persists**: Your streak and unlocks are saved in localStorage

**Note**: Unlocks are based on total unique days with at least one swipe (skipping a day doesn't remove accessories, but breaks your streak). The lion is a Cannes creative industry character — accessories include playful items like a snowboard and golden necklace, not just clothing!

### Bottom Navigation

- **My Bio** (left, profile icon) - View your lion and progress
- **Daily Cases** (middle, search icon) - Swipe through case flashcards
- **Scoreboard** (right, two-people icon) - Coming soon placeholder

## Current Status

This version includes:
- ✅ Tab navigation system
- ✅ My Bio with animated lion character and merch unlocks
- ✅ Daily case flashcards with swipe/scroll interface
- ✅ Progress tracking and localStorage persistence
- ⏳ Placeholder cases (3 examples)
- ⏳ Scoreboard (coming soon)

Real Cannes cases and daily case rotation will be added in a future update.

## Tech Stack

- Static HTML/CSS/JavaScript
- No backend or build process
- Mobile-first design with desktop support
- Hosted on GitHub Pages
- SVG-based layered lion character

## Local Development

Simply open `index.html` in a browser or run a local server:

```bash
python -m http.server 8000
# or
npx serve
```

Then visit `http://localhost:8000`

## Files

- `index.html` – Main HTML structure with tab system
- `styles.css` – Mobile-first styles with hot pink theme and lion animations
- `app.js` – Tab navigation, swipe/scroll interactions, and progress tracking
- `assets/` – Lion character SVG layers (base + 6 clothing items)
- `.nojekyll` – Tells GitHub Pages not to process with Jekyll

## Design

- **Colors**: Hot pink (#FF4458) + white + black
- **Typography**: System sans-serif stack
- **Layout**: Phone-width viewport, centered on desktop
- **Interactions**: Touch swipe on mobile, mouse drag on desktop
- **Language**: Traditional Chinese UI
- **Animation**: Gentle bounce animation on lion character

## Roadmap

- [ ] Add real Cannes case data
- [ ] Implement daily case rotation
- [ ] Build Scoreboard with leaderboard
- [ ] Add user accounts and cloud sync
- [ ] Backend API for case management
- [ ] Advanced filtering and search

---

Made with ♥ for creative professionals

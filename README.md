# Case Tinder

A mobile-first "Tinder for Cannes cases" website with team identity, progress tracking, and a Google Sheets backend – swipe through creative advertising case studies daily with your Alien Team!

## Live Site

🔗 **https://huirumay28.github.io/case-tinder/**

This site is hosted on GitHub Pages from the `main` branch.

## Overview

Case Tinder presents creative advertising case studies (from Cannes Lions and other awards) in an engaging flashcard format. Sign in with your name, swipe through cases, track your daily streak, and compete with your team on the scoreboard!

### Sign-In Flow

**First visit on a new browser:**
- Enter invite code: `ALIEN`
- Pick your name from the Alien Team roster (13 members)
- Your identity is saved to `localStorage` for future visits

**Returning visit:**
- Automatically signed in with your saved identity
- Progress (likes, view count, viewed days) syncs from the backend

**Switching browsers:**
- Pick your name again (same flow as first visit)
- Progress loads from the backend, so your likes and stats carry over

**No Google account required** – identity is name-based, managed by the backend.

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
- **Scoreboard** (right, two-people icon) - Team leaderboard and liked cases

### Scoreboard

Real-time team leaderboard powered by Google Sheets:
- See how many cases each team member has viewed
- Tap any member to see which cases they liked
- See who else liked the same cases as you
- Your row is highlighted in the ranking

All data syncs to the backend so progress persists across devices.

## Backend Integration

The app connects to a Google Apps Script web app for data persistence.

### API Endpoint

The API URL is configured at the top of `app.js`:

```javascript
const CASETINDER_API = 'CASETINDER_API_PLACEHOLDER';
```

This placeholder string should be replaced with the actual Google Apps Script web app URL before deployment.

### Setting Up the Backend

1. **Create a Google Sheet** with any name (e.g., "Case Tinder Data")
2. **Open Apps Script** (Extensions > Apps Script)
3. **Copy the contents** of `apps-script.gs` into the Apps Script editor
4. **Deploy as web app:**
   - Click Deploy > New deployment
   - Type: Web app
   - Execute as: Me
   - Who has access: **Anyone**
   - Click Deploy and authorize
5. **Copy the web app URL** (looks like `https://script.google.com/macros/s/.../exec`)
6. **Replace the placeholder** in `app.js`:
   ```javascript
   const CASETINDER_API = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
   ```

### API Actions

The backend supports these JSONP endpoints:

- `?action=roster` – Returns the list of 13 team members with names and colors
- `?action=login&code=ALIEN&name=...` – Validates invite code and returns user state
- `?action=state&name=...` – Returns current user's likes, view count, viewed days, and today's swiped cases
- `?action=swipe&name=...&caseId=...&liked=0|1&date=YYYY-MM-DD` – Records a swipe
- `?action=scoreboard` – Returns all members' view counts and liked cases

All API calls use JSONP (not CORS) for compatibility with Apps Script.

### Google Sheets Structure

The backend automatically creates three sheets:

1. **Roster** – Team member names and avatar colors
2. **Swipes** – Every swipe recorded (Name, CaseId, Liked, Date, Timestamp)
3. **State** – Current state per user (Name, ViewCount, Likes, ViewedDays)

Users **never see or access the spreadsheet directly** – all interaction is through the web app.

## Current Status

This version includes:
- ✅ Sign-in gate with invite code and name picker
- ✅ Identity persistence in localStorage
- ✅ Tab navigation system
- ✅ My Bio with animated lion character and merch unlocks
- ✅ Daily case flashcards with swipe/scroll interface
- ✅ Progress tracking (local + backend sync)
- ✅ Real scoreboard with team leaderboard and liked cases
- ✅ 10 real Cannes Lions 2026 Grand Prix cases with presentation boards and casefilm links
- ✅ Google Apps Script backend for data persistence
- ✅ API connected and ready to use

## Tech Stack

- Static HTML/CSS/JavaScript (no build process)
- JSONP API calls (no CORS needed)
- Google Apps Script backend (serverless)
- Google Sheets as database
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

**Note:** Without a configured API endpoint, the sign-in will fail. You can temporarily test the UI by manually setting `localStorage.setItem('casetinder-user', 'Huiru')` in the browser console and refreshing.

## Files

- `index.html` – Main HTML structure with tab system and sign-in gate
- `styles.css` – Mobile-first styles with hot pink theme, lion animations, and sign-in UI
- `app.js` – Sign-in logic, API integration, tab navigation, swipe/scroll interactions, and progress tracking
- `apps-script.gs` – Google Apps Script backend (copy to Apps Script editor)
- `assets/` – Lion character SVG layers (base + 6 clothing items)
- `.nojekyll` – Tells GitHub Pages not to process with Jekyll

## Design

- **Colors**: Hot pink (#FF4458) + white + black
- **Typography**: System sans-serif stack
- **Layout**: Phone-width viewport, centered on desktop
- **Interactions**: Touch swipe on mobile, mouse drag on desktop
- **Language**: Traditional Chinese UI (繁體中文)
- **Names**: English official names (Huiru, Hao Tseng, etc.)
- **Animation**: Gentle bounce animation on lion character

## Deployment Checklist

Before deploying to production:

1. ✅ Create and deploy the Google Apps Script backend
2. ✅ Copy the web app URL from Apps Script deployment
3. ⚠️ Replace `CASETINDER_API_PLACEHOLDER` in `app.js` with the actual URL
4. ✅ Commit and push to GitHub
5. ✅ Verify the sign-in flow works end-to-end

## Security & Privacy

- **Invite code:** `ALIEN` (validated server-side only)
- **No passwords:** Name-based identity, no authentication
- **Data privacy:** Users never see the Google Sheet
- **Persistence:** LocalStorage for identity, Google Sheets for progress
- **Access control:** Apps Script web app set to "Anyone" (no Google account required)

## Roadmap

- [x] Sign-in gate with name picker
- [x] Google Sheets backend integration
- [x] Real scoreboard with team data
- [x] Progress sync across devices
- [ ] Daily case rotation (currently shows all 10 cases)
- [ ] More Cannes cases (expand beyond 2026 Grand Prix)
- [ ] Advanced filtering and search

---

Made with ♥ for the Alien Team

# Understory App - Claude Code Context

## Overview
Understory is a flashcard application for learning NYC-area wildflowers. Users can study 15 species through three modes: Learn, Practice, and Test.

## Tech Stack
- **React 18** with Vite for fast development
- **CSS Modules** for scoped styling
- **No external UI libraries** - custom components only

## Architecture

### Directory Structure
```
src/
├── main.jsx           # React entry point
├── index.css          # Global styles (minimal reset)
├── App.jsx            # Main app component with state management
├── App.module.css     # App-level styles
├── components/
│   ├── FlashCard.jsx      # Main card component
│   └── FlashCard.module.css
└── data/
    └── wildflowers.js     # Flower data with photos
```

### State Management
All state lives in `App.jsx`:
- `mode` - current study mode ('learn' | 'practice' | 'test')
- `currentIndex` - active flower index
- `showAnswer` - whether answer is revealed
- `masteredIds` - Set of mastered flower IDs
- `userGuess` - text input value
- `feedback` - guess result object
- `photoIndex` - current photo in multi-photo flowers
- `imageError` - fallback state for broken images

### Design System

**Colors:**
- Primary green: `#5c6b4a` (buttons, progress, accents)
- Background: `linear-gradient(135deg, #f5f5f0 0%, #e8e4d9 100%)`
- Text dark: `#3d3d3d`
- Text muted: `#6b6b6b`
- Border/neutral: `#d4cfc4`
- Error/incorrect: `#b85c5c`
- Practice hint accent: `#d4a574`

**Typography:**
- Font family: Georgia, Times New Roman, serif
- Title: 2.5rem, letter-spacing 0.3em, uppercase
- Labels: 0.75rem, uppercase, letter-spacing 0.1em

**Components:**
- Cards have 8px border-radius, subtle shadow
- Buttons have 4-6px border-radius
- Inputs have 2px borders that change color on focus

## Data Structure
Each flower in `wildflowers.js`:
```js
{
  id: number,
  commonName: string,
  latinName: string,
  habitat: string,
  season: string,       // e.g., "March-May"
  hint: string,         // ID features
  color: string,        // hex for fallback display
  photos: string[],     // Wikimedia URLs
  attribution: string   // License info
}
```

## Known Issues
1. Some Wikimedia image URLs may 404 - fallback UI shows color circle
2. No persistence - mastered progress resets on refresh
3. Mobile touch targets could be larger

## Planned Improvements
- [ ] Add localStorage for mastered progress
- [ ] Implement spaced repetition algorithm
- [ ] Add keyboard navigation (left/right arrows)
- [ ] Filter by season or habitat
- [ ] Add search functionality
- [ ] Shuffle mode for practice/test
- [ ] Track accuracy statistics
- [ ] PWA support for offline use

## Commands
```bash
npm install    # Install dependencies
npm run dev    # Start dev server (default: localhost:5173)
npm run build  # Production build to dist/
npm run preview # Preview production build
```

# Tests

```
cd tests && npm install
npm test            # walkthrough (every mandatory function) + migration (history preserved, engine rules)
npm run measure     # renders each screen at iPhone 16 Pro size and reports whether it fits without scrolling
```
`measure` needs a Chromium; set `PLAYWRIGHT_BROWSERS_PATH` or edit `executablePath` in measure.js if it isn't found.

# Tests and build

`workout-tracker.html` is a generated file. The app source is `src/workout-tracker.jsx`;
the page head, compiled CSS and inlined React are in `src/shell.html`.

```
cd tests && npm install
npm run build       # compile src/ into ../workout-tracker.html (run after every source edit)
npm test            # walkthrough (every mandatory function, and fails if the built file is stale)
                    # + migration (history preserved) + engine (progression, CSV, resume, save-failure rules)
npm run measure     # renders each screen at iPhone 16 Pro size and reports whether it fits without scrolling
```
`measure` needs a Chromium; set `PLAYWRIGHT_BROWSERS_PATH` or edit `executablePath` in measure.js if it isn't found.

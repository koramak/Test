// Builds ../workout-tracker.html from ../src: compiles the JSX app once, here, so the
// phone doesn't have to ship and run a 3 MB compiler on every launch.
// Usage: node build.js          write workout-tracker.html
//        node build.js --check  exit 1 if workout-tracker.html is stale
const fs = require('fs');
const path = require('path');
const Babel = require('@babel/standalone/babel.min.js');
const root = path.join(__dirname, '..');
const build = () => {
  const jsx = fs.readFileSync(path.join(root, 'src', 'workout-tracker.jsx'), 'utf8');
  const shell = fs.readFileSync(path.join(root, 'src', 'shell.html'), 'utf8');
  const { code } = Babel.transform(jsx, { presets: ['react'], compact: false, comments: false });
  if (/<\/script/i.test(code)) throw new Error('compiled app contains "</script" - it would end the script tag early');
  if (!shell.includes('/*__APP__*/')) throw new Error('src/shell.html is missing the /*__APP__*/ placeholder');
  return shell.replace('/*__APP__*/', () => code);
};
module.exports = { build };
if (require.main === module) {
  const out = path.join(root, 'workout-tracker.html');
  const html = build();
  if (process.argv.includes('--check')) {
    const current = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : '';
    if (current !== html) { console.log('FAIL workout-tracker.html is stale - run: npm run build'); process.exit(1); }
    console.log('PASS workout-tracker.html matches src');
  } else {
    fs.writeFileSync(out, html);
    console.log(`Built workout-tracker.html (${(html.length / 1024).toFixed(0)} KB)`);
  }
}

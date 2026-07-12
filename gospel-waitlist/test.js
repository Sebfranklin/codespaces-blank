const fs = require('fs');
const assert = require('assert');
const path = require('path');

console.log("Running baseline structure checks...");

const baseDir = __dirname;
const htmlPath = path.join(baseDir, 'index.html');
const cssPath = path.join(baseDir, 'styles.css');
const jsPath = path.join(baseDir, 'app.js');

// Verify files exist
assert(fs.existsSync(htmlPath), 'index.html is missing');
assert(fs.existsSync(cssPath), 'styles.css is missing');
assert(fs.existsSync(jsPath), 'app.js is missing');

const html = fs.readFileSync(htmlPath, 'utf8');
const js   = fs.readFileSync(jsPath, 'utf8');

// HTML structure
assert(html.includes('<!DOCTYPE html>'), 'Missing DOCTYPE');
assert(html.includes('tailwind'), 'Tailwind CSS CDN is missing');
assert(html.includes('vanilla-tilt'), 'Vanilla-tilt script tag is missing');
assert(html.includes('lucide'), 'Lucide Icons script tag is missing');
assert(html.includes('icon.png'), 'Header Gospel icon is missing');
assert(html.includes('carousel-card'), 'Carousel card class is missing');
assert(html.includes('id="carousel-track"'), 'Carousel track element is missing');
assert(html.includes('id="feature-title"'), 'Feature title element is missing');
assert(html.includes('id="feature-desc"'), 'Feature description element is missing');
assert(html.includes('id="vision-section"'), 'Vision section wrapper is missing');
assert(html.includes('id="waitlist-section"'), 'Waitlist section wrapper is missing');
assert(html.includes('id="waitlist-form"'), 'Waitlist form element is missing');
assert(html.includes('<!-- data-tilt -->'), 'data-tilt indicator comment is missing');

// JS features
assert(js.includes('startAuto'), 'Autoplay function missing');
assert(js.includes('go(active'), 'Card navigation function missing');
assert(js.includes('addEventListener("click"'), 'Click handlers missing');

console.log("All waitlist landing page structural, animation, and form checks passed!");

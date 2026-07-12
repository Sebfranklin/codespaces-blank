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

const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Assert key markup details
assert(htmlContent.includes('<!DOCTYPE html>'), 'Missing DOCTYPE');
assert(htmlContent.includes('play.tailwindcss.com') || htmlContent.includes('tailwind'), 'Tailwind CSS CDN is missing');
assert(htmlContent.includes('vanilla-tilt'), 'Vanilla-tilt script tag is missing');
assert(htmlContent.includes('lucide'), 'Lucide Icons script tag is missing');
assert(htmlContent.includes('icon.png'), 'Header Gospel icon is missing');

// Assert existence of Coverflow Carousel elements
assert(htmlContent.includes('class="perspective-container'), 'Perspective container is missing');
assert(htmlContent.includes('id="carousel-track"'), 'Carousel track element is missing');
assert(htmlContent.includes('class="carousel-card'), 'Carousel card class is missing');
assert(htmlContent.includes('id="feature-title"'), 'Feature title element is missing');
assert(htmlContent.includes('id="feature-desc"'), 'Feature description element is missing');

console.log("Baseline + Coverflow structure checks passed!");

# Gospel Waitlist Landing Page Polish & Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement visual polish, accessibility fixes, and performance optimization for the Gospel Waitlist Landing Page.

**Architecture:** 
1. Enhance Zdog 3D shapes for visual premiumness.
2. Use a fixed overlay with radial gradient for the selection pulse.
3. Clean up IntersectionObserver element querying by introducing IDs, and pause Zdog render loops when the canvas is off-screen.
4. Enhance accessibility with focus rings and secure storage access with try-catch blocks.

**Tech Stack:** Vanilla JS, Tailwind CSS, Zdog, Vanilla-Tilt.js

## Global Constraints
- Do not break existing page structure or JS validations in `test.js`.
- Always wrap localStorage accesses in try...catch blocks.
- Ensure focus indicators are visible and accessible.

---

### Task 1: Zdog Shapes Enhancements

**Files:**
- Modify: `gospel-waitlist/app.js`

**Interfaces:**
- Consumes: Zdog carousel initialization
- Produces: Enhanced 3D models for United Body, Spiritual Life, and Job Opportunities shapes.

- [ ] **Step 1: Replace basic cross with interlocking rings**
  Update crossGroup shape creation to use two `Ellipse` shapes of diameter 28, stroke 4, rotated Y opposite direction, offset on X.
  
- [ ] **Step 2: Add light rays radiating from book**
  Add 6 Zdog Shape paths representing geometric light rays around bookGroup.

- [ ] **Step 3: Add portal ring behind briefcase**
  Add a large Ellipse behind jobGroup briefcase.

- [ ] **Step 4: Verify syntax and visually review shapes**
  Run `node test.js` to ensure baseline tests still pass.

---

### Task 2: Radial Gradient Pulse & Safe Title Timeout

**Files:**
- Modify: `gospel-waitlist/index.html`
- Modify: `gospel-waitlist/app.js`

**Interfaces:**
- Consumes: `#interaction-pulse` HTML element, `selectFeature` triggers
- Produces: Safe title typewriter rendering and pulse effects during slide changes.

- [ ] **Step 1: Add interaction-pulse overlay to index.html**
  Add the pulse element in `gospel-waitlist/index.html` right inside the body:
  `<div id="interaction-pulse" class="fixed inset-0 pointer-events-none opacity-0 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,rgba(5,5,5,0)_70%)] z-50"></div>`

- [ ] **Step 2: Add global variables in app.js**
  Declare `let titleTimeout = null;` and `let pulseTimeout = null;` at the top level of `app.js`.

- [ ] **Step 3: Update selectFeature implementation**
  Clear `titleTimeout` and `pulseTimeout`. Replace body background color flash with interaction pulse transition.

- [ ] **Step 4: Run tests to verify**
  Run `node test.js` to ensure the structure remains intact.

---

### Task 3: Accessibility & Secure Storage

**Files:**
- Modify: `gospel-waitlist/index.html`
- Modify: `gospel-waitlist/app.js`

**Interfaces:**
- Consumes: Form submit handlers, input elements
- Produces: Focus visible styling and crash-resistant localStorage utility.

- [ ] **Step 1: Replace outline-none with focus rings**
  In `index.html`, replace all instances of `outline-none` with `focus:outline-none focus:ring-2 focus:ring-gold-primary`. Add focus rings on buttons as well for consistency.

- [ ] **Step 2: Wrap localStorage accesses in try...catch**
  In `app.js`, wrap the getItem and setItem calls in `try...catch` blocks to support private browsing mode.

---

### Task 4: IntersectionObserver Cleanup & Performance Optimization

**Files:**
- Modify: `gospel-waitlist/index.html`
- Modify: `gospel-waitlist/app.js`

**Interfaces:**
- Consumes: Theme switching trigger, canvas visibility
- Produces: Optimized Zdog drawing loop and clean element queries.

- [ ] **Step 1: Add IDs to logo and hero elements**
  Add `id="logo-text"` to the header logo text and `id="hero-title"` to the main `h1` in `index.html`.

- [ ] **Step 2: Use IDs in IntersectionObserver queries**
  In `app.js`, query by ID (`document.getElementById("logo-text")` and `document.getElementById("hero-title")`) rather than generic tags/classes.

- [ ] **Step 3: Create canvas IntersectionObserver**
  Define `let isCanvasVisible = true;`. Observe the canvas and toggle `isCanvasVisible`.
  In `animate()`, wrap the `illo.updateRenderGraph()` call so that it only runs when `isCanvasVisible` is true.

- [ ] **Step 4: Run final verification**
  Run the test suite `node test.js`. Ensure everything passes perfectly.

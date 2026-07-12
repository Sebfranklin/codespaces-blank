// App Data
const FEATURES = [
  {
    title: "A United Body",
    description: "Connecting believers across every nation, tribe, and denomination into one platform. Built on love, not division."
  },
  {
    title: "Spiritual Life Building",
    description: "Daily structured growth, Bible readings, and guided prayers powered by faith-aligned intelligence."
  },
  {
    title: "Job Opportunities",
    description: "Empowering prosperity. Match with Christian employers, projects, and missions seeking your talents."
  },
  {
    title: "Better Collaboration",
    description: "Launch joint church campaigns, charitable initiatives, and mission projects with unified tracking."
  },
  {
    title: "Online Team Gaming",
    description: "Play together in clean, team-based community competitions built for fellowship and interactive fun."
  },
  {
    title: "Developer Communities",
    description: "A hub for designers, engineers, and creators building open-source tools for the global church."
  }
];

let activeIndex = 0;
const titleEl = document.getElementById("feature-title");
const descEl = document.getElementById("feature-desc");
const bodyElement = document.body;
let titleTimeout = null;
let pulseTimeout = null;

// Typewriter transition function
let typewriterInterval = null;

function selectFeature(index) {
  activeIndex = ((index % FEATURES.length) + FEATURES.length) % FEATURES.length;
  const targetFeature = FEATURES[activeIndex];

  // Stop any ongoing typewriter
  if (typewriterInterval) {
    clearInterval(typewriterInterval);
    typewriterInterval = null;
  }

  // Fade out title
  titleEl.style.opacity = 0;

  if (titleTimeout) {
    clearTimeout(titleTimeout);
  }
  titleTimeout = setTimeout(() => {
    titleEl.textContent = targetFeature.title;
    // Fade in title
    titleEl.style.opacity = 1;
  }, 150);

  // Typewriter effect for description
  const fullText = targetFeature.description;
  descEl.textContent = "";
  descEl.style.opacity = 1; // Ensure description is fully visible
  
  let charIndex = 0;
  typewriterInterval = setInterval(() => {
    if (charIndex < fullText.length) {
      descEl.textContent += fullText[charIndex];
      charIndex++;
    } else {
      clearInterval(typewriterInterval);
      typewriterInterval = null;
    }
  }, 15); // 15ms per character

  // Trigger brief radial gradient interaction pulse on overlay
  const currentBg = bodyElement.style.backgroundColor;
  if (currentBg !== 'rgb(250, 250, 247)' && currentBg.toLowerCase() !== '#fafaf7') {
    const pulseEl = document.getElementById("interaction-pulse");
    if (pulseEl) {
      pulseEl.style.opacity = "1";
      if (pulseTimeout) {
        clearTimeout(pulseTimeout);
      }
      pulseTimeout = setTimeout(() => {
        pulseEl.style.opacity = "0";
      }, 250);
    }
  }
}

// Set initial style transitions
titleEl.style.transition = "opacity 0.2s ease";

// Zdog 3D Scaffolding
const { Illustration, Anchor, Group, Shape, Ellipse, Rect, Polygon } = Zdog;

const illo = new Illustration({
  element: '#zdog-canvas',
  zoom: 1.5,
  dragRotate: false,
});

// Carousel pivot group
const carouselGroup = new Group({
  addTo: illo
});

const RADIUS = 110;
const shapes = [];

// Helper shapes
// Shape 1: United Body (Two interlocking golden rings)
const crossGroup = new Group({ addTo: carouselGroup, translate: { x: 0, z: RADIUS } });
new Ellipse({
  addTo: crossGroup,
  diameter: 28,
  stroke: 4,
  color: '#D4AF37',
  rotate: { y: Math.PI / 4 },
  translate: { x: -2 }
});
new Ellipse({
  addTo: crossGroup,
  diameter: 28,
  stroke: 4,
  color: '#D4AF37',
  rotate: { y: -Math.PI / 4 },
  translate: { x: 2 }
});

// Shape 2: Open Book / Bible (Spiritual Life with radiating light rays)
const bookGroup = new Group({ addTo: carouselGroup, translate: { x: RADIUS * Math.sin(Math.PI/3), z: RADIUS * Math.cos(Math.PI/3) } });
new Rect({
  addTo: bookGroup,
  width: 25,
  height: 35,
  stroke: 3,
  color: '#F5D76E',
  fill: true,
  cornerRadius: 3
});
new Shape({
  addTo: bookGroup,
  path: [ { x: 0, y: -17 }, { x: 0, y: 17 } ],
  stroke: 2,
  color: '#101010'
});
// Radiating light rays
const rayPaths = [
  { x: -16, y: -22, dx: -6, dy: -8 },
  { x: 16, y: -22, dx: 6, dy: -8 },
  { x: -16, y: 22, dx: -6, dy: 8 },
  { x: 16, y: 22, dx: 6, dy: 8 },
  { x: -18, y: 0, dx: -8, dy: 0 },
  { x: 18, y: 0, dx: 8, dy: 0 }
];
rayPaths.forEach(ray => {
  new Shape({
    addTo: bookGroup,
    path: [
      { x: ray.x, y: ray.y },
      { x: ray.x + ray.dx, y: ray.y + ray.dy }
    ],
    stroke: 2,
    color: '#F5D76E'
  });
});

// Shape 3: Briefcase / Jobs (with a portal ring behind it)
const jobGroup = new Group({ addTo: carouselGroup, translate: { x: RADIUS * Math.sin(2*Math.PI/3), z: RADIUS * Math.cos(2*Math.PI/3) } });
new Ellipse({
  addTo: jobGroup,
  diameter: 42,
  stroke: 2,
  color: '#F5D76E',
  translate: { z: -5 }
});
new Rect({
  addTo: jobGroup,
  width: 32,
  height: 22,
  stroke: 4,
  color: '#B8860B',
  fill: true
});
new Shape({
  addTo: jobGroup,
  path: [ { x: -8, y: -11 }, { x: -8, y: -16 }, { x: 8, y: -16 }, { x: 8, y: -11 } ],
  stroke: 3,
  closed: false,
  color: '#D4AF37'
});

// Shape 4: Connected Globe / Collaboration
const globeGroup = new Group({ addTo: carouselGroup, translate: { x: 0, z: -RADIUS } });
new Ellipse({
  addTo: globeGroup,
  diameter: 30,
  stroke: 4,
  color: '#D4AF37'
});
new Ellipse({
  addTo: globeGroup,
  diameter: 30,
  stroke: 2,
  color: '#F5D76E',
  rotate: { y: Math.PI / 4 }
});
new Ellipse({
  addTo: globeGroup,
  diameter: 30,
  stroke: 2,
  color: '#B8860B',
  rotate: { y: -Math.PI / 4 }
});

// Shape 5: Game Controller / Team Play
const gameGroup = new Group({ addTo: carouselGroup, translate: { x: RADIUS * Math.sin(4*Math.PI/3), z: RADIUS * Math.cos(4*Math.PI/3) } });
new Rect({
  addTo: gameGroup,
  width: 34,
  height: 20,
  stroke: 6,
  color: '#F5D76E',
  cornerRadius: 8,
  fill: true
});
new Ellipse({
  addTo: gameGroup,
  diameter: 6,
  stroke: 2,
  translate: { x: 8, y: 2 },
  color: '#101010',
  fill: true
});

// Shape 6: Code Brackets / Devs
const codeGroup = new Group({ addTo: carouselGroup, translate: { x: RADIUS * Math.sin(5*Math.PI/3), z: RADIUS * Math.cos(5*Math.PI/3) } });
new Shape({
  addTo: codeGroup,
  path: [ { x: -5, y: -12 }, { x: -12, y: 0 }, { x: -5, y: 12 } ],
  stroke: 4,
  closed: false,
  color: '#D4AF37'
});
new Shape({
  addTo: codeGroup,
  path: [ { x: 5, y: -12 }, { x: 12, y: 0 }, { x: 5, y: 12 } ],
  stroke: 4,
  closed: false,
  color: '#D4AF37'
});

// Keep shapes reference
shapes.push(crossGroup, bookGroup, jobGroup, globeGroup, gameGroup, codeGroup);

// Eased target rotations
let targetRotationY = 0;
let currentRotationY = 0;
let isCanvasVisible = true;

const canvasObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    isCanvasVisible = entry.isIntersecting;
  });
}, { threshold: 0 });

const canvasElementForObs = document.getElementById("zdog-canvas");
if (canvasElementForObs) {
  canvasObserver.observe(canvasElementForObs);
}

// Animate Zdog scene
function animate() {
  // Soft float animation
  const time = Date.now() * 0.001;
  
  // Apply individual float/spins to active carousel shapes
  shapes.forEach((s, idx) => {
    s.rotate.y = time * 0.5;
    s.translate.y = Math.sin(time * 2 + idx) * 3;
  });

  // Soft easing of selection rotation
  currentRotationY += (targetRotationY - currentRotationY) * 0.1;
  carouselGroup.rotate.y = currentRotationY;

  if (isCanvasVisible) {
    illo.updateRenderGraph();
  }
  requestAnimationFrame(animate);
}
animate();

// Event listeners for Navigation Controls
document.getElementById("prev-btn").addEventListener("click", () => {
  targetRotationY += Math.PI / 3; // 60 degrees step
  selectFeature(activeIndex - 1);
});

document.getElementById("next-btn").addEventListener("click", () => {
  targetRotationY -= Math.PI / 3;
  selectFeature(activeIndex + 1);
});

// Enable custom pointer events on the canvas for drag rotation & carousel snapping
const canvasEl = document.getElementById("zdog-canvas");
let isDragging = false;
let startX = 0;
let startRotationY = 0;

canvasEl.addEventListener("pointerdown", (e) => {
  isDragging = true;
  startX = e.clientX;
  startRotationY = targetRotationY;
  canvasEl.setPointerCapture(e.pointerId);
});

canvasEl.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  const dx = e.clientX - startX;
  // Mapping dx to targetRotationY. Dragging left (negative dx) rotates Y in negative direction.
  const sensitivity = 0.007;
  targetRotationY = startRotationY + dx * sensitivity;
});

canvasEl.addEventListener("pointerup", (e) => {
  if (!isDragging) return;
  isDragging = false;
  canvasEl.releasePointerCapture(e.pointerId);

  // Snap the carousel to the nearest 60-degree segment (PI/3 radians)
  const segment = Math.PI / 3;
  const roundedSegments = Math.round(targetRotationY / segment);
  targetRotationY = roundedSegments * segment;

  // Calculate corresponding selected feature index (safely wrapping the index)
  const index = -roundedSegments;
  selectFeature(index);
});

canvasEl.addEventListener("pointercancel", (e) => {
  if (!isDragging) return;
  isDragging = false;
  canvasEl.releasePointerCapture(e.pointerId);

  const segment = Math.PI / 3;
  const roundedSegments = Math.round(targetRotationY / segment);
  targetRotationY = roundedSegments * segment;

  const index = -roundedSegments;
  selectFeature(index);
});

// Intersection Observer for Background Color Transition (Black to White)
const visionSection = document.getElementById("vision-section");

const observerOptions = {
  root: null,
  threshold: 0.35
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Reveal vision section
      visionSection.classList.remove("opacity-0", "translate-y-12");
      
      // Shift theme background to white
      bodyElement.style.backgroundColor = "#FAFAF7";
      bodyElement.style.color = "#101010";
      
      // Select elements to adapt their style/color
      document.getElementById("logo-text")?.classList.replace("text-white", "text-black");
      document.getElementById("hero-title")?.classList.replace("text-white", "text-black");
      document.querySelectorAll("#hero-section button").forEach(btn => {
        btn.classList.replace("border-zinc-800", "border-zinc-300");
        btn.classList.replace("text-zinc-400", "text-zinc-700");
      });
      titleEl?.classList.replace("text-gold-light", "text-gold-dark");
      descEl?.classList.replace("text-zinc-400", "text-zinc-600");
    } else {
      // Revert theme background to deep black
      bodyElement.style.backgroundColor = "#050505";
      bodyElement.style.color = "#FAFAF7";
      
      document.getElementById("logo-text")?.classList.replace("text-black", "text-white");
      document.getElementById("hero-title")?.classList.replace("text-black", "text-white");
      document.querySelectorAll("#hero-section button").forEach(btn => {
        btn.classList.replace("border-zinc-300", "border-zinc-800");
        btn.classList.replace("text-zinc-700", "text-zinc-400");
      });
      titleEl?.classList.replace("text-gold-dark", "text-gold-light");
      descEl?.classList.replace("text-zinc-600", "text-zinc-400");
    }
  });
}, observerOptions);

observer.observe(visionSection);

// Waitlist Form Handler
const waitlistForm = document.getElementById("waitlist-form");
const submissionToast = document.getElementById("submission-toast");
let toastTimeout = null;

waitlistForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const fullName = document.getElementById("full-name").value;
  const email = document.getElementById("email").value;
  
  // Store Waitlist entry locally (simulation)
  let waitlist = [];
  try {
    waitlist = JSON.parse(localStorage.getItem("gospel_waitlist") || "[]");
  } catch (e) {
    console.warn("localStorage is disabled or not accessible:", e);
  }

  waitlist.push({ fullName, email, timestamp: new Date().toISOString() });
  
  try {
    localStorage.setItem("gospel_waitlist", JSON.stringify(waitlist));
  } catch (e) {
    console.warn("Failed to write to localStorage:", e);
  }
  
  // Reset inputs
  waitlistForm.reset();
  
  // Show toast confirmation
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }
  submissionToast.classList.remove("hidden");
  toastTimeout = setTimeout(() => {
    submissionToast.classList.add("hidden");
  }, 6000);
});

// Configure Vanilla-Tilt parameters programmatically
if (window.VanillaTilt) {
  VanillaTilt.init(document.querySelector(".tilt-card"), {
    max: 8,
    speed: 400,
    glare: true,
    "max-glare": 0.15,
  });
}


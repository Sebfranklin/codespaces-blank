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

  setTimeout(() => {
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

  // Trigger brief highlight reveal effect
  document.body.classList.add('bg-zinc-900');
  setTimeout(() => {
    document.body.classList.remove('bg-zinc-900');
  }, 400);
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
// Shape 1: Cross / United Body
const crossGroup = new Group({ addTo: carouselGroup, translate: { x: 0, z: RADIUS } });
new Shape({
  addTo: crossGroup,
  path: [ { y: -25 }, { y: 25 } ],
  stroke: 8,
  color: '#D4AF37'
});
new Shape({
  addTo: crossGroup,
  path: [ { x: -15 }, { x: 15 } ],
  translate: { y: -8 },
  stroke: 8,
  color: '#D4AF37'
});

// Shape 2: Open Book / Bible
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

// Shape 3: Briefcase / Jobs
const jobGroup = new Group({ addTo: carouselGroup, translate: { x: RADIUS * Math.sin(2*Math.PI/3), z: RADIUS * Math.cos(2*Math.PI/3) } });
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

  illo.updateRenderGraph();
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
const bodyElement = document.body;
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
      document.querySelector("header span.text-white")?.classList.replace("text-white", "text-black");
      document.querySelector("#hero-section h1")?.classList.replace("text-white", "text-black");
      document.querySelectorAll("#hero-section button").forEach(btn => {
        btn.classList.replace("border-zinc-800", "border-zinc-300");
        btn.classList.replace("text-zinc-400", "text-zinc-700");
      });
    } else {
      // Revert theme background to deep black
      bodyElement.style.backgroundColor = "#050505";
      bodyElement.style.color = "#FAFAFA";
      
      document.querySelector("header span.text-black")?.classList.replace("text-black", "text-white");
      document.querySelector("#hero-section h1")?.classList.replace("text-black", "text-white");
      document.querySelectorAll("#hero-section button").forEach(btn => {
        btn.classList.replace("border-zinc-300", "border-zinc-800");
        btn.classList.replace("text-zinc-700", "text-zinc-400");
      });
    }
  });
}, observerOptions);

observer.observe(visionSection);

// Waitlist Form Handler
const waitlistForm = document.getElementById("waitlist-form");
const submissionToast = document.getElementById("submission-toast");

waitlistForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const fullName = document.getElementById("full-name").value;
  const email = document.getElementById("email").value;
  
  // Store Waitlist entry locally (simulation)
  const waitlist = JSON.parse(localStorage.getItem("gospel_waitlist") || "[]");
  waitlist.push({ fullName, email, timestamp: new Date().toISOString() });
  localStorage.setItem("gospel_waitlist", JSON.stringify(waitlist));
  
  // Reset inputs
  waitlistForm.reset();
  
  // Show toast confirmation
  submissionToast.classList.remove("hidden");
  setTimeout(() => {
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


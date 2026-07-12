const FEATURES = [
  {
    title: "A United Body",
    description: "Connecting believers across every nation, tribe, and denomination into one platform. Built on love, not division."
  },
  {
    title: "Spiritual Life",
    description: "Daily structured growth, Bible readings, and guided prayers powered by faith-aligned intelligence."
  },
  {
    title: "Job Openings",
    description: "Empowering prosperity. Match with Christian employers, projects, and missions seeking your talents."
  },
  {
    title: "Collaboration",
    description: "Launch joint church campaigns, charitable initiatives, and mission projects with unified tracking."
  },
  {
    title: "Team Gaming",
    description: "Play together in clean, team-based community competitions built for fellowship and interactive fun."
  },
  {
    title: "Developer Hub",
    description: "A hub for designers, engineers, and creators building open-source tools for the global church."
  }
];

let activeIndex = 0;
const cards = document.querySelectorAll(".carousel-card");
const titleEl = document.getElementById("feature-title");
const descEl = document.getElementById("feature-desc");
const pulseOverlay = document.getElementById("interaction-pulse");

let typewriterInterval = null;
let titleTimeout = null;
let pulseTimeout = null;

// Determine current theme to toggle dynamic colors
function isWhiteTheme() {
  return document.body.style.backgroundColor === "rgb(250, 250, 247)" || document.body.style.backgroundColor === "#FAFAF7";
}

// Safely clear timeouts to prevent overlapping text issues
function clearExistingTransitions() {
  if (typewriterInterval) clearInterval(typewriterInterval);
  if (titleTimeout) clearTimeout(titleTimeout);
  if (pulseTimeout) clearTimeout(pulseTimeout);
}

// Handle typewriter animation for feature description
function runTypewriterAnimation(descriptionText) {
  descEl.textContent = "";
  let charIndex = 0;
  typewriterInterval = setInterval(() => {
    if (charIndex < descriptionText.length) {
      descEl.textContent += descriptionText.charAt(charIndex);
      charIndex++;
    } else {
      clearInterval(typewriterInterval);
      typewriterInterval = null;
    }
  }, 12);
}

// Trigger golden highlight pulse overlay in dark mode
function triggerPulseOverlay() {
  if (!isWhiteTheme() && pulseOverlay) {
    pulseOverlay.style.opacity = 1;
    pulseTimeout = setTimeout(() => {
      pulseOverlay.style.opacity = 0;
    }, 250);
  }
}

function selectFeature(index) {
  activeIndex = ((index % FEATURES.length) + FEATURES.length) % FEATURES.length;
  const targetFeature = FEATURES[activeIndex];

  clearExistingTransitions();

  // Transition Text Colors smoothly
  titleEl.style.opacity = 0;
  titleTimeout = setTimeout(() => {
    titleEl.textContent = targetFeature.title;
    titleEl.style.opacity = 1;
  }, 150);

  runTypewriterAnimation(targetFeature.description);
  triggerPulseOverlay();
  updateCardPositions();
}

// Setup Vanilla Tilt library interaction for centered card
function handleVanillaTilt(card, isCenter) {
  const hasTilt = !!card.vanillaTilt;
  if (isCenter === hasTilt) {
    return;
  }
  
  if (isCenter) {
    if (window.VanillaTilt) {
      VanillaTilt.init(card, {
        max: 12,
        speed: 400,
        glare: true,
        "max-glare": 0.2
      });
    }
  } else {
    card.vanillaTilt.destroy();
  }
}

// Update border highlight and tilt behaviors
function updateCardBorderAndTilt(card, isCenter) {
  if (isCenter) {
    card.classList.add("border-gold-primary", "shadow-xl");
    card.classList.remove("border-zinc-800");
  } else {
    card.classList.remove("border-gold-primary", "shadow-xl");
    card.classList.add("border-zinc-800");
  }
  handleVanillaTilt(card, isCenter);
}

// Calculate wrapped circular index offset
function getWrappedOffset(index, active, total) {
  let offset = index - active;
  const half = total / 2;
  if (offset > half) offset -= total;
  if (offset < -half) offset += total;
  return offset;
}

// Compute transform and display properties for cards based on offset without ternary operators
function calculateCardProperties(offset, isCenter) {
  const mobileFactor = Number(window.innerWidth < 640);
  const centerFactor = Number(isCenter);
  
  return {
    translateX: offset * (160 - mobileFactor * 70),
    scale: 0.9 + centerFactor * 0.25,
    opacity: 0.4 + centerFactor * 0.6,
    zIndex: 20 + centerFactor * 10,
    rotateY: offset * -25
  };
}

function updateCardPositions() {
  cards.forEach((card, index) => {
    const offset = getWrappedOffset(index, activeIndex, cards.length);
    const isCenter = (offset === 0);
    const props = calculateCardProperties(offset, isCenter);

    // Apply transform properties directly
    card.style.transform = `translateX(${props.translateX}px) scale(${props.scale}) rotateY(${props.rotateY}deg)`;
    card.style.opacity = props.opacity;
    card.style.zIndex = props.zIndex;

    updateCardBorderAndTilt(card, isCenter);
  });
}

// Navigation event bindings
document.getElementById("prev-btn").addEventListener("click", () => {
  selectFeature(activeIndex - 1);
});

document.getElementById("next-btn").addEventListener("click", () => {
  selectFeature(activeIndex + 1);
});

// Capture custom swipe pointer events on the track
const track = document.getElementById("carousel-track");
let isDragging = false;
let startX = 0;
let baseIndex = 0;

if (track) {
  track.addEventListener("pointerdown", (e) => {
    isDragging = true;
    startX = e.clientX;
    baseIndex = activeIndex;
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const isMobile = window.innerWidth < 640;
    const threshold = isMobile ? 50 : 80;
    
    const indexShift = Math.round(-dx / threshold);
    if (indexShift !== 0) {
      // Prevent continuous shifting by updating base position
      selectFeature(baseIndex + indexShift);
    }
  });

  track.addEventListener("pointerup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.releasePointerCapture(e.pointerId);
  });
}

// Setup initial cards positions
updateCardPositions();

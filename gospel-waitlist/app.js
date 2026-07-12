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
const logoText = document.getElementById("logo-text");
const heroTitle = document.getElementById("hero-title");

// Verify DOM elements exist
if (!titleEl) console.warn("feature-title element not found");
if (!descEl) console.warn("feature-desc element not found");
if (!pulseOverlay) console.warn("interaction-pulse element not found");
if (!logoText) console.warn("logo-text element not found");
if (!heroTitle) console.warn("hero-title element not found");

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
  if (!descEl) return;
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
  const nextIndex = ((index % FEATURES.length) + FEATURES.length) % FEATURES.length;
  if (nextIndex === activeIndex && titleEl && titleEl.textContent !== "") return;

  activeIndex = nextIndex;
  const targetFeature = FEATURES[activeIndex];

  clearExistingTransitions();

  // Transition Text Colors smoothly
  if (titleEl) {
    titleEl.style.opacity = 0;
    titleTimeout = setTimeout(() => {
      titleEl.textContent = targetFeature.title;
      titleEl.style.opacity = 1;
    }, 150);
  }

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
    if (card.vanillaTilt) {
      card.vanillaTilt.destroy();
    }
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
const prevBtn = document.getElementById("prev-btn");
if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    selectFeature(activeIndex - 1);
  });
}

const nextBtn = document.getElementById("next-btn");
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    selectFeature(activeIndex + 1);
  });
}

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

// Intersection Observer for Background Color Transition (Slow reveal)
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
      
      // Swap contrast classes
      logoText.classList.replace("text-white", "text-black");
      heroTitle.classList.replace("text-white", "text-black");
      titleEl.classList.replace("text-gold-light", "text-gold-dark");
      descEl.classList.replace("text-zinc-400", "text-zinc-600");
      
      document.querySelectorAll("#hero-section button").forEach(btn => {
        btn.classList.replace("border-zinc-800", "border-zinc-300");
        btn.classList.replace("text-zinc-400", "text-zinc-700");
      });
    } else {
      // Revert theme background to deep black
      bodyElement.style.backgroundColor = "#050505";
      bodyElement.style.color = "#FAFAF7";
      
      // Revert contrast classes
      logoText.classList.replace("text-black", "text-white");
      heroTitle.classList.replace("text-black", "text-white");
      titleEl.classList.replace("text-gold-dark", "text-gold-light");
      descEl.classList.replace("text-zinc-600", "text-zinc-400");
      
      document.querySelectorAll("#hero-section button").forEach(btn => {
        btn.classList.replace("border-zinc-300", "border-zinc-800");
        btn.classList.replace("text-zinc-700", "text-zinc-400");
      });
    }
  });
}, observerOptions);

observer.observe(visionSection);

// Waitlist Form Submission Mockup with Try-Catch Safety
const waitlistForm = document.getElementById("waitlist-form");
const submissionToast = document.getElementById("submission-toast");
let toastTimeout = null;

waitlistForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const fullName = document.getElementById("full-name").value;
  const email = document.getElementById("email").value;
  
  try {
    const waitlist = JSON.parse(localStorage.getItem("gospel_waitlist") || "[]");
    waitlist.push({ fullName, email, timestamp: new Date().toISOString() });
    localStorage.setItem("gospel_waitlist", JSON.stringify(waitlist));
  } catch (err) {
    console.warn("Storage write failed: Local storage is disabled or blocked in this environment.");
  }
  
  // Reset input fields
  waitlistForm.reset();
  
  // Show toast notification
  if (toastTimeout) clearTimeout(toastTimeout);
  submissionToast.classList.remove("hidden");
  toastTimeout = setTimeout(() => {
    submissionToast.classList.add("hidden");
  }, 5000);
});

// Setup Vanilla-Tilt for waitlist form card
if (window.VanillaTilt) {
  VanillaTilt.init(document.querySelector(".tilt-card"), {
    max: 8,
    speed: 400,
    glare: true,
    "max-glare": 0.15,
  });
}

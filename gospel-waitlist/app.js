/* ─── Gospel Waitlist — Carousel & Interactions ─────────────────────────────── */

const FEATURES = [
  { title: "A United Body",   desc: "Connecting believers across every nation, tribe, and denomination into one platform. Built on love, not division." },
  { title: "Spiritual Life",  desc: "Daily structured growth, Bible readings, and guided prayers powered by faith-aligned intelligence." },
  { title: "Job Openings",    desc: "Empowering prosperity. Match with Christian employers, projects, and missions seeking your talents." },
  { title: "Collaboration",   desc: "Launch joint church campaigns, charitable initiatives, and mission projects with unified tracking." },
  { title: "Team Gaming",     desc: "Play together in clean, team-based community competitions built for fellowship and interactive fun." },
  { title: "Developer Hub",   desc: "A hub for designers, engineers, and creators building open-source tools for the global church." }
];

const TOTAL = FEATURES.length;
let active = 0;

/* ─── DOM refs ───────────────────────────────────────────────────────────── */
const cards     = Array.from(document.querySelectorAll(".carousel-card"));
const titleEl   = document.getElementById("feature-title");
const descEl    = document.getElementById("feature-desc");
const prevBtn   = document.getElementById("prev-btn");
const nextBtn   = document.getElementById("next-btn");
const track     = document.getElementById("carousel-track");
const pulse     = document.getElementById("interaction-pulse");
const logoText  = document.getElementById("logo-text");
const heroTitle = document.getElementById("hero-title");
const heroSec   = document.getElementById("hero-section");

/* ─── Typewriter ─────────────────────────────────────────────────────────── */
let twInterval = null;

function typewrite(text) {
  if (!descEl) return;
  clearInterval(twInterval);
  descEl.textContent = "";
  let i = 0;
  twInterval = setInterval(() => {
    if (i < text.length) { descEl.textContent += text[i]; i++; }
    else { clearInterval(twInterval); twInterval = null; }
  }, 14);
}

/* ─── Position cards ─────────────────────────────────────────────────────── */
function layout() {
  const isMobile = window.innerWidth < 640;
  const gap = isMobile ? 100 : 180;          // px between card centers

  cards.forEach((card, i) => {
    // Shortest circular offset from active
    let off = i - active;
    if (off >  TOTAL / 2) off -= TOTAL;
    if (off < -TOTAL / 2) off += TOTAL;

    const isCenter = off === 0;
    const absOff   = Math.abs(off);

    // Position
    const tx    = off * gap;
    const sc    = isCenter ? 1.12 : Math.max(0.75, 1 - absOff * 0.15);
    const op    = absOff > 2 ? 0 : isCenter ? 1 : Math.max(0.25, 1 - absOff * 0.35);
    const z     = 100 - absOff * 10;

    card.style.transform = `translate(calc(-50% + ${tx}px), -50%) scale(${sc})`;
    card.style.opacity   = op;
    card.style.zIndex    = z;

    // Gold border on active
    if (isCenter) { card.classList.add("active"); }
    else          { card.classList.remove("active"); }
  });
}

/* ─── Go to card ─────────────────────────────────────────────────────────── */
function go(idx) {
  const next = ((idx % TOTAL) + TOTAL) % TOTAL;
  if (next === active && titleEl && titleEl.textContent !== "") return;
  active = next;

  // Update text
  if (titleEl) {
    titleEl.style.opacity = 0;
    setTimeout(() => {
      titleEl.textContent = FEATURES[active].title;
      titleEl.style.opacity = 1;
    }, 150);
  }
  typewrite(FEATURES[active].desc);

  // Gold pulse flash (dark mode only)
  if (pulse && document.body.style.backgroundColor !== "#FAFAF7") {
    pulse.style.opacity = 1;
    setTimeout(() => { pulse.style.opacity = 0; }, 250);
  }

  layout();
}

/* ─── Button navigation ──────────────────────────────────────────────────── */
if (prevBtn) prevBtn.addEventListener("click", () => { stopAuto(); go(active - 1); restartAuto(); });
if (nextBtn) nextBtn.addEventListener("click", () => { stopAuto(); go(active + 1); restartAuto(); });

/* ─── Touch / pointer swipe on track ─────────────────────────────────────── */
let dragging = false, startX = 0, dragBase = 0;

if (track) {
  track.style.touchAction = "pan-y";   // allow vertical scroll, capture horizontal

  track.addEventListener("pointerdown", e => {
    dragging = true; startX = e.clientX; dragBase = active;
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener("pointermove", e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const threshold = window.innerWidth < 640 ? 40 : 70;
    const shift = Math.round(-dx / threshold);
    const target = ((dragBase + shift) % TOTAL + TOTAL) % TOTAL;
    if (target !== active) { stopAuto(); go(target); }
  });
  track.addEventListener("pointerup", () => { dragging = false; restartAuto(); });
  track.addEventListener("pointercancel", () => { dragging = false; restartAuto(); });
}

/* ─── Card click (tap a side card to navigate to it) ─────────────────────── */
cards.forEach((card, i) => {
  card.addEventListener("click", () => {
    if (i !== active) { stopAuto(); go(i); restartAuto(); }
  });
  card.style.cursor = "pointer";
});

/* ─── Autoplay ───────────────────────────────────────────────────────────── */
let autoTimer = null;

function startAuto()   { if (autoTimer) return; autoTimer = setInterval(() => go(active + 1), 3500); }
function stopAuto()    { clearInterval(autoTimer); autoTimer = null; }
function restartAuto() { stopAuto(); setTimeout(startAuto, 2500); }

// Pause on hover (desktop)
if (heroSec) {
  heroSec.addEventListener("mouseenter", stopAuto);
  heroSec.addEventListener("mouseleave", startAuto);
}

/* ─── Kick-off ───────────────────────────────────────────────────────────── */
layout();
startAuto();

/* ─── Resize handler ─────────────────────────────────────────────────────── */
window.addEventListener("resize", layout);

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 2 & 3 — Scroll reveal + waitlist form
   ═══════════════════════════════════════════════════════════════════════════ */

const visionSection = document.getElementById("vision-section");

if (visionSection) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        visionSection.classList.remove("opacity-0", "translate-y-12");
        document.body.style.backgroundColor = "#FAFAF7";
        document.body.style.color = "#101010";
        logoText?.classList.replace("text-white", "text-black");
        heroTitle?.classList.replace("text-white", "text-black");
        titleEl?.classList.replace("text-gold-light", "text-gold-dark");
        descEl?.classList.replace("text-zinc-400", "text-zinc-600");
        document.querySelectorAll("#hero-section button").forEach(b => {
          b.classList.replace("border-zinc-800", "border-zinc-300");
          b.classList.replace("text-zinc-400", "text-zinc-700");
        });
      } else {
        document.body.style.backgroundColor = "#050505";
        document.body.style.color = "#FAFAF7";
        logoText?.classList.replace("text-black", "text-white");
        heroTitle?.classList.replace("text-black", "text-white");
        titleEl?.classList.replace("text-gold-dark", "text-gold-light");
        descEl?.classList.replace("text-zinc-600", "text-zinc-400");
        document.querySelectorAll("#hero-section button").forEach(b => {
          b.classList.replace("border-zinc-300", "border-zinc-800");
          b.classList.replace("text-zinc-700", "text-zinc-400");
        });
      }
    });
  }, { threshold: 0.35 });
  obs.observe(visionSection);
}

/* ─── Waitlist form ──────────────────────────────────────────────────────── */
const form = document.getElementById("waitlist-form");
const toast = document.getElementById("submission-toast");
let toastTimer = null;

if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const name  = document.getElementById("full-name")?.value || "";
    const email = document.getElementById("email")?.value || "";
    try {
      const list = JSON.parse(localStorage.getItem("gospel_waitlist") || "[]");
      list.push({ name, email, ts: new Date().toISOString() });
      localStorage.setItem("gospel_waitlist", JSON.stringify(list));
    } catch (_) { /* private browsing */ }
    form.reset();
    if (toast) {
      clearTimeout(toastTimer);
      toast.classList.remove("hidden");
      toastTimer = setTimeout(() => toast.classList.add("hidden"), 5000);
    }
  });
}

/* ─── Vanilla Tilt on form card ──────────────────────────────────────────── */
const tiltEl = document.querySelector(".tilt-card");
if (window.VanillaTilt && tiltEl) {
  VanillaTilt.init(tiltEl, { max: 8, speed: 400, glare: true, "max-glare": 0.15 });
}

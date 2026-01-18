/* script.js
   Vanilla JS for subtle interactions:
   - Daily random message on load
   - IntersectionObserver for reveal animations
   - Surprise dialog with floating hearts and typewriter reveal
*/

/* ---------------- Utility & Content ---------------- */
const dailyMessages = [
  "A gentle reminder: you're loved more deeply than the sky is wide.",
  "May today fold itself into a memory you'll return to with a smile.",
  "You are my favorite quiet, my steadiness and my soft adventure.",
  "I love the way you make ordinary things feel like home.",
  "For everything you are — thank you. Today and always."
];

const surpriseLines = [
  "I'm holding you in my thoughts right now.",
  "Remember: I'm here — within reach and in every heartbeat.",
  "Close your eyes. I'm there with you, steady and warm."
];

/* ---------------- Daily Happiness ---------------- */
function setDailyMessage() {
  // Choose a random message each load
  const el = document.getElementById('dailyHappy');
  if (!el) return;
  const idx = Math.floor(Math.random() * dailyMessages.length);
  el.textContent = dailyMessages[idx];
}

/* ---------------- Reveal on Scroll ---------------- */
function setupRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {threshold: 0.12});

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ---------------- Surprise Dialog ---------------- */
function openSurprise() {
  const dialog = document.getElementById('surpriseDialog');
  const textEl = document.getElementById('surpriseText');
  dialog.setAttribute('aria-hidden', 'false');

  // Pick a heartfelt line and reveal with a gentle typewriter effect
  const line = surpriseLines[Math.floor(Math.random() * surpriseLines.length)];
  typeWriter(textEl, line, 0);

  // generate a few floating hearts
  spawnHearts(8);
}

function closeSurprise() {
  const dialog = document.getElementById('surpriseDialog');
  dialog.setAttribute('aria-hidden', 'true');
  // clear hearts
  const field = document.getElementById('heartField');
  field.innerHTML = '';
}

/* Typewriter effect (gentle) */
function typeWriter(el, text, i) {
  el.textContent = text.slice(0, i);
  if (i < text.length) {
    setTimeout(() => typeWriter(el, text, i + 1), 24);
  }
}

/* Floating hearts generator */
function spawnHearts(n = 6) {
  const field = document.getElementById('heartField');
  if (!field) return;

  for (let i = 0; i < n; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    // style heart
    const size = 12 + Math.random() * 26;
    heart.style.position = 'absolute';
    heart.style.left = `${10 + Math.random() * 80}%`;
    heart.style.bottom = `-20px`;
    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent 30%), linear-gradient(180deg, ${getRandomColor()}, ${getRandomColor(0.6)})`;
    heart.style.transform = `rotate(${Math.random() * 30 - 10}deg)`;
    heart.style.borderRadius = '6px 6px 10px 10px';
    heart.style.opacity = '0.98';
    heart.style.pointerEvents = 'none';
    heart.style.transition = `transform 2200ms cubic-bezier(.2,.9,.25,1), opacity 1600ms ease`;
    field.appendChild(heart);

    // animate
    requestAnimationFrame(() => {
      const horiz = (Math.random() - 0.5) * 30;
      heart.style.transform = `translate(${horiz}px, -140px) rotate(${Math.random() * 30 - 15}deg)`;
      heart.style.opacity = '0.12';
    });

    // remove after animation
    setTimeout(() => {
      heart.remove();
    }, 2400 + Math.random() * 800);
  }
}

function getRandomColor(alpha=1) {
  // soft palette between the two accents
  const colors = [
    `rgba(232,159,191,${alpha})`,
    `rgba(184,159,230,${alpha})`,
    `rgba(255,195,220,${alpha})`
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/* ---------------- Event Bindings ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  setDailyMessage();
  setupRevealObserver();

  // Surprise dialog buttons
  const surpriseBtn = document.getElementById('surpriseBtn');
  const closeBtns = [document.getElementById('closeSurprise'), document.getElementById('closeBtn')];
  const sendKiss = document.getElementById('sendKiss');

  if (surpriseBtn) surpriseBtn.addEventListener('click', openSurprise);
  closeBtns.forEach(b => b && b.addEventListener('click', closeSurprise));

  // small animation for sendKiss that spawns hearts
  if (sendKiss) {
    sendKiss.addEventListener('click', () => {
      spawnHearts(16);
      // gentle feedback
      sendKiss.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.06)' },
        { transform: 'scale(1)' }
      ], { duration: 260, easing: 'ease-out' });
    });
  }

  // Close dialog on Escape
  document.addEventListener('keydown', (e) => {
    const dialog = document.getElementById('surpriseDialog');
    if (!dialog) return;
    if (e.key === 'Escape' && dialog.getAttribute('aria-hidden') === 'false') {
      closeSurprise();
    }
  });

  // Click outside to close
  document.getElementById('surpriseDialog')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeSurprise();
  });
});
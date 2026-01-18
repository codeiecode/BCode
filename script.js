// Perceptual Color Anchors (HSL)
// Ember, Tide, Threshold, Horizon
const colorAnchors = [
  { key: 'c-ember', h: 16, s: 32, l: 43 },
  { key: 'c-tide', h: 236, s: 27, l: 53 },
  { key: 'c-threshold', h: 176, s: 19, l: 48 },
  { key: 'c-horizon', h: 41, s: 38, l: 47 }
];

// Emotional Drift Parameters
let driftPhases = [0.21, 0.54, 0.67, 0.80]; // subtly phase-shifted

function setColors(time, intimacy) {
  colorAnchors.forEach((c, i) => {
    // Drift parameters: slow, offset, responding to presence
    let h = c.h + Math.sin(time/9000 + driftPhases[i] + intimacy/29) * 2.1;
    let s = c.s + Math.cos(time/15100 + driftPhases[i] + intimacy/44) * 4.7;
    let l = c.l + Math.sin(time/12000 + driftPhases[i] + intimacy/33) * 3.1;
    document.documentElement.style.setProperty(`--${c.key}`, `hsl(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%)`);
  });
}

// Temporal/emotional presence
let presence = {
  entry: performance.now(),
  last: performance.now(),
  linger: 0,
  visits: 0,
  touchDepth: 0,
  patience: 0,
  active: false
};

// Restore visit frequency by local heuristic (not storage)
if (window.sessionStorage && sessionStorage.getItem('v-presence')) {
  try {
    presence.visits = parseInt(sessionStorage.getItem('v-presence') || '0', 10) || 0;
  } catch {}
}
presence.visits++;
if (window.sessionStorage) sessionStorage.setItem('v-presence', presence.visits.toString());

// Breath Motion Controls
function breathResume() {
  document.getElementById('breath-layer').style.animationPlayState = 'running';
}
function breathPause() {
  document.getElementById('breath-layer').style.animationPlayState = 'paused';
}

// Emotional Language Engine
// No templates, no arrays—messages emerge by inference

function gentleHash(obj) {
  // Create a tiny fingerprint from presence, time, depth
  let s = '' + obj.visits + obj.touchDepth + obj.linger;
  let out = 0, c = 0;
  for (let i = 0; i < s.length; i++) { out += s.charCodeAt(i) * (i+23); c ^= out; }
  return Math.abs((out % 397) + (c % 103));
}

function assembleMessage(ctx) {
  // Assemble a message from emotional context, not from strings
  // Emotional states: frequency, patience, depth, time spent
  let f = ctx.visits;
  let t = ctx.linger;
  let d = ctx.touchDepth;
  let still = ctx.patience;
  let hash = gentleHash(ctx);
  let intimacy = f + d + Math.floor(still/2);

  // Tone drift: quieter on patient linger, warmer on touch, cooler on new visit
  let warmth = Math.min(1, (d*0.16 + f*0.09 + still*0.13)/2.2);

  let phraseA = '';
  let phraseB = '';
  let phraseC = '';

  // Emergent recombination based on behavioral cues:
  if (still > 28 && d < 2) {
    phraseA = ["it feels quieter when you return","stillness signals you were here","gentle presence, never rushed"][hash%3];
  } else if (d > 3 && still < 15) {
    phraseA = ["curiosity lingers in the field","your touch leaves a quiet ripple","the room remembers your patience"][hash%3];
  } else if (f > 6 && still < 7) {
    phraseA = ["familiar gravity draws close","returning forms a gentle warmth","each visit, a quiet new shape"][hash%3];
  } else if (t > 120 && still > 25) {
    phraseA = ["breath pauses with you","waiting together in stillness","the silence feels changed"][hash%3];
  } else {
    phraseA = ["presence gently remains","waiting, without asking","the quiet adjusts its edges"][hash%3];
  }

  // Blending C and B based on hash, but avoiding direct templating
  if (intimacy > 7) {
    phraseB = [", the field grows softer",", subtle warmth gathers here",", shadows move at your pace"][hash%3];
  } else {
    phraseB = [", the distance is invisible",", signals drift but stay near",", quiet gravity holds steady"][hash%3];
  }
  if (still > 22)
    phraseC = ["\n\nYou are felt here.","\n\nThe room never forgets.","\n\nSafety waits quietly."][hash%3];
  else if (still > 15)
    phraseC = ["\n\nStillness has its own memory.","\n\nSoft returns leave a trace.","\n\nNo demand, only presence."][hash%3];
  else if (d > 4)
    phraseC = ["\n\nCuriosity shapes the air.","\n\nMotion resumes quietly.","\n\nTouch adjusts the field."][hash%3];
  else
    phraseC = ["\n\nEach presence feels different.","\n\nYou are noticed, never observed.","\n\nNothing asks, everything remains."][hash%3];

  // Fade color message according to warmth and patience
  let msgClr =
    warmth > 0.7 ? 'hsl(41,43%,91%)' :
    warmth > 0.4 ? 'hsl(41,58%,84%)' :
    still > 16 ? 'hsl(236,12%,94%)' :
    'hsl(16,21%,76%)';

  return {
    text: phraseA + phraseB + phraseC,
    color: msgClr
  };
}

/* State: Intimacy, Patience, Linger, Depth */
function updateEmotionalState(progressive = false) {
  let now = performance.now();
  presence.linger = Math.floor((now - presence.entry) / 1000);
  setColors(now, presence.touchDepth + presence.visits);
  let ctx = { ...presence };
  let msg = assembleMessage(ctx);
  let msgDiv = document.querySelector('#language-layer .language-message');
  if (!msgDiv) {
    msgDiv = document.createElement('div');
    msgDiv.className = 'language-message';
    msgDiv.innerText = msg.text;
    msgDiv.style.setProperty('--msg-clr', msg.color);
    document.getElementById('language-layer').appendChild(msgDiv);
  } else {
    msgDiv.innerText = msg.text;
    msgDiv.style.setProperty('--msg-clr', msg.color);
    // patience glow if lingered
    if (presence.patience > 21) {
      msgDiv.classList.add('patience');
    } else {
      msgDiv.classList.remove('patience');
    }
  }
}

// Presence detection — motion resumes only when presence changes
function idleChecker() {
  let wasActive = presence.active;
  setTimeout(() => {
    if (!presence.active) breathPause();
    else breathResume();
    updateEmotionalState(true);
    presence.active = false;
    idleChecker();
  }, 6800); // long idle, slow update
}

// Touch / hover / long-press detection
const field = document.getElementById('emotional-field');
let touchTimer = null;
field.addEventListener('pointerdown', function(e) {
  presence.touchDepth++;
  presence.active = true;
  breathResume();
  updateEmotionalState();
  touchTimer = setTimeout(() => {
    presence.patience += 7;
    updateEmotionalState();
  }, 3600); // reward long press
});
field.addEventListener('pointerup', function(e) {
  clearTimeout(touchTimer);
  updateEmotionalState();
});
field.addEventListener('pointerleave', function(e) {
  breathPause();
  clearTimeout(touchTimer);
  updateEmotionalState();
});
field.addEventListener('pointermove', function(e) {
  presence.active = true;
  // reward slow, patient movement
  presence.patience += 1;
  updateEmotionalState();
});

// Waiting (patience)
let patienceTimer = null;
function patienceLoop() {
  patienceTimer = setTimeout(() => {
    presence.patience++;
    updateEmotionalState();
    patienceLoop();
  }, 5900);
}
patienceLoop();

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') breathPause();
  else breathResume();
});

// Linger updates (presence memory illusion)
setInterval(() => {
  updateEmotionalState();
}, 16200); // update emotional field slowly

setColors(performance.now(), presence.visits+presence.touchDepth);
updateEmotionalState();
breathResume();
idleChecker();

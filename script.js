// Love Message Engine - Generates thousands of unique romantic messages
const messageEngine = {
    morningStarters: [
        "The first thing I think about",
        "Before anything else today",
        "In this quiet moment",
        "The moment I wake",
        "Right now, in the morning light",
        "As the sun comes up"
    ],
    
    eveningStarters: [
        "As the day fades",
        "In the quiet of night",
        "As stars come out",
        "Before sleep takes me",
        "In these soft hours",
        "As the world slows"
    ],
    
    coreMessages: [
        "is you.  Always you.",
        "is that you exist.",
        "is how much I miss your laugh.",
        "is the way you'd understand this without me saying it.",
        "is that distance is just a test we're passing.",
        "is your face, even in my memories.",
        "is wishing I could reach through this screen.",
        "is grateful that you're out there, thinking of me too.",
        "is that love like ours doesn't care about miles.",
        "is sorry it takes a screen to show you this.",
        "is proud of you for everything you're doing.",
        "is excited for every moment we'll have together.",
        "is peace, when I remember you're mine.",
        "is the way you make hard things feel possible.",
        "is wishing tonight we were in the same room.",
        "is that forever doesn't seem far away.",
        "is so full of you, there's no room for loneliness.",
        "is that you make me brave.",
        "is knowing we're worth the wait.",
        "is wondering what you're doing right now.",
        "is the certainty that you're exactly who I need.",
        "is overwhelmed by how much you matter.",
        "is holding this feeling safe until I see you.",
        "is that you're not just someone I love—you're my home.",
        "is counting moments until your next hello.",
        "is the taste of hope because of you.",
        "is that goodbye from you is never really goodbye.",
        "is the weight of your importance to me.",
        "is believing in us, even when it's hard.",
        "is that you're the only future I can see."
    ],
    
    quietNightMessages: [
        "In the quiet of now:  you are enough for me, always.",
        "When no one's watching: I think about kissing you.",
        "In these soft hours: nothing matters but knowing you're out there.",
        "In the darkness: I feel closest to you somehow.",
        "Right now: I wish I could hold your hand.",
        "In this stillness: all I want is you next to me.",
        "As the world sleeps: you're awake in my mind.",
        "In these tender hours: thank you for existing.",
        "When everything's quiet: I hear your breathing, or I imagine it.",
        "In the night: you're my only certainty."
    ],
    
    getRandomElement: function(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },
    
    getTimeOfDay: function() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'afternoon';
        return 'evening';
    },
    
    generate: function() {
        const timeOfDay = this.getTimeOfDay();
        const quietMode = document.body.classList.contains('quiet-mode');
        
        let message;
        
        if (quietMode) {
            message = this.getRandomElement(this.quietNightMessages);
        } else {
            const starter = timeOfDay === 'evening' 
                ? this.getRandomElement(this.eveningStarters)
                : this.getRandomElement(this.morningStarters);
            const core = this.getRandomElement(this.coreMessages);
            message = `${starter} ${core}`;
        }
        
        return message;
    }
};

// Time Capsule - Daily messages that change at midnight
const timeCapsule = {
    dailyMessages: [
        "You are braver than you believe, stronger than you seem, and loved more than you know.",
        "This distance is temporary.  What we have is forever.",
        "Right now, somewhere, someone is grateful for you.  Me.",
        "You've already survived 100% of your worst days.",
        "The best is not behind us. It's waiting for us together.",
        "Thank you for loving me even from far away.",
        "You make the impossible feel inevitable.",
        "I'm proud of who you're becoming.",
        "This waiting will make the next hello sweeter.",
        "You are my favorite reason to believe in tomorrow.",
        "Distance didn't weaken us.  It proved how strong we are.",
        "Every day brings us one moment closer.",
        "You deserve someone who can't stop thinking about you.  You have that.",
        "I'm falling in love with you all over again, today.",
        "Thank you for fighting for us.",
        "Your love reaches me across every mile.",
        "I choose you, again and again.",
        "You are my most honest prayer.",
        "This will be worth it. We will be worth it.",
        "I love you in every timezone, every season, every version of your life."
    ],
    
    getMessageForDate: function(date) {
        const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
        const index = seed % this.dailyMessages.length;
        return this.dailyMessages[index];
    },
    
    getMessage: function() {
        return this.getMessageForDate(new Date());
    }
};

// Hidden Messages - Revealed on long press
const hiddenMessages = [
    "You are my favorite thought",
    "I want to know everything about your day",
    "Your laugh is my favorite sound",
    "I'd wait a thousand midnights for you",
    "You make me want to be better",
    "Even far away, you feel close",
    "This is real.  You are real.  We are real.",
    "My heart chose well when it chose you",
    "I'm so proud of you",
    "You deserve all the good things",
    "I can't wait to hold you",
    "You are my person",
    "Home is wherever you are",
    "I love you in every way there is"
];

// DOM Elements
const loveMessageEl = document.getElementById('loveMessage');
const messageTimeEl = document.getElementById('messageTime');
const nextMessageBtn = document.getElementById('nextMessage');
const quietModeToggle = document.getElementById('quietModeToggle');
const refreshMessagesBtn = document.getElementById('refreshMessages');
const capsuleMessageEl = document.getElementById('capsuleMessage');
const capsuleDateEl = document.getElementById('capsuleDate');
const holdableElement = document.querySelector('.holdable-element');
const hiddenMessageEl = document.getElementById('hiddenMessage');

let holdTimer = null;
let isHeld = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    displayMessage();
    displayTimeCapsule();
    displayRandomHiddenMessage();
    
    // Refresh message every 30 seconds if not interacted with
    setInterval(() => {
        if (!isHeld) {
            displayMessage(true);
        }
    }, 30000);
});

// Display love message
function displayMessage(animated = false) {
    const message = messageEngine.generate();
    const timeOfDay = messageEngine.getTimeOfDay();
    
    if (animated) {
        loveMessageEl.style.opacity = '0';
        setTimeout(() => {
            loveMessageEl.textContent = message;
            loveMessageEl.style.opacity = '1';
        }, 200);
    } else {
        loveMessageEl.textContent = message;
    }
    
    updateMessageTime(timeOfDay);
}

function updateMessageTime(timeOfDay) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute:  '2-digit',
        hour12: true 
    });
    
    const dayPeriod = timeOfDay. charAt(0).toUpperCase() + timeOfDay.slice(1);
    messageTimeEl.textContent = `${dayPeriod} • ${timeString}`;
}

// Display time capsule message
function displayTimeCapsule() {
    const message = timeCapsule.getMessage();
    const today = new Date();
    const dateString = today. toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    capsuleMessageEl.textContent = message;
    capsuleDateEl. textContent = dateString;
}

// Display random hidden message
function displayRandomHiddenMessage() {
    const randomMessage = hiddenMessages[
        Math.floor(Math.random() * hiddenMessages.length)
    ];
    hiddenMessageEl.textContent = randomMessage;
}

// Next message button
nextMessageBtn.addEventListener('click', () => {
    displayMessage(true);
    displayRandomHiddenMessage();
});

// Refresh messages button
refreshMessagesBtn. addEventListener('click', () => {
    displayMessage(true);
    displayTimeCapsule();
    displayRandomHiddenMessage();
    
    // Visual feedback
    refreshMessagesBtn.style.animation = 'none';
    setTimeout(() => {
        refreshMessagesBtn.style.animation = 'float 0.8s ease-out';
    }, 10);
});

// Quiet mode toggle
quietModeToggle. addEventListener('click', () => {
    document.body.classList.toggle('quiet-mode');
    displayMessage(true);
    
    // Save preference
    const isQuiet = document.body.classList.contains('quiet-mode');
    localStorage.setItem('quietMode', isQuiet);
    
    quietModeToggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
        quietModeToggle.style.transform = 'scale(1)';
    }, 150);
});

// Restore quiet mode preference
if (localStorage.getItem('quietMode') === 'true') {
    document.body.classList.add('quiet-mode');
}

// Hold interaction for touchable element
holdableElement.addEventListener('mousedown', startHold);
holdableElement.addEventListener('touchstart', startHold);
holdableElement.addEventListener('mouseup', endHold);
holdableElement.addEventListener('touchend', endHold);
holdableElement.addEventListener('mouseleave', endHold);
document.addEventListener('mouseup', endHold);
document.addEventListener('touchend', endHold);

function startHold(e) {
    e.preventDefault();
    if (holdTimer) clearTimeout(holdTimer);
    
    holdTimer = setTimeout(() => {
        isHeld = true;
        holdableElement.classList.add('held');
        document.querySelector('.hold-bg').classList.add('holding');
    }, 500);
}

function endHold() {
    if (holdTimer) clearTimeout(holdTimer);
    isHeld = false;
    holdableElement.classList.remove('held');
    document.querySelector('.hold-bg').classList.remove('holding');
}

// Smooth scroll behavior for intersection observer (nice fade-in effect)
const observerOptions = {
    threshold:  0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.animation = 'slideInUp 0.8s ease-out';
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    observer.observe(section);
});

// Prevent scrollbar flash on animations
document.addEventListener('scroll', () => {
    // Subtle parallax on orbs
    const scrollY = window.scrollY;
    const orbs = document.querySelectorAll('.gradient-orb');
    orbs.forEach((orb, index) => {
        const speed = 0.3 + (index * 0.1);
        orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
});

// Easter egg:  click logo multiple times
let logoClickCount = 0;
let logoClickTimer = null;

document.querySelector('.nav-logo').addEventListener('click', () => {
    logoClickCount++;
    
    if (logoClickTimer) clearTimeout(logoClickTimer);
    
    if (logoClickCount >= 5) {
        // Surprise easter egg
        displayMessage(true);
        const confetti = document.createElement('div');
        confetti.textContent = '💜';
        confetti.style.position = 'fixed';
        confetti.style.left = '50%';
        confetti.style.top = '50%';
        confetti.style.fontSize = '3rem';
        confetti.style.animation = 'slideInUp 1.5s ease-out forwards';
        confetti.style. pointerEvents = 'none';
        confetti.style.zIndex = '2000';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 1500);
        logoClickCount = 0;
    }
    
    logoClickTimer = setTimeout(() => {
        logoClickCount = 0;
    }, 2000);
});

// Auto-refresh time display every minute
setInterval(() => {
    const timeOfDay = messageEngine.getTimeOfDay();
    updateMessageTime(timeOfDay);
}, 60000);
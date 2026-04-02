// === Twin Stars Gaming World - Main App ===

let currentGame = null;
let currentPlayer = 1;

// Initialize audio context on first user interaction
document.addEventListener('click', () => SoundEngine.resume(), { once: true });
document.addEventListener('touchstart', () => SoundEngine.resume(), { once: true });

// === Screen Management ===
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) screen.classList.add('active');
}

function startGame(game) {
    SoundEngine.click();

    // Cleanup previous game
    if (currentGame === 'bubble-pop') {
        BubblePopGame.cleanup();
    }

    currentGame = game;

    switch (game) {
        case 'color-match':
            showScreen('color-match-screen');
            ColorMatchGame.init();
            break;
        case 'animal-sounds':
            showScreen('animal-sounds-screen');
            AnimalSoundsGame.init();
            break;
        case 'shape-sort':
            showScreen('shape-sort-screen');
            ShapeSortGame.init();
            break;
        case 'bubble-pop':
            showScreen('bubble-pop-screen');
            BubblePopGame.init();
            break;
        case 'memory':
            showScreen('memory-screen');
            MemoryGame.init();
            break;
        case 'counting':
            showScreen('counting-screen');
            CountingGame.init();
            break;
    }
}

function goHome() {
    SoundEngine.click();
    if (currentGame === 'bubble-pop') {
        BubblePopGame.cleanup();
    }
    currentGame = null;
    showScreen('main-menu');
}

// === Player Selection ===
function selectPlayer(num) {
    currentPlayer = num;
    SoundEngine.click();
    document.querySelectorAll('.player-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.star-${num}`).classList.add('active');
}

// === Confetti Effect ===
function spawnConfetti() {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6BD6', '#FFA07A'];
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = '-10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = `${5 + Math.random() * 10}px`;
        confetti.style.height = `${5 + Math.random() * 10}px`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 2500);
    }
}

// === Celebration Overlay ===
function showCelebration(message) {
    const overlay = document.getElementById('celebration-overlay');
    const texts = ['Amazing!', 'Super Star!', 'Wonderful!', 'Fantastic!', 'You Rock!', 'Brilliant!'];
    const emojis = ['🎉', '🌟', '🏆', '💫', '🎊', '👑', '🦄'];

    overlay.querySelector('.celebration-text').textContent = message || texts[Math.floor(Math.random() * texts.length)];
    overlay.querySelector('.celebration-emoji').textContent = emojis[Math.floor(Math.random() * emojis.length)];
    overlay.classList.remove('hidden');

    SoundEngine.celebrate();
    spawnConfetti();

    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 2000);

    // Dismiss on tap
    overlay.onclick = () => overlay.classList.add('hidden');
}

// === Prevent accidental page navigation ===
window.addEventListener('beforeunload', (e) => {
    if (currentGame) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// === Keyboard shortcut to go home (Escape) ===
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentGame) {
        goHome();
    }
});

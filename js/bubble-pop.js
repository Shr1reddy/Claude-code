const BubblePopGame = {
    score: 0,
    spawnInterval: null,
    bubbleColors: [
        'radial-gradient(circle at 30% 30%, rgba(255,150,150,0.9), rgba(255,50,50,0.3))',
        'radial-gradient(circle at 30% 30%, rgba(150,150,255,0.9), rgba(50,50,255,0.3))',
        'radial-gradient(circle at 30% 30%, rgba(150,255,150,0.9), rgba(50,200,50,0.3))',
        'radial-gradient(circle at 30% 30%, rgba(255,255,150,0.9), rgba(255,200,50,0.3))',
        'radial-gradient(circle at 30% 30%, rgba(255,150,255,0.9), rgba(200,50,200,0.3))',
        'radial-gradient(circle at 30% 30%, rgba(150,255,255,0.9), rgba(50,200,200,0.3))',
    ],

    init() {
        this.score = 0;
        document.getElementById('bubble-score').textContent = '0';
        const area = document.getElementById('bubble-game-area');
        area.innerHTML = '';
        this.startSpawning();
    },

    startSpawning() {
        this.stopSpawning();
        this.spawnBubble();
        this.spawnInterval = setInterval(() => this.spawnBubble(), 800);
    },

    stopSpawning() {
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
    },

    spawnBubble() {
        const area = document.getElementById('bubble-game-area');
        if (!area || !document.getElementById('bubble-pop-screen').classList.contains('active')) {
            this.stopSpawning();
            return;
        }

        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        const size = 50 + Math.random() * 60;
        const left = Math.random() * (area.clientWidth - size);
        const duration = 4 + Math.random() * 4;

        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}px`;
        bubble.style.bottom = '-80px';
        bubble.style.background = this.bubbleColors[Math.floor(Math.random() * this.bubbleColors.length)];
        bubble.style.animationDuration = `${duration}s`;

        // Add emoji inside some bubbles
        const emojis = ['🌟', '💖', '🦋', '🌈', '🎀', '🍭', '🧸', ''];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        if (emoji) {
            bubble.innerHTML = `<span style="font-size:${size * 0.4}px;display:flex;align-items:center;justify-content:center;height:100%">${emoji}</span>`;
        }

        bubble.addEventListener('click', (e) => {
            e.stopPropagation();
            this.popBubble(bubble);
        });

        area.appendChild(bubble);

        // Remove bubble when animation ends
        setTimeout(() => {
            if (bubble.parentNode) bubble.remove();
        }, duration * 1000);
    },

    popBubble(bubble) {
        if (bubble.classList.contains('bubble-popping')) return;
        bubble.classList.add('bubble-popping');
        SoundEngine.pop();
        this.score++;
        document.getElementById('bubble-score').textContent = this.score;

        if (this.score % 10 === 0) {
            spawnConfetti();
            SoundEngine.celebrate();
        }

        setTimeout(() => bubble.remove(), 300);
    },

    cleanup() {
        this.stopSpawning();
    }
};

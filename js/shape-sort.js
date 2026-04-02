const ShapeSortGame = {
    shapes: [
        { name: 'circle', svg: (c) => `<svg width="90" height="90"><circle cx="45" cy="45" r="40" fill="${c}" stroke="white" stroke-width="3"/></svg>` },
        { name: 'square', svg: (c) => `<svg width="90" height="90"><rect x="5" y="5" width="80" height="80" rx="5" fill="${c}" stroke="white" stroke-width="3"/></svg>` },
        { name: 'triangle', svg: (c) => `<svg width="90" height="90"><polygon points="45,5 85,85 5,85" fill="${c}" stroke="white" stroke-width="3"/></svg>` },
        { name: 'star', svg: (c) => `<svg width="90" height="90"><polygon points="45,5 55,35 85,35 60,55 70,85 45,65 20,85 30,55 5,35 35,35" fill="${c}" stroke="white" stroke-width="3"/></svg>` },
        { name: 'heart', svg: (c) => `<svg width="90" height="90"><path d="M45 80 C15 55 0 35 15 20 C25 10 40 15 45 30 C50 15 65 10 75 20 C90 35 75 55 45 80Z" fill="${c}" stroke="white" stroke-width="3"/></svg>` },
        { name: 'diamond', svg: (c) => `<svg width="90" height="90"><polygon points="45,5 85,45 45,85 5,45" fill="${c}" stroke="white" stroke-width="3"/></svg>` },
    ],
    shapeColors: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6BD6'],
    score: 0,
    targetShape: null,

    init() {
        this.score = 0;
        document.getElementById('shape-score').textContent = '0';
        this.newRound();
    },

    newRound() {
        const area = document.getElementById('shape-game-area');
        const target = document.getElementById('shape-target');
        area.innerHTML = '';
        target.innerHTML = '';

        // Pick 4 shapes
        const shuffled = [...this.shapes].sort(() => Math.random() - 0.5);
        const chosen = shuffled.slice(0, 4);
        const colors = [...this.shapeColors].sort(() => Math.random() - 0.5);

        // Pick target
        this.targetShape = chosen[Math.floor(Math.random() * chosen.length)];

        // Show target shape
        const targetDiv = document.createElement('div');
        targetDiv.className = 'target-shape';
        targetDiv.innerHTML = this.targetShape.svg('#FFD700');
        targetDiv.querySelector('svg').style.width = '80px';
        targetDiv.querySelector('svg').style.height = '80px';
        targetDiv.style.animation = 'pulse 1.5s ease-in-out infinite';
        target.appendChild(targetDiv);

        // Create choices with different colors
        chosen.sort(() => Math.random() - 0.5).forEach((shape, i) => {
            const item = document.createElement('div');
            item.className = 'shape-item';
            item.innerHTML = shape.svg(colors[i]);
            item.style.animation = `popIn 0.4s ease-out ${i * 0.1}s backwards`;
            item.addEventListener('click', () => this.checkAnswer(shape, item));
            area.appendChild(item);
        });
    },

    checkAnswer(shape, element) {
        if (shape.name === this.targetShape.name) {
            this.score++;
            document.getElementById('shape-score').textContent = this.score;
            element.classList.add('correct-flash');
            SoundEngine.correct();
            spawnConfetti();

            if (this.score % 5 === 0) {
                showCelebration();
            }

            setTimeout(() => this.newRound(), 800);
        } else {
            element.classList.add('wrong-shake');
            SoundEngine.wrong();
            setTimeout(() => element.classList.remove('wrong-shake'), 400);
        }
    }
};

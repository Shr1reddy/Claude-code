const ColorMatchGame = {
    colors: [
        { name: 'RED', hex: '#FF4444' },
        { name: 'BLUE', hex: '#4488FF' },
        { name: 'GREEN', hex: '#44CC44' },
        { name: 'YELLOW', hex: '#FFDD44' },
        { name: 'PURPLE', hex: '#AA44FF' },
        { name: 'ORANGE', hex: '#FF8844' },
        { name: 'PINK', hex: '#FF77AA' },
    ],
    score: 0,
    targetColor: null,

    init() {
        this.score = 0;
        document.getElementById('color-score').textContent = '0';
        this.newRound();
    },

    newRound() {
        const area = document.getElementById('color-game-area');
        area.innerHTML = '';

        // Pick 4 random colors
        const shuffled = [...this.colors].sort(() => Math.random() - 0.5);
        const chosen = shuffled.slice(0, 4);

        // Pick target
        this.targetColor = chosen[Math.floor(Math.random() * chosen.length)];
        const nameSpan = document.getElementById('target-color-name');
        nameSpan.textContent = this.targetColor.name;
        nameSpan.style.color = this.targetColor.hex;

        // Create circles
        chosen.sort(() => Math.random() - 0.5).forEach((color, i) => {
            const circle = document.createElement('div');
            circle.className = 'color-circle';
            circle.style.backgroundColor = color.hex;
            circle.style.animationDelay = `${i * 0.1}s`;
            circle.style.animation = `popIn 0.4s ease-out ${i * 0.1}s backwards`;
            circle.addEventListener('click', () => this.checkAnswer(color, circle));
            area.appendChild(circle);
        });
    },

    checkAnswer(color, element) {
        if (color.name === this.targetColor.name) {
            this.score++;
            document.getElementById('color-score').textContent = this.score;
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

const CountingGame = {
    items: ['🍎', '🌟', '🦋', '🌺', '🍪', '🎈', '🐝', '🍓', '🌻', '🐠'],
    score: 0,
    correctCount: 0,

    init() {
        this.score = 0;
        document.getElementById('counting-score').textContent = '0';
        this.newRound();
    },

    newRound() {
        const display = document.getElementById('counting-display');
        const choices = document.getElementById('counting-choices');
        display.innerHTML = '';
        choices.innerHTML = '';

        // Pick random item and count (1-5 for 4-year-olds)
        const item = this.items[Math.floor(Math.random() * this.items.length)];
        this.correctCount = 1 + Math.floor(Math.random() * 5);

        document.getElementById('counting-item').textContent = item;

        // Show items with staggered animation
        for (let i = 0; i < this.correctCount; i++) {
            const obj = document.createElement('span');
            obj.className = 'counting-obj';
            obj.textContent = item;
            obj.style.animationDelay = `${i * 0.15}s`;
            display.appendChild(obj);
        }

        // Generate answer choices (always include correct answer)
        const answers = new Set([this.correctCount]);
        while (answers.size < 4) {
            const num = 1 + Math.floor(Math.random() * 5);
            answers.add(num);
        }

        // Shuffle and create buttons
        [...answers].sort(() => Math.random() - 0.5).forEach((num, i) => {
            const btn = document.createElement('button');
            btn.className = 'count-btn';
            btn.textContent = num;
            btn.style.animation = `popIn 0.3s ease-out ${i * 0.1}s backwards`;
            btn.addEventListener('click', () => this.checkAnswer(num, btn));
            choices.appendChild(btn);
        });
    },

    checkAnswer(num, element) {
        if (num === this.correctCount) {
            this.score++;
            document.getElementById('counting-score').textContent = this.score;
            element.classList.add('correct-flash');
            element.style.background = 'rgba(76,175,80,0.5)';
            SoundEngine.correct();
            spawnConfetti();

            if (this.score % 5 === 0) {
                showCelebration();
            }

            setTimeout(() => this.newRound(), 800);
        } else {
            element.classList.add('wrong-shake');
            element.style.background = 'rgba(255,50,50,0.3)';
            SoundEngine.wrong();
            setTimeout(() => {
                element.classList.remove('wrong-shake');
                element.style.background = '';
            }, 400);
        }
    }
};

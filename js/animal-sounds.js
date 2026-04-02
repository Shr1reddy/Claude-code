const AnimalSoundsGame = {
    animals: [
        { name: 'cow', emoji: '🐄', sound: 'Moo' },
        { name: 'cat', emoji: '🐱', sound: 'Meow' },
        { name: 'dog', emoji: '🐶', sound: 'Woof' },
        { name: 'duck', emoji: '🦆', sound: 'Quack' },
        { name: 'pig', emoji: '🐷', sound: 'Oink' },
        { name: 'sheep', emoji: '🐑', sound: 'Baa' },
    ],
    score: 0,
    targetAnimal: null,

    init() {
        this.score = 0;
        document.getElementById('animal-score').textContent = '0';
        this.newRound();
    },

    newRound() {
        const area = document.getElementById('animal-game-area');
        area.innerHTML = '';

        // Pick 4 random animals
        const shuffled = [...this.animals].sort(() => Math.random() - 0.5);
        const chosen = shuffled.slice(0, 4);

        // Pick target
        this.targetAnimal = chosen[Math.floor(Math.random() * chosen.length)];
        document.getElementById('animal-sound-text').textContent = `"${this.targetAnimal.sound}"`;

        // Play the sound
        setTimeout(() => SoundEngine.animalSound(this.targetAnimal.name), 300);

        // Create buttons
        chosen.sort(() => Math.random() - 0.5).forEach((animal, i) => {
            const btn = document.createElement('button');
            btn.className = 'animal-btn';
            btn.style.animation = `popIn 0.4s ease-out ${i * 0.1}s backwards`;
            btn.innerHTML = `<span class="card-face">${animal.emoji}</span>`;
            btn.addEventListener('click', () => this.checkAnswer(animal, btn));
            area.appendChild(btn);
        });
    },

    checkAnswer(animal, element) {
        if (animal.name === this.targetAnimal.name) {
            this.score++;
            document.getElementById('animal-score').textContent = this.score;
            element.classList.add('correct-flash');
            SoundEngine.correct();
            SoundEngine.animalSound(animal.name);
            spawnConfetti();

            if (this.score % 5 === 0) {
                showCelebration();
            }

            setTimeout(() => this.newRound(), 1000);
        } else {
            element.classList.add('wrong-shake');
            SoundEngine.wrong();
            setTimeout(() => element.classList.remove('wrong-shake'), 400);
        }
    }
};

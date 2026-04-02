const MemoryGame = {
    emojis: ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐸', '🦄', '🐝', '🦋', '🌺', '🌈'],
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    totalPairs: 6,
    isLocked: false,

    init() {
        this.matchedPairs = 0;
        this.flippedCards = [];
        this.isLocked = false;
        document.getElementById('memory-score').textContent = '0';
        document.getElementById('memory-total').textContent = this.totalPairs;
        this.createBoard();
    },

    createBoard() {
        const area = document.getElementById('memory-game-area');
        area.innerHTML = '';

        // Pick random emojis for pairs
        const shuffledEmojis = [...this.emojis].sort(() => Math.random() - 0.5);
        const selected = shuffledEmojis.slice(0, this.totalPairs);

        // Create pairs and shuffle
        this.cards = [...selected, ...selected].sort(() => Math.random() - 0.5);

        this.cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = index;
            card.dataset.emoji = emoji;
            card.innerHTML = `<span class="card-face">${emoji}</span>`;
            card.style.animation = `popIn 0.3s ease-out ${index * 0.05}s backwards`;
            card.addEventListener('click', () => this.flipCard(card));
            area.appendChild(card);
        });
    },

    flipCard(card) {
        if (this.isLocked) return;
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
        if (this.flippedCards.length >= 2) return;

        card.classList.add('flipped');
        SoundEngine.flip();
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.isLocked = true;
            this.checkMatch();
        }
    },

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const match = card1.dataset.emoji === card2.dataset.emoji;

        if (match) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.matchedPairs++;
            document.getElementById('memory-score').textContent = this.matchedPairs;
            SoundEngine.correct();
            spawnConfetti();

            this.flippedCards = [];
            this.isLocked = false;

            if (this.matchedPairs === this.totalPairs) {
                setTimeout(() => {
                    showCelebration('You found all pairs!');
                    SoundEngine.celebrate();
                }, 500);
            }
        } else {
            SoundEngine.wrong();
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                this.flippedCards = [];
                this.isLocked = false;
            }, 1000);
        }
    }
};

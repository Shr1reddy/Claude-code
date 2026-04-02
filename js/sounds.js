// Sound system using Web Audio API (no external files needed)
const SoundEngine = {
    ctx: null,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    // Play a simple tone
    playTone(frequency, duration = 0.2, type = 'sine', volume = 0.3) {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = frequency;
        gain.gain.value = volume;
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    // Correct answer sound - happy ascending notes
    correct() {
        this.playTone(523, 0.15, 'sine', 0.25);
        setTimeout(() => this.playTone(659, 0.15, 'sine', 0.25), 100);
        setTimeout(() => this.playTone(784, 0.3, 'sine', 0.25), 200);
    },

    // Wrong answer sound - gentle low tone
    wrong() {
        this.playTone(200, 0.3, 'triangle', 0.15);
    },

    // Pop sound for bubbles
    pop() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 800;
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.1);
        gain.gain.value = 0.3;
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    },

    // Card flip sound
    flip() {
        this.playTone(600, 0.08, 'sine', 0.15);
    },

    // Celebration sound - musical fanfare
    celebrate() {
        const notes = [523, 587, 659, 784, 880, 1047];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.2), i * 100);
        });
    },

    // Button click
    click() {
        this.playTone(440, 0.05, 'square', 0.1);
    },

    // Animal sounds (synthesized approximations)
    animalSound(animal) {
        this.init();
        switch (animal) {
            case 'cow':
                this.playTone(150, 0.6, 'sawtooth', 0.2);
                setTimeout(() => this.playTone(130, 0.6, 'sawtooth', 0.2), 300);
                break;
            case 'cat':
                this.playTone(700, 0.4, 'sine', 0.2);
                setTimeout(() => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.value = 800;
                    osc.frequency.linearRampToValueAtTime(500, this.ctx.currentTime + 0.5);
                    gain.gain.value = 0.2;
                    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start();
                    osc.stop(this.ctx.currentTime + 0.5);
                }, 200);
                break;
            case 'dog':
                this.playTone(400, 0.15, 'sawtooth', 0.2);
                setTimeout(() => this.playTone(350, 0.2, 'sawtooth', 0.2), 150);
                break;
            case 'duck':
                this.playTone(500, 0.1, 'square', 0.15);
                setTimeout(() => this.playTone(480, 0.1, 'square', 0.15), 150);
                setTimeout(() => this.playTone(500, 0.1, 'square', 0.15), 300);
                break;
            case 'pig':
                this.playTone(300, 0.15, 'sawtooth', 0.15);
                setTimeout(() => this.playTone(350, 0.15, 'sawtooth', 0.15), 100);
                break;
            case 'sheep':
                this.playTone(400, 0.3, 'triangle', 0.2);
                setTimeout(() => this.playTone(450, 0.4, 'triangle', 0.2), 200);
                break;
        }
    }
};

const startButton = document.getElementById("start-button");
const startContainer = document.getElementById("start-container");
const audio = document.getElementById("background-audio");
const candle = document.getElementById("candle");
const flame0 = document.getElementById("flame0");
const flame1 = document.getElementById("flame1");
const flame2 = document.getElementById("flame2");



const fireworkCanvas = document.getElementById("firework-canvas");
const fireworkCtx = fireworkCanvas.getContext("2d");

fireworkCanvas.width = window.innerWidth;
fireworkCanvas.height = window.innerHeight;

const instruction = document.getElementById("instruction");
instruction.classList.add('hidden');

startButton.addEventListener("click", function () {
    audio.volume = 0.3;

    audio.play().catch((err) => {
        console.log("User interaction required to play audio:", err);
    });

    startContainer.classList.add("hidden");

    instruction.classList.remove("hidden");
    startFireworks();
    startMicrophone();
});

function startMicrophone() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        analyser.fftSize = 2048;
        microphone.connect(analyser);

        function detectBlow() {
            analyser.getByteTimeDomainData(dataArray);
            const maxVolume = Math.max(...dataArray);

            if (maxVolume > 180) {
                blowOutCandle();
            }
            requestAnimationFrame(detectBlow);
        }

        detectBlow();
    });
}

function blowOutCandle() {
    flame0.classList.add("hidden");
    flame1.classList.add("hidden");
    flame2.classList.add("hidden");
    instruction.textContent = "Tèn ten...! 🎉";
    startConfetti();
}

function startConfetti() {
    const confettiCanvas = document.getElementById("confetti");
    const confettiCtx = confettiCanvas.getContext("2d");

    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    let confettis = [];

    function Confetti() {
        this.x = Math.random() * confettiCanvas.width;
        this.y = Math.random() * confettiCanvas.height - confettiCanvas.height;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.size = Math.random() * 5 + 5;
        this.speed = Math.random() * 3 + 2;
    }

    function drawConfetti() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        for (let i = 0; i < confettis.length; i++) {
            const confetti = confettis[i];
            confettiCtx.fillStyle = confetti.color;
            confettiCtx.fillRect(confetti.x, confetti.y, confetti.size, confetti.size);

            confetti.y += confetti.speed;

            if (confetti.y > confettiCanvas.height) {
                confetti.y = -confetti.size;
                confetti.x = Math.random() * confettiCanvas.width;
            }
        }

        requestAnimationFrame(drawConfetti);
    }

    function initConfetti() {
        confettis = [];
        for (let i = 0; i < 100; i++) {
            confettis.push(new Confetti());
        }
        drawConfetti();
    }

    initConfetti();
}

function startFireworks() {
    const particles = [];

    function Particle(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 4 + 2;
        this.speedX = (Math.random() - 0.5) * 10;
        this.speedY = (Math.random() - 0.5) * 10;
        this.gravity = 0.1;

        this.update = function () {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += this.gravity;
            this.size *= 0.97; // Shrink the particles
        };

        this.draw = function () {
            fireworkCtx.fillStyle = this.color;
            fireworkCtx.beginPath();
            fireworkCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            fireworkCtx.fill();
        };
    }

    function createFirework(x, y) {
        const colors = ['red', 'yellow', 'blue', 'green', 'orange', 'purple'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle(x, y, color));
        }
    }

    function updateParticles() {
        fireworkCtx.clearRect(0, 0, fireworkCanvas.width, fireworkCanvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            particle.update();
            particle.draw();

            if (particle.size <= 0.5) {
                particles.splice(i, 1);
            }
        }

        requestAnimationFrame(updateParticles);
    }

    // Simulate random fireworks
    function randomFirework() {
        const x = Math.random() * fireworkCanvas.width;
        const y = Math.random() * fireworkCanvas.height * 0.6;
        createFirework(x, y);
        setTimeout(randomFirework, 500);
    }

    randomFirework();
    updateParticles();
}

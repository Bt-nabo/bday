document.addEventListener('DOMContentLoaded', () => {
    // Buttons
    const startBtn = document.getElementById('start-btn');
    const muteBtn = document.getElementById('mute-btn');
    const bgMusic = document.getElementById('bg-music');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    // Sections
    const heroSection = document.getElementById('hero');
    const messageSection = document.getElementById('message');
    const memoriesSection = document.getElementById('memories');
    const surpriseSection = document.getElementById('surprise');
    const wishesSection = document.getElementById('wishes');
    const contentSections = document.querySelectorAll('.content-section');

    // Components
    const typingText = document.getElementById('typing-text');
    const cards = document.querySelectorAll('.card');

    let currentCard = 0;
    let isPlaying = false;

    // --- Audio Control ---
    muteBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            muteBtn.textContent = '🔇 Music Paused';
        } else {
            bgMusic.play().then(() => {
                muteBtn.textContent = '🔊 Music Playing';
            }).catch(e => {
                console.log("Audio play failed (browser policy): ", e);
                alert("Please interact with the document first to play audio.");
            });
        }
        isPlaying = !isPlaying;
    });

    // --- Navigation & Scroll Logic ---
    startBtn.addEventListener('click', () => {
        // Smooth scroll to message section
        messageSection.classList.remove('hidden');
        messageSection.scrollIntoView({ behavior: 'smooth' });

        // Start typing effect slightly after scroll
        setTimeout(startTyping, 1000);

        // Enhance experience by starting music if not already (user interaction happened)
        if (!isPlaying) {
            bgMusic.play().catch(() => { });
            muteBtn.textContent = '🔊 Music Playing';
            isPlaying = true;
        }
    });

    // Intersection Observer for transitions
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.remove('hidden');

                if (entry.target.id === 'surprise') {
                    triggerConfetti();
                }
            }
        });
    }, { threshold: 0.3 });

    contentSections.forEach(section => {
        observer.observe(section);
    });
    observer.observe(wishesSection);

    // Explicitly observe reels to ensure visibility
    const reelsSection = document.getElementById('reels');
    if (reelsSection) observer.observe(reelsSection);

    // --- Typing Effect ---
    // Note: Breaking lines with \n or <br> implementation
    const message = `Do you know how special you are?\nYour smile, your kindness, your presence...\nEverything about you makes the world brighter.\nI just wanted to take a moment to say...\nThank you for being you.`;

    function startTyping() {
        let i = 0;
        typingText.innerHTML = '';
        const speed = 50;

        function typeWriter() {
            if (i < message.length) {
                if (message.charAt(i) === '\n') {
                    typingText.innerHTML += '<br>';
                } else {
                    typingText.innerHTML += message.charAt(i);
                }
                i++;
                setTimeout(typeWriter, speed);
            } else {
                // Once finished, reveal next sections if user hasn't scrolled
                memoriesSection.classList.remove('hidden');
                surpriseSection.classList.remove('hidden');
                wishesSection.classList.remove('hidden');
            }
        }
        typeWriter();
    }

    // --- Slider/Cards ---
    function showCard(index) {
        cards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === index) {
                card.classList.add('active');
            }
        });
    }

    nextBtn.addEventListener('click', () => {
        currentCard = (currentCard + 1) % cards.length;
        showCard(currentCard);
    });

    prevBtn.addEventListener('click', () => {
        currentCard = (currentCard - 1 + cards.length) % cards.length;
        showCard(currentCard);
    });

    // --- Confetti ---
    function triggerConfetti() {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function random(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // multiple origins
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    // --- Slideshow Logic ---
    alert("Update Successful! Scroll down to the bottom to find the 'Celebrate Birthday' button. 🎂");
    console.log("Initializing Slideshow Logic...");
    const celebrateBtn = document.getElementById('celebrate-btn');
    if (!celebrateBtn) console.error("Celebrate button not found!");

    const slideshowOverlay = document.getElementById('slideshow-overlay');
    const closeSlideshow = document.getElementById('close-slideshow');
    const slideImg = document.getElementById('slide-img');

    // Image paths - updated with the copied images
    const images = [
        'images/img1.jpg',
        'images/img2.jpg',
        'images/img3.jpg'
    ];

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slideImg.classList.remove('show');
        setTimeout(() => {
            slideImg.src = images[index];
            slideImg.onload = () => {
                slideImg.classList.add('show');
            };
        }, 500);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % images.length;
        showSlide(currentSlide);
    }

    celebrateBtn.addEventListener('click', () => {
        slideshowOverlay.classList.remove('hidden');
        slideshowOverlay.classList.add('visible'); // Use visible class for opacity transition
        currentSlide = 0;
        showSlide(currentSlide);
        slideInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds

        // Trigger confetti again for effect
        triggerConfetti();
    });

    closeSlideshow.addEventListener('click', () => {
        slideshowOverlay.classList.remove('visible');
        setTimeout(() => {
            slideshowOverlay.classList.add('hidden');
        }, 500);
        clearInterval(slideInterval);
    });

    // --- Floating Elements (Hero) ---
    function createFloatingElements() {
        const container = document.querySelector('.floating-elements');
        const shapes = ['❤️', '✨', '🌸', '💖'];

        for (let i = 0; i < 20; i++) {
            const el = document.createElement('div');
            el.innerText = shapes[Math.floor(Math.random() * shapes.length)];
            el.style.position = 'absolute';
            el.style.left = Math.random() * 100 + 'vw';
            el.style.top = Math.random() * 100 + 'vh';
            el.style.fontSize = Math.random() * 20 + 10 + 'px';
            el.style.opacity = Math.random() * 0.5 + 0.3;
            el.style.animation = `float ${Math.random() * 3 + 2}s infinite ease-in-out`;
            el.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(el);
        }
    }

    createFloatingElements();
});

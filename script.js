'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const WEDDING_DATE = new Date('2026-05-31T11:00:00+05:30').getTime();

    // 1. CLEAN PARALLAX
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        document.querySelectorAll('.decor-corner').forEach((el, i) => {
            const speed = (i % 2 === 0) ? 1 : -1;
            el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });

    // 2. GOLD DUST PARTICLES
    const canvas = document.getElementById('hero-dust');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function initParticles() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < 80; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.5 + 0.5,
                d: Math.random() * 0.5 + 0.2
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            p.y -= p.d;
            if (p.y < 0) p.y = canvas.height;
        });
        requestAnimationFrame(drawParticles);
    }

    // 3. COUNTDOWN TIMER
    function updateCountdown() {
        const now = Date.now();
        const diff = Math.max(0, WEDDING_DATE - now);

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('cd-d').textContent = String(d).padStart(2, '0');
        document.getElementById('cd-h').textContent = String(h).padStart(2, '0');
        document.getElementById('cd-m').textContent = String(m).padStart(2, '0');
        document.getElementById('cd-s').textContent = String(s).padStart(2, '0');
    }

    // 4. SCROLL REVEAL
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-section').forEach(el => revealObserver.observe(el));

    // 5. RSVP + MODAL LOGIC
    window.handleRSVP = function(choice) {
        const modal = document.getElementById('rsvp-modal');
        const bodyYes = document.getElementById('modal-body-yes');
        const bodyNo = document.getElementById('modal-body-no');
        const audio = document.getElementById('bg-music');

        // Reset
        bodyYes.classList.add('hidden');
        bodyNo.classList.add('hidden');

        if (choice === 'yes') {
            bodyYes.classList.remove('hidden');

            // 🎵 Play music with fade-in
            if (audio) {
                audio.volume = 0;
                audio.play().then(() => {
                    let vol = 0;
                    const fadeIn = setInterval(() => {
                        vol += 0.05;
                        if (vol >= 1) {
                            vol = 1;
                            clearInterval(fadeIn);
                        }
                        audio.volume = vol;
                    }, 100);
                }).catch(() => {});
            }

        } else {
            bodyNo.classList.remove('hidden');
        }

        modal.classList.remove('hidden');
        modal.classList.add('active');
    };

    // 🔥 UPDATED CLOSE MODAL WITH MUSIC STOP
    window.closeModal = function() {
        const modal = document.getElementById('rsvp-modal');
        const audio = document.getElementById('bg-music');

        modal.classList.remove('active');

        // 🎵 Smooth fade-out + stop
        if (audio && !audio.paused) {
            let vol = audio.volume;
            const fadeOut = setInterval(() => {
                vol -= 0.05;
                if (vol <= 0) {
                    audio.pause();
                    audio.currentTime = 0;
                    audio.volume = 1;
                    clearInterval(fadeOut);
                } else {
                    audio.volume = vol;
                }
            }, 100);
        }

        setTimeout(() => {
            modal.classList.add('hidden');
        }, 400);
    };

    // Click outside to close
    window.addEventListener("click", function(event) {
        const modal = document.getElementById('rsvp-modal');
        if (event.target === modal) {
            closeModal();
        }
    });

    // ESC key close
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            closeModal();
        }
    });

    // INIT
    initParticles();
    drawParticles();
    setInterval(updateCountdown, 1000);
    updateCountdown();
    window.addEventListener('resize', initParticles);
});
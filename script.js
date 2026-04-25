'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const WEDDING_DATE = new Date('2026-05-31T11:00:00+05:30').getTime();

    // 1. CLEAN PARALLAX (Subtle framing movement)
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        document.querySelectorAll('.decor-corner').forEach((el, i) => {
            const speed = (i % 2 === 0) ? 1 : -1;
            el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });

    // 2. GOLD DUST PARTICLES (On Hero)
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
                d: Math.random() * 0.5 + 0.2,
                a: Math.random() * 0.5
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

    // 4. SCROLL REVEAL LOGIC
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-section').forEach(el => revealObserver.observe(el));

    // 5. RSVP FORM SIMULATION
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = rsvpForm.querySelector('button');
            btn.textContent = "Sending...";
            btn.disabled = true;
            
            setTimeout(() => {
                rsvpForm.classList.add('hidden');
                document.getElementById('rsvp-ok').classList.remove('hidden');
            }, 1500);
        });
    }

    // Init All
    initParticles();
    drawParticles();
    setInterval(updateCountdown, 1000);
    updateCountdown();
    window.addEventListener('resize', initParticles);
});
document.addEventListener('DOMContentLoaded', () => {

    // ── PIXEL PARTICLE SYSTEM ──────────────────────────────
    const canvas = document.getElementById('particles');
    const ctx    = canvas.getContext('2d');

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#FF6B00', '#FF2200', '#FFD000', '#ffffff', '#FF9940'];
    const isMobile = () => window.innerWidth < 768;

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x     = Math.random() * canvas.width;
            this.y     = Math.random() * canvas.height;
            this.size  = Math.random() < 0.7 ? 1 : 2;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.alpha = Math.random() * 0.5 + 0.1;
            this.vx    = (Math.random() - 0.5) * 0.3;
            this.vy    = (Math.random() - 0.5) * 0.3;
            this.life  = Math.random() * 200 + 100;
            this.maxLife = this.life;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life--;
            if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            const a = (this.life / this.maxLife) * this.alpha;
            ctx.globalAlpha = a;
            ctx.fillStyle   = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur  = 6;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }

    const count = isMobile() ? 60 : 150;
    const particles = Array.from({ length: count }, () => new Particle());

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.shadowBlur = 0;
        particles.forEach(p => { p.update(); p.draw(); });
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    };
    animate();


    // ── HERO MOUSE PARALLAX ──────────────────────────────────
    const hero        = document.querySelector('.hero-section');
    const heroContent = document.getElementById('heroContent');
    const heroBgImg   = document.getElementById('heroBgImg');

    if (hero && !isMobile()) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2);
            const y = (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2);

            if (heroBgImg)   heroBgImg.style.transform  = `translate(${x * 18}px, ${y * 12}px)`;
            if (heroContent) heroContent.style.transform = `translate(${x * -12}px, ${y * -8}px)`;
        });
        hero.addEventListener('mouseleave', () => {
            if (heroBgImg)   heroBgImg.style.transform  = '';
            if (heroContent) heroContent.style.transform = '';
        });
    }


    // ── 3D CARD TILT ─────────────────────────────────────────
    document.querySelectorAll('.holo-card, .reserve-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x    = e.clientX - rect.left;
            const y    = e.clientY - rect.top;
            const cx   = rect.width  / 2;
            const cy   = rect.height / 2;
            const rotX = ((y - cy) / cy) * -10;
            const rotY = ((x - cx) / cx) *  12;

            card.style.transform  = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
            card.style.boxShadow  = `${-rotY}px ${rotX}px 30px rgba(0,229,255,0.15)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });


    // ── RITUAL VISUAL MOUSE DEPTH ────────────────────────────
    const ritualVisual = document.getElementById('ritualVisual');
    if (ritualVisual && !isMobile()) {
        const tags = ritualVisual.querySelectorAll('.pixel-tag');
        const orb  = ritualVisual.querySelector('.holo-orb');

        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth  - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            tags.forEach((tag, i) => {
                const d = 0.5 + i * 0.4;
                tag.style.transform = `translateX(${x * 18 * d}px) translateY(${y * 12 * d}px)`;
            });
            if (orb) orb.style.transform = `translate(calc(-50% + ${x * 24}px), calc(-50% + ${y * 16}px))`;
        });
    }


    // ── HAMBURGER ────────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    if (hamburger && mobileNav) {
        const open  = () => { hamburger.classList.add('active');    mobileNav.classList.add('active');    document.body.style.overflow='hidden'; };
        const close = () => { hamburger.classList.remove('active'); mobileNav.classList.remove('active'); document.body.style.overflow=''; };

        hamburger.addEventListener('click', () => mobileNav.classList.contains('active') ? close() : open());
        mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
        document.addEventListener('keydown', e => e.key === 'Escape' && close());
    }


    // ── NAV SCROLL ───────────────────────────────────────────
    const nav = document.getElementById('nav');
    const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();


    // ── GSAP SCROLL ANIMATIONS ───────────────────────────────
    gsap.registerPlugin(ScrollTrigger);

    // Section labels
    gsap.utils.toArray('.section-label').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 90%' },
            x: -30, opacity: 0, duration: 0.8, ease: 'power2.out'
        });
    });

    // Headings
    gsap.utils.toArray('.neon-heading, .neon-heading-sm').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
            y: 50, opacity: 0, duration: 1, ease: 'power3.out'
        });
    });

    // Ritual text
    gsap.from('.ritual-desc', {
        scrollTrigger: { trigger: '.ritual-desc', start: 'top 85%' },
        y: 30, opacity: 0, duration: 1, ease: 'power2.out', delay: 0.2
    });

    // Stats stagger
    gsap.from('.stat', {
        scrollTrigger: { trigger: '.ritual-stats', start: 'top 82%' },
        y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out'
    });

    // Pixel tags
    gsap.utils.toArray('.pixel-tag').forEach((tag, i) => {
        gsap.from(tag, {
            scrollTrigger: { trigger: '#ritualVisual', start: 'top 80%' },
            opacity: 0, scale: 0.6, duration: 0.8,
            delay: i * 0.15, ease: 'back.out(2)'
        });
    });

    // Holo cards
    gsap.from('.holo-card', {
        scrollTrigger: { trigger: '.services-grid', start: 'top 78%' },
        y: 60, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power2.out'
    });

    // Atmosphere items
    gsap.utils.toArray('.detail-item').forEach((item, i) => {
        const dir  = i % 2 === 0 ? -60 : 60;
        const text = item.querySelector('.detail-text');
        const vis  = item.querySelector('.detail-visual');
        if (text) gsap.from(text, {
            scrollTrigger: { trigger: item, start: 'top 74%' },
            x: dir, opacity: 0, duration: 1.2, ease: 'power2.out'
        });
        if (vis) gsap.from(vis, {
            scrollTrigger: { trigger: item, start: 'top 74%' },
            scale: 1.1, opacity: 0, duration: 1.2, ease: 'power2.out'
        });
    });

    // Quote
    gsap.from('.quote-wrapper', {
        scrollTrigger: { trigger: '.quote-section', start: 'top 75%' },
        y: 50, opacity: 0, duration: 1.2, ease: 'power2.out'
    });

    // Reserve card
    gsap.from('.reserve-card', {
        scrollTrigger: { trigger: '.reserve-card', start: 'top 80%' },
        y: 50, opacity: 0, duration: 1, ease: 'power2.out'
    });


    // ── HERO TITLE ENTRANCE ──────────────────────────────────
    const heroEl = document.querySelector('.hero-content');
    setTimeout(() => {
        if (heroEl) {
            heroEl.style.opacity = '1';
            gsap.from('.hero-year',    { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out' });
            gsap.from('.hero-title',   { y: 50, opacity: 0, duration: 1,   ease: 'power3.out', delay: 0.2 });
            gsap.from('.hero-sub',     { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.5 });
            gsap.from('.hero-divider', { opacity: 0, duration: 0.8, delay: 0.7 });
            gsap.from('.hero-tagline', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.8 });
            gsap.from('.btn-cyber',    { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 1 });
            gsap.from('.scroll-indicator', { opacity: 0, duration: 1, delay: 1.5 });
        }
    }, 200);

});

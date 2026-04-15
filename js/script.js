document.addEventListener('DOMContentLoaded', () => {

    // ── STAR FIELD ───────────────────────────────────────────
    const canvas = document.getElementById('stars');
    const ctx    = canvas.getContext('2d');

    const resize = () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const stars = [];
    const STAR_COUNT = window.innerWidth < 768 ? 120 : 250;

    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x:     Math.random() * window.innerWidth,
            y:     Math.random() * window.innerHeight,
            r:     Math.random() * 1.2 + 0.2,
            alpha: Math.random() * 0.7 + 0.1,
            speed: Math.random() * 0.003 + 0.001,
            phase: Math.random() * Math.PI * 2,
            gold:  Math.random() < 0.15,
        });
    }

    let frame = 0;
    const drawStars = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frame += 0.01;

        stars.forEach(s => {
            const a = s.alpha * (0.5 + 0.5 * Math.sin(frame * s.speed * 60 + s.phase));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = s.gold
                ? `rgba(212,175,55,${a})`
                : `rgba(255,255,255,${a * 0.6})`;
            if (s.gold && a > 0.5) {
                ctx.shadowColor = 'rgba(212,175,55,0.8)';
                ctx.shadowBlur  = 6;
            } else {
                ctx.shadowBlur = 0;
            }
            ctx.fill();
        });

        requestAnimationFrame(drawStars);
    };
    drawStars();


    // ── SPARKS (fire embers rising) ──────────────────────────
    const sparksWrap = document.getElementById('sparks');
    if (sparksWrap) {
        const count = window.innerWidth < 768 ? 10 : 20;
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.className = 'spark';
            const lx = Math.random() * 100;
            const sd = 5 + Math.random() * 7;
            const dl = Math.random() * 8;
            const dx = (Math.random() - 0.5) * 80;
            el.style.setProperty('--lx', lx + '%');
            el.style.setProperty('--sd', sd + 's');
            el.style.setProperty('--dl', dl + 's');
            el.style.setProperty('--dx', dx + 'px');
            const sz = 2 + Math.random() * 3;
            el.style.width  = sz + 'px';
            el.style.height = sz + 'px';
            sparksWrap.appendChild(el);
        }
    }


    // ── HERO PARALLAX ────────────────────────────────────────
    const hero      = document.querySelector('.hero');
    const heroPhoto = document.getElementById('heroPhoto');
    const heroBox   = document.querySelector('.hero-box');

    if (hero && window.innerWidth > 768) {
        hero.addEventListener('mousemove', e => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2);
            const y = (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2);
            if (heroPhoto) heroPhoto.style.transform = `translate(${x * 20}px, ${y * 14}px)`;
            if (heroBox)   heroBox.style.transform   = `translate(${x * -10}px, ${y * -7}px)`;
        });
        hero.addEventListener('mouseleave', () => {
            if (heroPhoto) heroPhoto.style.transform = '';
            if (heroBox)   heroBox.style.transform   = '';
        });
    }


    // ── 3D CARD TILT ─────────────────────────────────────────
    document.querySelectorAll('.service-card, .reserve-box').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x    = e.clientX - rect.left;
            const y    = e.clientY - rect.top;
            const cx   = rect.width  / 2;
            const cy   = rect.height / 2;
            const rX   = ((y - cy) / cy) * -8;
            const rY   = ((x - cx) / cx) *  10;
            card.style.transform = `perspective(800px) rotateX(${rX}deg) rotateY(${rY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });


    // ── BURGER ───────────────────────────────────────────────
    const burger = document.getElementById('burger');
    const mobNav = document.getElementById('mobNav');

    if (burger && mobNav) {
        const open  = () => { burger.classList.add('active');    mobNav.classList.add('open');    document.body.style.overflow = 'hidden'; };
        const close = () => { burger.classList.remove('active'); mobNav.classList.remove('open'); document.body.style.overflow = ''; };
        burger.addEventListener('click', () => mobNav.classList.contains('open') ? close() : open());
        mobNav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
        document.addEventListener('keydown', e => e.key === 'Escape' && close());
    }


    // ── NAV SCROLL ───────────────────────────────────────────
    const nav     = document.getElementById('nav');
    const stickyBook = document.querySelector('.sticky-book');
    const reserveEl = document.getElementById('reserve');
    const onScroll = () => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
        if (stickyBook && reserveEl) {
            const rect = reserveEl.getBoundingClientRect();
            const inReserve = rect.top < window.innerHeight && rect.bottom > 0;
            const afterHero = window.scrollY > window.innerHeight * 0.4;
            stickyBook.style.opacity = (afterHero && !inReserve) ? '1' : '0';
            stickyBook.style.pointerEvents = (afterHero && !inReserve) ? 'auto' : 'none';
            stickyBook.style.transform = (afterHero && !inReserve) ? 'translateY(0)' : 'translateY(100%)';
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    if (stickyBook) stickyBook.style.transition = 'opacity 0.3s, transform 0.3s';
    onScroll();


    // ── LIGHTBOX ─────────────────────────────────────────────
    const lightbox = document.getElementById('lightbox');
    const lbImg    = document.getElementById('lbImg');
    const lbClose  = document.getElementById('lbClose');
    const lbPrev   = document.getElementById('lbPrev');
    const lbNext   = document.getElementById('lbNext');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item img'));
    let currentIdx = 0;

    const openLb = (idx) => {
        currentIdx = idx;
        lbImg.src = galleryItems[idx].src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    };
    const closeLb = () => {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    };
    const showNext = () => openLb((currentIdx + 1) % galleryItems.length);
    const showPrev = () => openLb((currentIdx - 1 + galleryItems.length) % galleryItems.length);

    galleryItems.forEach((img, i) => img.parentElement.addEventListener('click', () => openLb(i)));
    lbClose.addEventListener('click', closeLb);
    lbNext.addEventListener('click', showNext);
    lbPrev.addEventListener('click', showPrev);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape')      closeLb();
        if (e.key === 'ArrowRight')  showNext();
        if (e.key === 'ArrowLeft')   showPrev();
    });

    // ── INFO CARDS LIGHTBOX ──────────────────────────────────
    const infoCards = Array.from(document.querySelectorAll('.info-card img'));
    if (infoCards.length && lightbox && lbImg) {
        infoCards.forEach(img => {
            img.parentElement.style.cursor = 'pointer';
            img.parentElement.addEventListener('click', () => {
                lbImg.src = img.src;
                lbPrev.style.display = 'none';
                lbNext.style.display = 'none';
                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden';
            });
        });

        // restore arrows when gallery opens
        galleryItems.forEach((img, i) => {
            img.parentElement.addEventListener('click', () => {
                lbPrev.style.display = '';
                lbNext.style.display = '';
            });
        });
    }

    // ── GSAP ANIMATIONS ──────────────────────────────────────
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    gsap.from('.hero-ornament:first-child', { opacity:0, y:20, duration:1, delay:0.3 });
    gsap.from('.gold-title',    { opacity:0, y:40, duration:1.2, delay:0.5, ease:'power3.out' });
    gsap.from('.hero-divline',  { opacity:0, duration:0.8, delay:0.9 });
    gsap.from('.hero-sub',      { opacity:0, y:20, duration:0.8, delay:1.0, ease:'power2.out' });
    gsap.from('.hero-tagline',  { opacity:0, y:20, duration:0.8, delay:1.2, ease:'power2.out' });
    gsap.from('.gold-btn',      { opacity:0, y:20, duration:0.8, delay:1.4, ease:'power2.out' });
    gsap.from('.hero-ornament.bottom', { opacity:0, y:-10, duration:0.8, delay:1.6 });

    // Section reveals
    const reveals = [
        { el: '.section-title',  y: 40 },
        { el: '.gold-line',      y: 20 },
        { el: '.about-text p',   y: 30, stagger: 0.2 },
        { el: '.stats-row',      y: 30 },
        { el: '.img-frame',      x: 40 },
        { el: '.section-sub',    y: 20 },
        { el: '.service-card',   y: 50, stagger: 0.15 },
        { el: '.panel-overlay',  y: 30 },
        { el: '.quote-frame',    y: 40 },
        { el: '.reserve-box',    y: 40 },
        { el: '.inc-item',       y: 30, stagger: 0.07 },
        { el: '.desc-card',      y: 50, stagger: 0.15 },
        { el: '.contact-card',   y: 40, stagger: 0.12 },
    ];

    reveals.forEach(({ el, y = 0, x = 0, stagger = 0 }) => {
        const targets = gsap.utils.toArray(el);
        if (!targets.length) return;

        (stagger ? [targets] : targets).forEach(t => {
            gsap.from(stagger ? t : t, {
                scrollTrigger: {
                    trigger: stagger ? t[0] : t,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y, x, opacity: 0,
                duration: 1,
                stagger: stagger || 0,
                ease: 'power2.out'
            });
        });
    });

    // Panels slide in
    gsap.utils.toArray('.panel').forEach((panel, i) => {
        gsap.from(panel.querySelector('.panel-overlay'), {
            scrollTrigger: { trigger: panel, start: 'top 75%' },
            y: 40, opacity: 0, duration: 1.2, delay: i * 0.2, ease: 'power2.out'
        });
    });

    // Info cards stagger animation
    const infoCardEls = gsap.utils.toArray('.info-card');
    if (infoCardEls.length) {
        gsap.from(infoCardEls, {
            scrollTrigger: {
                trigger: '.info-cards',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 60,
            opacity: 0,
            scale: 0.92,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out'
        });
    }

});

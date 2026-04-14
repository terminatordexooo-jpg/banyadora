document.addEventListener('DOMContentLoaded', () => {
    // Loader
    const loaderLine = document.querySelector('.loader-line');

    // Simulate loading progress
    setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');

        // Trigger initial hero animations after load
        setTimeout(() => {
            document.querySelectorAll('.hero-content .fade-up').forEach(el => {
                el.classList.add('active');
            });
        }, 500);
    }, 1500);

    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Fade Up animations on scroll
    gsap.utils.toArray('.reveal-text, .section-desc, .detail-text, .product-card').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });
    });

    // Exploded View Parallax Effect
    // We want the components to move at different speeds when scrolling
    // to simulate the "floating" exploded diagram depth.

    const components = document.querySelectorAll('.component');

    components.forEach((comp, index) => {
        const speed = comp.getAttribute('data-speed');

        gsap.to(comp, {
            scrollTrigger: {
                trigger: ".engineering-section",
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: (index + 1) * 50 * speed, // Move down at different rates
            rotation: (index % 2 === 0 ? 5 : -5), // Subtle rotation
            ease: "none"
        });
    });

    // Smooth reveal for details
    gsap.utils.toArray('.detail-item').forEach((item, i) => {
        const direction = i % 2 === 0 ? -50 : 50; // Slide from left or right

        gsap.from(item.querySelector('.detail-text'), {
            scrollTrigger: {
                trigger: item,
                start: "top 70%"
            },
            x: direction,
            opacity: 0,
            duration: 1.5,
            ease: "power2.out"
        });

        gsap.from(item.querySelector('.detail-visual'), {
            scrollTrigger: {
                trigger: item,
                start: "top 70%"
            },
            scale: 1.1,
            duration: 1.5,
            ease: "power2.out"
        });
    });
});

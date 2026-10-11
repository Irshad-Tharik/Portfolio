
document.addEventListener("DOMContentLoaded", () => {
    const spot = document.getElementById("spot");
    const glow = document.getElementById("glow");
    const canvas = document.getElementById("snow");
    const ctx = canvas ? canvas.getContext("2d") : null;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* Moving spotlight and glow */
    let pointerX = window.innerWidth * 0.5;
    let pointerY = window.innerHeight * 0.35;
    let currentX = pointerX;
    let currentY = pointerY;
    let pointerActive = false;

    function updatePointer(event) {
        pointerX = event.clientX;
        pointerY = event.clientY;
        pointerActive = true;
    }

    window.addEventListener("pointermove", updatePointer, {
        passive: true
    });

    function animateBackground() {
        currentX += (pointerX - currentX) * 0.08;
        currentY += (pointerY - currentY) * 0.08;

        if (spot) {
            spot.style.transform =
                `translate3d(${currentX - 220}px, ${currentY - 220}px, 0)`;
        }

        if (glow) {
            glow.style.transform =
                `translate3d(${currentX - 350}px, ${currentY - 350}px, 0)`;
        }

        if (!reduceMotion) {
            requestAnimationFrame(animateBackground);
        }
    }

    if (spot || glow) {
        if (reduceMotion) {
            if (spot) {
                spot.style.transform =
                    `translate3d(${pointerX - 220}px, ${pointerY - 220}px, 0)`;
            }
            if (glow) {
                glow.style.transform =
                    `translate3d(${pointerX - 350}px, ${pointerY - 350}px, 0)`;
            }
        } else {
            animateBackground();
        }
    }

    /* Snow canvas */
    if (canvas && ctx) {
        let width = 0;
        let height = 0;
        let flakes = [];
        let snowFrame = null;

        function resizeSnow() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.min(
                110,
                Math.max(35, Math.floor(width / 10))
            );

            flakes = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5 + 0.5,
                speed: Math.random() * 0.7 + 0.25,
                drift: (Math.random() - 0.5) * 0.45,
                opacity: Math.random() * 0.55 + 0.2
            }));

            if (reduceMotion) {
                drawStaticSnow();
            }
        }

        function drawStaticSnow() {
            ctx.clearRect(0, 0, width, height);

            flakes.forEach((flake) => {
                ctx.beginPath();
                ctx.arc(
                    flake.x,
                    flake.y,
                    flake.radius,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = `rgba(255,255,255,${flake.opacity})`;
                ctx.fill();
            });
        }

        function animateSnow() {
            ctx.clearRect(0, 0, width, height);

            flakes.forEach((flake) => {
                ctx.beginPath();
                ctx.arc(
                    flake.x,
                    flake.y,
                    flake.radius,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle = `rgba(255,255,255,${flake.opacity})`;
                ctx.fill();

                flake.y += flake.speed;
                flake.x += flake.drift;

                if (flake.y > height + 5) {
                    flake.y = -5;
                    flake.x = Math.random() * width;
                }

                if (flake.x > width + 5) flake.x = -5;
                if (flake.x < -5) flake.x = width + 5;
            });

            snowFrame = requestAnimationFrame(animateSnow);
        }

        resizeSnow();
        window.addEventListener("resize", resizeSnow, {
            passive: true
        });

        if (!reduceMotion) {
            animateSnow();
        }
    }

    /* Reveal sections on scroll */
    const sections = document.querySelectorAll(
        ".project-hero, .project-section"
    );

    if (reduceMotion || !("IntersectionObserver" in window)) {
        sections.forEach((section) => {
            section.classList.add("is-visible");
        });
    } else {
        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        currentObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        sections.forEach((section) => {
            section.classList.add("reveal-section");
            observer.observe(section);
        });
    }
});

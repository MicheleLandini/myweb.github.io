// Wait for content to load
document.addEventListener("DOMContentLoaded", (event) => {

    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            const placeholder = document.getElementById('navbar-placeholder');
            if (placeholder) {
                placeholder.innerHTML = data;

                // Set active class dynamically
                const currentPath = window.location.pathname.split('/').pop() || 'index.html';
                const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === currentPath) {
                        link.classList.add('active');
                    }
                });
            }

            // Initialize the rest of the scripts
            initScripts();
        })
        .catch(error => console.error('Error loading navbar:', error));

    function initScripts() {
        // ====================
        // SVG MORPHING ANIMATION
        // ====================
        // ====================
        // SVG MORPHING ANIMATION
        // ====================
        function playMorphingIntro() {
            const heroSvgContainer = document.querySelector('.hero-svg-container');
            const frame = document.querySelector('#frame');
            const mlSignature = document.querySelector('#ml-signature');
            const wwwText = document.querySelector('#www-text');
            const pcIcon = document.querySelector('#pc-icon');

            if (!heroSvgContainer) return;

            // Helper per calcolare lunghezza tratti rettangoli
            const getRectLength = (el) => {
                const width = parseFloat(el.getAttribute('width'));
                const height = parseFloat(el.getAttribute('height'));
                return (width + height) * 2;
            };

            // Mostra il container SVG
            gsap.set(heroSvgContainer, { opacity: 1 });

            // Setup iniziale Frame
            const frameLen = getRectLength(frame);
            gsap.set(frame, {
                strokeDasharray: frameLen,
                strokeDashoffset: frameLen,
                transformOrigin: "center center",
                scale: 0.1,
                opacity: 0
            });

            // Setup iniziale Gruppi
            gsap.set([mlSignature, wwwText, pcIcon], { opacity: 0 });

            // Setup Path ML Signature
            document.querySelectorAll("#ml-signature path").forEach(path => {
                const len = path.getTotalLength();
                gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
            });

            // Setup Path WWW (NUOVO: Ora trattiamo WWW come percorsi da disegnare)
            document.querySelectorAll("#www-text path").forEach(path => {
                const len = path.getTotalLength();
                gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
            });

            // Setup Path PC Icon
            document.querySelectorAll("#pc-icon rect").forEach(rect => {
                const len = getRectLength(rect);
                gsap.set(rect, { strokeDasharray: len, strokeDashoffset: len });
            });

            // Crea timeline principale (SENZA loop infinito sull'intero blocco)
            const morphTl = gsap.timeline();

            // 1. APPEAR & EXPAND FRAME
            morphTl.to(frame, {
                opacity: 1,
                strokeDashoffset: 0,
                duration: 1,
                ease: "power2.out"
            })
                .to(frame, {
                    scale: 1,
                    duration: 1.2,
                    ease: "power4.inOut"
                });

            // 2. LOOP CONTENT INSIDE FRAME
            const contentTl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

            contentTl
                // 2a. ML Signature
                .to(mlSignature, { opacity: 1, duration: 0.1 })
                .to("#ml-signature path", {
                    strokeDashoffset: 0,
                    duration: 1.5,
                    stagger: 0.3,
                    ease: "power2.inOut"
                }, "<")
                .to(mlSignature, { opacity: 0, duration: 0.5, delay: 1 })

                // 2b. WWW Text
                .to(wwwText, { opacity: 1, duration: 0.1 })
                .to("#www-text path", {
                    strokeDashoffset: 0,
                    duration: 1.5,
                    stagger: 0.2,
                    ease: "power1.inOut"
                }, "<")
                .to(wwwText, { opacity: 0, duration: 0.5, delay: 1 })

                // 2c. PC Icon
                .to(pcIcon, { opacity: 1, duration: 0.5 })
                .to("#pc-icon rect", {
                    strokeDashoffset: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.inOut"
                }, "<")
                .to(pcIcon, { opacity: 0, duration: 0.5, delay: 1 });

            // Aggiungi il loop alla coda della timeline principale
            morphTl.add(contentTl);

            return morphTl;
        }

        // ====================
        // HERO TEXT ANIMATION
        // ====================
        function startHeroAnimation() {
            const heroTl = gsap.timeline();

            if (document.querySelector("h1 span")) {
                heroTl.to(".hero h1 span", {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power4.out"
                });
            }

            if (document.querySelector(".hero-subtitle")) {
                heroTl.to(".hero-subtitle", {
                    opacity: 1,
                    y: 0,
                    duration: 0.8
                }, "-=0.6");
            }

            if (document.querySelector(".btn")) {
                heroTl.to(".btn", {
                    opacity: 1,
                    y: 0,
                    duration: 0.6
                }, "-=0.4");
            }

            return heroTl;
        }

        // ====================
        // LOADER LOGIC
        // ====================
        const loader = document.querySelector(".loader");
        const dynamicText = document.querySelector(".dynamic-text");
        const words = ["APP", "SITI WEB", "GESTIONALI", "E-COMMERCE"];
        const hasVisited = sessionStorage.getItem("visited");

        if (loader && dynamicText && !hasVisited) {
            // Prima visita - mostra loader
            sessionStorage.setItem("visited", "true");
            document.body.style.overflow = "hidden";

            const wordTl = gsap.timeline({
                onComplete: () => {
                    // Nasconde loader
                    gsap.to(loader, {
                        yPercent: -100,
                        duration: 1,
                        ease: "power4.inOut",
                        onComplete: () => {
                            loader.style.display = "none";
                            document.body.style.overflow = "";

                            // Avvia animazioni hero
                            playMorphingIntro();
                            startHeroAnimation();
                        }
                    });
                }
            });

            // Anima ogni parola
            words.forEach((word) => {
                wordTl
                    .to(dynamicText, {
                        opacity: 0,
                        y: 20,
                        duration: 0.2,
                        onComplete: () => {
                            dynamicText.textContent = word;
                        }
                    })
                    .to(dynamicText, {
                        opacity: 1,
                        y: 0,
                        duration: 0.2
                    })
                    .to({}, { duration: 0.6 });
            });

        } else {
            // Visite successive - salta loader
            if (loader) loader.style.display = "none";
            playMorphingIntro();
            startHeroAnimation();
        }

        // ====================
        // NAV ANIMATION
        // ====================
        if (document.querySelector("nav")) {
            gsap.to("nav .logo, nav .nav-links, .hamburger", {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.5,
                ease: "power3.out",
                startAt: { y: -50, opacity: 0 }
            });
        }

        // ====================
        // CIRCLES ANIMATION
        // ====================
        if (document.querySelectorAll(".circle").length > 0) {
            gsap.to(".circle", {
                scale: 1,
                opacity: (i, target) => target.classList.contains("circle-1") ? 0.2 : 0.15,
                duration: 2,
                delay: 1,
                ease: "elastic.out(1, 0.5)",
                startAt: { scale: 0, opacity: 0 }
            });
        }

        // ====================
        // PAGE TRANSITION
        // ====================
        const links = document.querySelectorAll('a:not([target="_blank"])');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                if (href && href !== "#" && !href.includes("javascript")) {
                    e.preventDefault();
                    gsap.to("body", {
                        opacity: 0,
                        y: -20,
                        duration: 0.5,
                        ease: "power2.in",
                        onComplete: () => {
                            window.location.href = href;
                        }
                    });
                }
            });
        });

        // ====================
        // FADE-IN ANIMATION
        // ====================
        if (document.querySelectorAll(".fade-in").length > 0) {
            gsap.to(".fade-in", {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                delay: 0.2,
                ease: "power2.out",
                startAt: { y: 30, opacity: 0 }
            });
        }

        // ====================
        // HAMBURGER MENU
        // ====================
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        let activeMobileMenu = false;

        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                activeMobileMenu = !activeMobileMenu;

                if (activeMobileMenu) {
                    // Anima links in entrata
                    gsap.fromTo(".mobile-menu a",
                        { y: 30, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.2, ease: "power2.out" }
                    );
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
        }

        // ====================
        // NAVBAR SCROLL EFFECT
        // ====================
        // ====================
        // NAVBAR SCROLL EFFECT (DYNAMIC)
        // ====================
        const nav = document.querySelector('nav');

        function updateNavStyle() {
            if (!nav) return;
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const scrolled = window.scrollY > 50;
            const isMobile = window.innerWidth <= 768;

            if (scrolled) {
                gsap.to(nav, {
                    duration: 0.3,
                    backgroundColor: isDark ? "rgba(26, 26, 26, 0.85)" : "rgba(255, 248, 231, 0.7)", // Dark vs Light Glass
                    backdropFilter: "blur(10px)",
                    borderBottom: "none",
                    padding: "1.5rem 2rem",
                    ease: "power2.out"
                });
            } else {
                gsap.to(nav, {
                    duration: 0.3,
                    backgroundColor: isMobile ? (isDark ? "rgba(26, 26, 26, 0.95)" : "rgba(255, 248, 231, 0.95)") : "transparent",
                    backdropFilter: "blur(0px)",
                    borderBottom: "none",
                    padding: "2rem 2rem",
                    ease: "power2.out"
                });
            }
        }

        if (nav) {
            window.addEventListener('scroll', updateNavStyle);
            window.addEventListener('resize', updateNavStyle);
        }

        // ====================
        // BLOB ANIMATION (Circle 1)
        // ====================
        if (document.querySelector(".circle-1") && document.querySelector(".page-overview")) {
            // Ensure ScrollTrigger is registered
            gsap.registerPlugin(ScrollTrigger);

            gsap.to(".circle-1", {
                scrollTrigger: {
                    trigger: ".page-overview",
                    start: "top bottom", // Starts when Explore section enters view
                    end: "center center", // Ends when Explore section is centered
                    scrub: 1
                },
                top: "50%",
                left: "50%",
                right: "auto", // Clear right positioning
                xPercent: -50,
                yPercent: -50,
                scale: 1.8, // Larger scale for background effect
                opacity: 0.3, // Slightly more visible
                ease: "none"
            });
        }

        // ====================
        // DARK MODE TOGGLE & ANIMATION (MULTI-BUTTON)
        // ====================
        function initThemeToggle() {
            const toggleBtns = document.querySelectorAll('.theme-toggle'); // Select ALL toggles
            const doc = document.documentElement;

            // 1. Check Storage / System Preference
            const savedTheme = localStorage.getItem('theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
                doc.setAttribute('data-theme', 'dark');
                updateIcons(true); // Set initial icon state
            } else {
                updateIcons(false);
            }

            // 2. Button Intro Animation
            toggleBtns.forEach(btn => {
                gsap.to(btn, {
                    opacity: 1,
                    duration: 0.8,
                    delay: 0.5,
                    ease: "power3.out",
                    startAt: { opacity: 0 }
                });

                // 3. Click Handler
                btn.addEventListener('click', () => {
                    const isDark = doc.getAttribute('data-theme') === 'dark';

                    // Animate ALL buttons
                    toggleBtns.forEach(b => {
                        gsap.to(b, { rotation: "+=180", duration: 0.5, ease: "back.out(1.5)" });
                    });

                    if (isDark) {
                        // Switch to Light
                        doc.removeAttribute('data-theme');
                        localStorage.setItem('theme', 'light');
                        updateIcons(false);
                    } else {
                        // Switch to Dark
                        doc.setAttribute('data-theme', 'dark');
                        localStorage.setItem('theme', 'dark');
                        updateIcons(true);
                    }

                    // Update Nav Style immediately
                    updateNavStyle();
                });
            });

            // Helper to update icons on ALL buttons
            function updateIcons(isDark) {
                toggleBtns.forEach(btn => {
                    const sunIcon = btn.querySelector('.sun-icon');
                    const moonIcon = btn.querySelector('.moon-icon');

                    if (!sunIcon || !moonIcon) return;

                    if (isDark) {
                        // Show Moon, Hide Sun
                        gsap.to(sunIcon, {
                            scale: 0, duration: 0.2,
                            onComplete: () => {
                                sunIcon.style.display = 'none';
                                moonIcon.style.display = 'block';
                                gsap.fromTo(moonIcon, { scale: 0, rotation: 90 },
                                    { scale: 1, rotation: 0, duration: 0.4, ease: "back.out(2)" });
                            }
                        });
                    } else {
                        // Show Sun, Hide Moon
                        gsap.to(moonIcon, {
                            scale: 0, duration: 0.2,
                            onComplete: () => {
                                moonIcon.style.display = 'none';
                                sunIcon.style.display = 'block';
                                gsap.fromTo(sunIcon, { scale: 0, rotation: -90 },
                                    { scale: 1, rotation: 0, duration: 0.4, ease: "back.out(2)" });
                            }
                        });
                    }
                });
            }
        }

        initThemeToggle();
        // Run initial nav style check
        setTimeout(updateNavStyle, 100);

        // ====================
        // CARDS ANIMATION
        // ====================
        function initCardsAnimation() {
            if (!document.querySelector('.cards-section')) return;

            gsap.registerPlugin(ScrollTrigger);

            let mm = gsap.matchMedia();

            mm.add("(min-width: 769px)", () => {

                // Vertical cards timeline with scrub
                const cardsTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".vertical-cards-row",
                        start: "top 80%",   // Start when row top hits 80% viewport
                        end: "bottom 60%",  // End when row bottom hits 60% viewport
                        scrub: 1            // Tie animation to scroll progress
                    }
                });

                // Left card from left
                cardsTl.fromTo(".card-left",
                    { x: -100, opacity: 0 },
                    { x: 0, opacity: 1, duration: 1, ease: "power2.out" }
                )
                    // Center card from bottom (with slight overlap)
                    .fromTo(".card-center",
                        { y: 100, opacity: 0 },
                        { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
                        "<+0.2" // Start 0.2s after previous start (in scroll distance terms)
                    )
                    // Right card from right (with slight overlap)
                    .fromTo(".card-right",
                        { x: 100, opacity: 0 },
                        { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
                        "<+0.2"
                    );

                // Horizontal Card Scale Animation with scrub
                gsap.fromTo(".card-horizontal",
                    { scale: 0.8, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: ".horizontal-card-row",
                            start: "top 85%",
                            end: "bottom 70%",
                            scrub: 1
                        }
                    }
                );
            });
        }

        initCardsAnimation();

        // ====================
        // STEPS SECTION PINNING
        // ====================
        function initStepsAnimation() {
            const section = document.querySelector('.steps-section');
            if (!section) return;

            // Ensure ScrollTrigger is registered
            gsap.registerPlugin(ScrollTrigger);

            let mm = gsap.matchMedia();

            mm.add("(min-width: 969px)", () => {
                ScrollTrigger.create({
                    trigger: ".steps-section",
                    start: "top top",
                    end: "bottom bottom",
                    pin: ".steps-left",
                    pinSpacing: false, // Important if we want it to float over/alongside
                    scrub: 1, // Smooth out pinning movement
                    anticipatePin: 1
                });
            });

            // Mobile Logic (max-width: 968px)
            mm.add("(max-width: 968px)", () => {
                // Pin the header at the top
                ScrollTrigger.create({
                    trigger: ".steps-section",
                    start: "top top",
                    end: "bottom bottom",
                    pin: ".steps-left",
                    pinSpacing: false, // Allow content to scroll under
                    scrub: 1,
                    anticipatePin: 1
                });

                // Animate cards fading out as they go under the header
                const cards = gsap.utils.toArray(".step-card");

                cards.forEach(card => {
                    gsap.to(card, {
                        scrollTrigger: {
                            trigger: card,
                            start: "top 60%", // Start fading much earlier oppure 80%
                            end: "top 40%",   // Fully invisible before hitting the top header area (safely below text)
                            scrub: 1,
                            toggleActions: "play reverse play reverse"
                        },
                        opacity: 0,
                        scale: 0.8,
                        y: -50,
                        ease: "none"
                    });
                });
            });
        }

        initStepsAnimation();

        // ====================
        // CONTACT FORM HANDLING
        // ====================
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const submitBtn = this.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;

                // Visual feedback
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';

                const formData = new FormData(this);

                fetch('send_email.php', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Success handling
                            alert('Message sent successfully!');
                            this.reset();

                            // Optional: success animation or toast could be added here
                        } else {
                            // Error handling
                            alert(data.message || 'Error sending message.');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('An error occurred. Please try again later.');
                    })
                    .finally(() => {
                        // Reset button state
                        submitBtn.textContent = originalBtnText;
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                    });
            });
        }

        // ====================
        // PROJECT CARDS ANIMATION
        // ====================
        function initProjectCardsAnimation() {
            const projectCards = document.querySelectorAll('.project-card');
            if (projectCards.length === 0) return;

            gsap.registerPlugin(ScrollTrigger);

            // Set initial state
            gsap.set(".project-card", { y: 50, opacity: 0 });

            ScrollTrigger.batch(".project-card", {
                start: "top 85%", // Trigger when top of card hits 85% of viewport
                onEnter: batch => gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.15,
                    duration: 0.8,
                    ease: "power3.out",
                    overwrite: true
                }),
                // Optional: markers: true 
            });
        }

        initProjectCardsAnimation();

        // ====================
        // TRANSLATION LOGIC
        // ====================
        async function initTranslation() {
            const langBtns = document.querySelectorAll('.lang-toggle');
            let currentLang = localStorage.getItem('lang') || 'en';

            const loadTranslations = async (lang) => {
                try {
                    const response = await fetch(`language/${lang}.json`);
                    if (!response.ok) throw new Error('Network error');
                    const translations = await response.json();

                    document.querySelectorAll('[data-i18n]').forEach(el => {
                        const key = el.getAttribute('data-i18n');
                        if (translations[key]) el.textContent = translations[key];
                    });
                } catch (error) {
                    console.error('Translation error:', error);
                }
            };

            langBtns.forEach(btn => {
                btn.textContent = currentLang === 'en' ? 'EN' : 'IT';
                // Fade-in animation to match other elements
                gsap.to(btn, {
                    opacity: 1,
                    duration: 0.8,
                    delay: 0.5,
                    ease: "power3.out",
                    startAt: { opacity: 0 }
                });
            });
            loadTranslations(currentLang);

            langBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    currentLang = currentLang === 'en' ? 'it' : 'en';
                    const nextText = currentLang === 'en' ? 'EN' : 'IT';

                    langBtns.forEach(b => {
                        gsap.to(b, {
                            opacity: 0,
                            y: -5,
                            duration: 0.15,
                            onComplete: () => {
                                b.textContent = nextText;
                                gsap.fromTo(b, { y: 5, opacity: 0 }, { y: 0, opacity: 1, duration: 0.15 });
                            }
                        });
                    });

                    localStorage.setItem('lang', currentLang);
                    loadTranslations(currentLang);
                });
            });
        }

        initTranslation();
    }

});

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('threejs-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const COUNT = 8000;
    const positions = new Float32Array(COUNT * 3);
    const targets = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) speeds[i] = 0.005 + Math.random() * 0.015;

    const palette = [
        new THREE.Color('#E9B44C'), // Giallo/Oro (accent-2)
        new THREE.Color('#DE8D3E'),
        new THREE.Color('#D16937'),
        new THREE.Color('#C1502E'), // Arancio/Rosso (accent-1)
        new THREE.Color('#B03C20'), // Ancora un po' più scuro
    ];

    for (let i = 0; i < COUNT; i++) {
        const c = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }

    function genSphere(out) {
        // Riduci il raggio su mobile (ad es. schermo < 768px)
        const isMobile = window.innerWidth <= 768;
        const baseR = isMobile ? 1.2 : 2; // Raggio base
        const spread = isMobile ? 0.2 : 0.3; // Diffusione

        for (let i = 0; i < COUNT; i++) {
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            const r = baseR + (Math.random() - 0.5) * spread;
            out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            out[i * 3 + 2] = r * Math.cos(phi);
        }
    }

    function genML(out) {
        const M = [
            [-1, -1], [-1, 1], [-0.5, 0], [0, 1], [0, -1]
        ];
        const L = [
            [-0.7, 1], [-0.7, -1], [0.3, -1]
        ];

        function getSegments(pts) {
            const segs = [];
            for (let i = 0; i < pts.length - 1; i++) {
                const ax = pts[i][0], ay = pts[i][1];
                const bx = pts[i + 1][0], by = pts[i + 1][1];
                const len = Math.hypot(bx - ax, by - ay);
                segs.push({ ax, ay, bx, by, len });
            }
            return segs;
        }

        function totalLen(segs) { return segs.reduce((s, sg) => s + sg.len, 0); }

        function sampleSegments(segs, n, offsetX, out, start) {
            const total = totalLen(segs);
            for (let i = 0; i < n; i++) {
                let r = Math.random() * total;
                for (const sg of segs) {
                    if (r <= sg.len) {
                        const t = r / sg.len;
                        const x = (sg.ax + (sg.bx - sg.ax) * t) * 1.1 + offsetX;
                        const y = (sg.ay + (sg.by - sg.ay) * t) * 1.1;
                        const idx = (start + i) * 3;
                        out[idx] = x;
                        out[idx + 1] = y;
                        out[idx + 2] = (Math.random() - 0.5) * 0.08;
                        break;
                    }
                    r -= sg.len;
                }
            }
        }

        const mSegs = getSegments(M);
        const lSegs = getSegments(L);
        const half = Math.floor(COUNT / 2);

        sampleSegments(mSegs, half, -1.3, out, 0);
        sampleSegments(lSegs, COUNT - half, 1.1, out, half);
    }

    function genGalaxy(out) {
        for (let i = 0; i < COUNT; i++) {
            const arm = Math.floor(Math.random() * 3);
            const t = Math.random();
            const angle = t * Math.PI * 4 + (arm * Math.PI * 2) / 3;
            const radius = 0.3 + t * 2.5;
            const spread = (1 - t) * 0.2 + 0.05;
            out[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * spread;
            out[i * 3 + 1] = (Math.random() - 0.5) * 0.25;
            out[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * spread;
        }
    }

    function genChaos(out) {
        // Espandi l'area su mobile
        const isMobile = window.innerWidth <= 768;
        const spreadMultipler = isMobile ? 12 : 6; // Moltiplicatore per far allargare di più la scena mobile
        for (let i = 0; i < COUNT; i++) {
            out[i * 3] = (Math.random() - 0.5) * spreadMultipler;
            out[i * 3 + 1] = (Math.random() - 0.5) * spreadMultipler;
            out[i * 3 + 2] = (Math.random() - 0.5) * spreadMultipler;
        }
    }

    function genCode(out) {
        const Left = [
            [-1.2, 0.8], [-1.8, 0], [-1.2, -0.8]
        ];
        const Slash = [
            [-0.1, -1], [0.1, 1]
        ];
        const Right = [
            [1.2, 0.8], [1.8, 0], [1.2, -0.8]
        ];

        function getSegments(pts) {
            const segs = [];
            for (let i = 0; i < pts.length - 1; i++) {
                const ax = pts[i][0], ay = pts[i][1];
                const bx = pts[i + 1][0], by = pts[i + 1][1];
                const len = Math.hypot(bx - ax, by - ay);
                segs.push({ ax, ay, bx, by, len });
            }
            return segs;
        }

        function totalLen(segs) { return segs.reduce((s, sg) => s + sg.len, 0); }

        function sampleSegments(segs, n, offsetX, out, start) {
            const total = totalLen(segs);
            const isMobile = window.innerWidth <= 768;
            const scale = isMobile ? 0.5 : 1.1; // Riduci del 50% circa su schermi piccoli

            for (let i = 0; i < n; i++) {
                let r = Math.random() * total;
                for (const sg of segs) {
                    if (r <= sg.len) {
                        const t = r / sg.len;
                        const x = ((sg.ax + (sg.bx - sg.ax) * t) * scale) + (offsetX * (isMobile ? 0.5 : 1));
                        const y = (sg.ay + (sg.by - sg.ay) * t) * scale;
                        const idx = (start + i) * 3;
                        out[idx] = x;
                        out[idx + 1] = y;
                        out[idx + 2] = (Math.random() - 0.5) * 0.08;
                        break;
                    }
                    r -= sg.len;
                }
            }
        }

        const LSegs = getSegments(Left);
        const SSegs = getSegments(Slash);
        const RSegs = getSegments(Right);

        const third = Math.floor(COUNT / 3);
        sampleSegments(LSegs, third, 0, out, 0);
        sampleSegments(SSegs, third, 0, out, third);
        sampleSegments(RSegs, COUNT - (third * 2), 0, out, third * 2);
    }

    const generators = { sphere: genSphere, ml: genML, galaxy: genGalaxy, chaos: genChaos, code: genCode };

    genChaos(positions);
    genSphere(targets);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.018,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.NormalBlending, // Changed from Additive to ensure it shows up well on light themes too
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(3000 * 3);
    for (let i = 0; i < starPos.length; i++) starPos[i] = (Math.random() - 0.5) * 80;
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.04, color: 0xaaaacc, transparent: true, opacity: 0.4, depthWrite: false });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    let mouse = { x: 0, y: 0 };
    document.addEventListener('mousemove', e => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    document.addEventListener('touchmove', e => {
        const t = e.touches[0];
        mouse.x = (t.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = -(t.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    const modes = ['sphere', 'ml', 'galaxy', 'chaos', 'code'];
    let currentModeIdx = 0;

    // Detect if we are in the projects page
    const isProjects = document.querySelector('.project-grid') !== null;

    // Set initial mode
    if (isProjects) {
        generators['code'](targets);
    } else {
        generators['chaos'](targets);
    }

    // GSAP ScrollTrigger for Three.js Background changes
    if (isProjects) {
        // Nessun cambio di forma in projects.html, resta su "code"
    } else if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        let mm = gsap.matchMedia();

        mm.add("(min-width: 769px)", () => {
            // Hero -> Chaos
            ScrollTrigger.create({
                trigger: ".hero",
                start: "top center",
                onEnter: () => generators['chaos'](targets),
                onEnterBack: () => generators['chaos'](targets)
            });

            // Features Cards -> Sphere
            ScrollTrigger.create({
                trigger: ".cards-section",
                start: "top center",
                onEnter: () => generators['sphere'](targets),
                onEnterBack: () => generators['sphere'](targets)
            });

            // Passaggi Fondamentali -> Sphere (Maintains sphere)
            ScrollTrigger.create({
                trigger: ".steps-section",
                start: "top center",
                onEnter: () => generators['sphere'](targets),
                onEnterBack: () => generators['sphere'](targets)
            });

            // Filler/CTA -> Galaxy
            ScrollTrigger.create({
                trigger: ".filler-section",
                start: "top center",
                onEnter: () => generators['galaxy'](targets),
                onEnterBack: () => generators['galaxy'](targets)
            });
        });

        // Mobile Logic (max-width: 768px)
        mm.add("(max-width: 768px)", () => {
            // Hero -> Chaos
            ScrollTrigger.create({
                trigger: ".hero",
                start: "top center",
                onEnter: () => generators['chaos'](targets),
                onEnterBack: () => generators['chaos'](targets)
            });

            // Features Cards -> Sphere
            ScrollTrigger.create({
                trigger: ".cards-section",
                start: "top center",
                onEnter: () => generators['sphere'](targets),
                onEnterBack: () => generators['sphere'](targets)
            });

            // Passaggi Fondamentali -> Galaxy (Mobile Only)
            ScrollTrigger.create({
                trigger: ".steps-section",
                start: "top center",
                onEnter: () => generators['galaxy'](targets),
                onEnterBack: () => generators['galaxy'](targets)
            });

            // Filler/CTA -> Sphere (Mobile Only)
            ScrollTrigger.create({
                trigger: ".filler-section",
                start: "top center",
                onEnter: () => generators['sphere'](targets),
                onEnterBack: () => generators['sphere'](targets)
            });
        });

    } else {
        // Fallback to time interval if GSAP not loaded
        setInterval(() => {
            currentModeIdx = (currentModeIdx + 1) % modes.length;
            let mode = modes[currentModeIdx];
            generators[mode](targets);
        }, 5000);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    let t = 0;
    const posAttr = geometry.attributes.position;

    function animate() {
        requestAnimationFrame(animate);
        t += 0.005;

        for (let i = 0; i < COUNT; i++) {
            const s = speeds[i];
            positions[i * 3] += (targets[i * 3] - positions[i * 3]) * s;
            positions[i * 3 + 1] += (targets[i * 3 + 1] - positions[i * 3 + 1]) * s;
            positions[i * 3 + 2] += (targets[i * 3 + 2] - positions[i * 3 + 2]) * s;
        }
        posAttr.needsUpdate = true;

        particles.rotation.y += 0.0015 + mouse.x * 0.0005;
        particles.rotation.x += mouse.y * 0.0003;

        const breathe = 1 + Math.sin(t * 0.8) * 0.03;
        particles.scale.setScalar(breathe);

        material.opacity = 0.7 + Math.sin(t * 1.2) * 0.15;

        stars.rotation.y += 0.0002;

        renderer.render(scene, camera);
    }

    animate();
});

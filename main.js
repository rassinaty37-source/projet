// main.js — animations et gestion du formulaire
document.addEventListener("DOMContentLoaded", () => {
  // === Background 3D canvas ===
  const canvas = document.getElementById('bg3d');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const num = Math.max(60, Math.floor((W * H) / 20000));
    const particles = [];
    const fov = 600;

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < num; i++) {
        particles.push({
          x: rand(-W, W),
          y: rand(-H, H),
          z: rand(100, 2000),
          r: rand(0.6, 2.4),
          hue: rand(10, 220)
        });
      }
    }

    function project(p) {
      const scale = fov / (fov + p.z);
      return { x: (p.x * scale) + W / 2, y: (p.y * scale) + H / 2, s: scale };
    }

    let angle = 0;
    function render() {
      ctx.clearRect(0,0,W,H);
      angle += 0.0025;
      const cosA = Math.cos(angle), sinA = Math.sin(angle);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // Rotate around Y and X
        const x = p.x * cosA - p.z * sinA;
        const z = p.x * sinA + p.z * cosA;
        const y = p.y * Math.cos(angle*0.6) - z * Math.sin(angle*0.001);
        const proj = project({ x: x, y: y, z: z });

        const alpha = Math.max(0, Math.min(1, (1 - z/2500) )) * 0.9;
        const size = p.r * (1.2 - proj.s) * 2.4;

        // Dessin thématique pétrole : gouttes sombres avec reflet
        ctx.beginPath();
        const gradRadius = Math.max(6, size * 6);
        const g = ctx.createRadialGradient(proj.x - gradRadius*0.25, proj.y - gradRadius*0.35, 0, proj.x, proj.y, gradRadius);
        if (p.type === 'drop') {
          // centre très sombre, bord transparent, petit reflet clair
          g.addColorStop(0, `rgba(255,255,255,${0.6 * alpha})`);
          g.addColorStop(0.08, `rgba(255,255,255,${0.18 * alpha})`);
          g.addColorStop(0.15, `rgba(40,28,18,${0.9 * alpha})`);
          g.addColorStop(0.6, `rgba(12,10,8,${0.85 * alpha})`);
          g.addColorStop(1, `rgba(12,10,8,0)`);
          ctx.fillStyle = g;
          // Dessiner une forme ovale pour imiter une goutte
          ctx.ellipse(proj.x, proj.y, Math.max(2, size*4), Math.max(2, size*6), angle*0.3, 0, Math.PI*2);
          ctx.fill();
          // petit point de lumière
          ctx.beginPath();
          ctx.fillStyle = `rgba(255,255,255,${0.12 * alpha})`;
          ctx.ellipse(proj.x - gradRadius*0.25, proj.y - gradRadius*0.35, Math.max(1, size*1.2), Math.max(1, size*0.8), 0, 0, Math.PI*2);
          ctx.fill();
        } else {
          // petites particules plus claires (reflets huileux loin)
          g.addColorStop(0, `rgba(255,200,120,${0.6 * alpha})`);
          g.addColorStop(0.2, `rgba(80,60,40,${0.6 * alpha})`);
          g.addColorStop(1, `rgba(80,60,40,0)`);
          ctx.fillStyle = g;
          ctx.arc(proj.x, proj.y, Math.max(1, size*3), 0, Math.PI*2);
          ctx.fill();
        }

        // Move forward slowly
        p.z -= 0.6;
        if (p.z < 50) p.z = rand(1200, 2200);
      }
      requestAnimationFrame(render);
    }

    window.addEventListener('resize', () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initParticles();
    });

    initParticles();
    render();
  }

  // Intersection Observer pour révéler les éléments avec la classe .hidden
  const elementsToAnimate = document.querySelectorAll('.hidden');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  elementsToAnimate.forEach((element) => observer.observe(element));

  // Effet de saisie (typing) pour le nom dans le hero
  const heroTitle = document.querySelector('.hero-text h1');
  if (heroTitle) {
    const fullText = heroTitle.textContent.trim();
    heroTitle.textContent = '';
    let idx = 0;
    const speed = 60;
    (function type() {
      if (idx < fullText.length) {
        heroTitle.textContent += fullText.charAt(idx++);
        setTimeout(type, speed);
      }
    })();
  }

  // Validation simple et confirmation sur la page contact
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nom = contactForm.querySelector('input[name="nom"]').value.trim();
      const prenom = contactForm.querySelector('input[name="prenom"]').value.trim();
      const email = contactForm.querySelector('input[name="email"]').value.trim();
      if (!nom || !prenom || !email) {
        alert('Veuillez remplir le nom, le prénom et l\'email.');
        return;
      }
      contactForm.innerHTML = `<p class="success">Merci ${prenom} ${nom}, nous avons bien reçu votre message.</p><a href="index.html" class="btn">Retour au portfolio</a>`;
    });
  }
});

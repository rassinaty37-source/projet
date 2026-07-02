 
// script.js — animations et gestion du formulaire
document.addEventListener("DOMContentLoaded", () => {
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
    elementsToAnimate.forEach((el) => observer.observe(el));

    // Effet de saisie (typing) pour le titre du hero
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const fullText = heroTitle.textContent.trim();
        heroTitle.textContent = '';
        let i = 0;
        const speed = 60;
        (function type() {
            if (i < fullText.length) {
                heroTitle.textContent += fullText.charAt(i++);
                setTimeout(type, speed);
            }
        })();
    }

    // Gestion du formulaire de contact
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
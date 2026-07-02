document.addEventListener("DOMContentLoaded", () => {

    /* ===================================================
       1. OUVERTURE / FERMETURE DE LA FICHE DE CONTACT
       =================================================== */
    const modal = document.getElementById("contactModal");
    const openBtn = document.getElementById("btnContact");
    const closeBtn = document.querySelector(".close-modal");

    // Affiche la boîte de contact au clic (passe de 'none' à 'flex')
    openBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    // Ferme la boîte en cliquant sur la croix
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Ferme la boîte si on clique à côté du formulaire
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    /* ===================================================
       2. RECONNAISSANCE DU SCROLL (APPARITION FLUIDE)
       =================================================== */
    const sections = document.querySelectorAll(".scroll-section");

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show"); // Active l'effet CSS
                sectionObserver.unobserve(entry.target); // Libère la mémoire
            }
        });
    }, {
        threshold: 0.15 // Se lance quand 15% de la section est visible
    });

    sections.forEach(section => sectionObserver.observe(section));
});
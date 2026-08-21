/* Navigation mobile + newsletter factice, communs à toutes les pages. */
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav.main-nav');
    if (toggle && nav) {
        toggle.addEventListener('click', () => nav.classList.toggle('open'));
        nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
    }

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('button');
            const original = btn.textContent;
            btn.textContent = 'Merci ! ✓';
            btn.disabled = true;
            setTimeout(() => { btn.textContent = original; btn.disabled = false; newsletterForm.reset(); }, 2500);
        });
    }

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const original = btn.textContent;
            btn.textContent = 'Message envoyé ✓';
            setTimeout(() => { btn.textContent = original; contactForm.reset(); }, 2500);
        });
    }
});

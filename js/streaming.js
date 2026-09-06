document.addEventListener('DOMContentLoaded', () => {
    // Mobile nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('open'));
        });
    }

    // FAQ accordion
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-q');
        question.addEventListener('click', () => {
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });

    // Billing toggle (monthly / annual)
    const switchEl = document.querySelector('.switch');
    const monthlyLabel = document.querySelector('[data-billing="monthly"]');
    const annualLabel = document.querySelector('[data-billing="annual"]');
    const priceEls = document.querySelectorAll('[data-monthly][data-annual]');

    function setBilling(annual) {
        priceEls.forEach(el => {
            el.textContent = annual ? el.dataset.annual : el.dataset.monthly;
        });
        document.querySelectorAll('[data-period]').forEach(el => {
            el.textContent = annual ? '/ an' : '/ mois';
        });
        if (monthlyLabel) monthlyLabel.classList.toggle('active', !annual);
        if (annualLabel) annualLabel.classList.toggle('active', annual);
        if (switchEl) switchEl.classList.toggle('on', annual);
    }

    if (switchEl) {
        switchEl.addEventListener('click', () => setBilling(!switchEl.classList.contains('on')));
    }

    // Countdown timer — resets softly to always show urgency
    const countdown = document.querySelector('.countdown');
    if (countdown) {
        const hoursEl = countdown.querySelector('[data-h]');
        const minEl = countdown.querySelector('[data-m]');
        const secEl = countdown.querySelector('[data-s]');

        let storedTarget = parseInt(localStorage.getItem('offerTarget') || '0', 10);
        const now = Date.now();
        if (!storedTarget || storedTarget < now) {
            storedTarget = now + 1000 * 60 * 60 * 6; // 6h window
            localStorage.setItem('offerTarget', String(storedTarget));
        }

        function tick() {
            const diff = Math.max(0, storedTarget - Date.now());
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
            if (minEl) minEl.textContent = String(m).padStart(2, '0');
            if (secEl) secEl.textContent = String(s).padStart(2, '0');
        }
        tick();
        setInterval(tick, 1000);
    }

    // Reveal on scroll
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach(el => observer.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('in-view'));
    }
});

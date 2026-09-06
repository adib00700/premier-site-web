// URL du backend d'automation (voir server/README.md pour le déployer).
// À remplacer par l'URL publique une fois le service déployé (Render/Railway/...).
const ORDER_API_URL = 'https://REMPLACE-PAR-TON-BACKEND.exemple.com/api/orders';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('order-form');
    if (!form) return;

    const statusEl = document.getElementById('order-status');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        statusEl.textContent = '';
        statusEl.className = 'order-status';

        const submitBtn = form.querySelector('button[type="submit"]');
        const payload = {
            name: form.name.value.trim(),
            phone: form.phone.value.trim(),
        };

        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';

        try {
            const res = await fetch(ORDER_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data.error || 'Une erreur est survenue.');
            }

            statusEl.textContent = 'Votre essai gratuit a été envoyé sur WhatsApp ! Vérifiez vos messages.';
            statusEl.classList.add('order-status-success');
            form.reset();
        } catch (err) {
            statusEl.textContent = "Impossible d'envoyer votre essai pour le moment. Réessayez dans un instant ou contactez le support.";
            statusEl.classList.add('order-status-error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Recevoir mon essai gratuit sur WhatsApp';
        }
    });
});

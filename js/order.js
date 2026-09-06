// URL du backend d'automation (voir server/README.md pour le déployer).
// À remplacer par l'URL publique une fois le service déployé (Render/Railway/...).
const ORDER_API_URL = 'https://REMPLACE-PAR-TON-BACKEND.exemple.com/api/orders';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('order-form');
    if (!form) return;

    const packageSelect = document.getElementById('order-package');
    const statusEl = document.getElementById('order-status');

    // Pré-sélectionne la formule choisie depuis les boutons de tarifs.
    document.querySelectorAll('[data-package]').forEach((el) => {
        el.addEventListener('click', () => {
            if (packageSelect) packageSelect.value = el.dataset.package;
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        statusEl.textContent = '';
        statusEl.className = 'order-status';

        const submitBtn = form.querySelector('button[type="submit"]');
        const payload = {
            name: form.name.value.trim(),
            phone: form.phone.value.trim(),
            packageId: form.packageId.value,
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

            statusEl.textContent = 'Vos accès ont été envoyés sur WhatsApp ! Vérifiez vos messages.';
            statusEl.classList.add('order-status-success');
            form.reset();
        } catch (err) {
            statusEl.textContent = "Impossible d'envoyer vos accès pour le moment. Réessayez dans un instant ou contactez le support.";
            statusEl.classList.add('order-status-error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Recevoir mes accès sur WhatsApp';
        }
    });
});

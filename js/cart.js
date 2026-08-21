/* Panier simple basé sur localStorage — pas de backend, juste pour la démo visuelle. */
const CART_KEY = 'ete_boutique_cart';

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(productId, color, size, qty) {
    const cart = getCart();
    const existing = cart.find(item => item.productId === productId && item.color === color && item.size === size);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ productId, color, size, qty });
    }
    saveCart(cart);
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCartPage();
}

function cartCount() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = cartCount();
    });
}

function renderCartPage() {
    const container = document.getElementById('cartItems');
    const summaryEl = document.getElementById('cartSummary');
    if (!container) return;

    const cart = getCart();
    if (cart.length === 0) {
        container.innerHTML = '<div class="cart-empty">Ton panier est vide pour le moment.<br><br><a href="collection.html" class="btn btn-primary">Découvrir la collection</a></div>';
        if (summaryEl) summaryEl.style.display = 'none';
        return;
    }

    if (summaryEl) summaryEl.style.display = '';

    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        const product = findProduct(item.productId);
        if (!product) return '';
        const lineTotal = product.price * item.qty;
        total += lineTotal;
        return `
            <div class="cart-item">
                ${productPhotoHTML(product)}
                <div>
                    <h3 style="font-size:16px;margin-bottom:4px;">${product.name}</h3>
                    <div style="font-size:13px;color:var(--ink-soft);">Couleur : ${item.color} · Taille : ${item.size} · Qté : ${item.qty}</div>
                    <div style="font-weight:600;margin-top:6px;">${formatPrice(lineTotal)}</div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">Retirer</button>
            </div>
        `;
    }).join('');

    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = formatPrice(total);
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    renderCartPage();
});

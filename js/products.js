/* Catalogue produit — modifie/ajoute des robes ici, tout le site se met à jour. */
const PRODUCTS = [
    {
        id: 'nuance-fuchsia',
        name: 'Robe Nuance',
        price: 69.9,
        oldPrice: 89.9,
        image: 'images/nuance-fuchsia.png',
        gradient: 'grad-fuchsia',
        colorFamily: 'rose',
        colors: [
            { name: 'Rose bohème', hex: '#e8408a' },
            { name: 'Corail', hex: '#ff6f4f' }
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        style: 'fluide',
        isNew: true,
        isBestseller: true,
        description: "Robe longue à manches bouffantes et large ceinture, imprimé bohème rose et doré. Une pièce raffinée pour illuminer vos soirées d'été.",
        composition: '100% viscose écoresponsable, doublure intérieure.'
    },
    {
        id: 'soleil-jaune',
        name: 'Robe Soleil',
        price: 59.9,
        oldPrice: null,
        image: 'images/soleil-jaune.png',
        gradient: 'grad-jaune',
        colorFamily: 'jaune',
        colors: [
            { name: 'Jaune soleil', hex: '#ffc145' },
            { name: 'Corail', hex: '#ff6f4f' }
        ],
        sizes: ['S', 'M', 'L'],
        style: 'imprime',
        isNew: true,
        isBestseller: false,
        description: 'Robe longue à motifs fleuris, décolleté croisé et bretelles fines. Parfaite pour une balade au coucher du soleil.',
        composition: '95% coton, 5% élasthanne.'
    },
    {
        id: 'riviera-bleu',
        name: 'Robe Riviera',
        price: 64.9,
        oldPrice: 79.9,
        image: 'images/riviera-bleu.png',
        gradient: 'grad-bleu',
        colorFamily: 'bleu',
        colors: [
            { name: 'Bleu royal', hex: '#2140b4' },
            { name: 'Blanc', hex: '#ffffff' }
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        style: 'a-pois',
        isNew: false,
        isBestseller: true,
        description: 'Robe midi à pois, taille cintrée par une ceinture nouée. Ouverture jambe latérale pour plus de liberté de mouvement.',
        composition: '100% coton biologique.'
    },
    {
        id: 'emeraude-longue',
        name: 'Robe Émeraude',
        price: 74.9,
        oldPrice: null,
        gradient: 'grad-emeraude',
        colorFamily: 'vert',
        colors: [
            { name: 'Émeraude', hex: '#0a8f5f' },
            { name: 'Turquoise', hex: '#23c1b2' }
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        style: 'fluide',
        isNew: false,
        isBestseller: true,
        description: "Robe longue drapée, col en V et taille ajustable. Une pièce intemporelle pour illuminer chaque tenue d'été.",
        composition: '100% viscose, finitions dentelle.'
    },
    {
        id: 'lagon-turquoise',
        name: 'Robe Lagon',
        price: 54.9,
        oldPrice: 69.9,
        gradient: 'grad-turquoise',
        colorFamily: 'bleu',
        colors: [
            { name: 'Turquoise', hex: '#23c1b2' },
            { name: 'Blanc', hex: '#ffffff' }
        ],
        sizes: ['XS', 'S', 'M'],
        style: 'courte',
        isNew: true,
        isBestseller: false,
        description: 'Robe courte évasée, idéale pour les journées ensoleillées en ville comme en bord de mer.',
        composition: '100% lin.'
    },
    {
        id: 'corail-maxi',
        name: 'Robe Corail Maxi',
        price: 79.9,
        oldPrice: null,
        image: 'images/corail-maxi.png',
        gradient: 'grad-corail',
        colorFamily: 'orange',
        colors: [
            { name: 'Corail', hex: '#ff6f4f' },
            { name: 'Jaune soleil', hex: '#ffc145' }
        ],
        sizes: ['M', 'L', 'XL'],
        style: 'fluide',
        isNew: false,
        isBestseller: true,
        description: 'Robe longue à fines bretelles et bordure florale, coupe ample et fluide. Un imprimé solaire qui capte tous les regards.',
        composition: '100% viscose.'
    },
    {
        id: 'fuchsia-courte',
        name: 'Robe Fuchsia Courte',
        price: 49.9,
        oldPrice: 59.9,
        image: 'images/fuchsia-courte.png',
        gradient: 'grad-fuchsia',
        colorFamily: 'rose',
        colors: [
            { name: 'Blanc fleuri', hex: '#f6a6c9' }
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        style: 'courte',
        isNew: true,
        isBestseller: false,
        description: 'Robe courte évasée à imprimé fleuri, sans manches. Légère et confortable pour les journées ensoleillées.',
        composition: '95% coton, 5% élasthanne.'
    },
    {
        id: 'bleu-imprime',
        name: 'Robe Bleu Imprimé',
        price: 62.9,
        oldPrice: null,
        image: 'images/bleu-imprime.png',
        gradient: 'grad-bleu',
        colorFamily: 'bleu',
        colors: [
            { name: 'Bleu royal', hex: '#2140b4' },
            { name: 'Turquoise', hex: '#23c1b2' }
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        style: 'imprime',
        isNew: false,
        isBestseller: false,
        description: 'Robe portefeuille mi-longue à petit imprimé fleuri, manches courtes volantées et fente jambe.',
        composition: '100% viscose.'
    },
    {
        id: 'denim-chemise',
        name: 'Robe Chemise Denim',
        price: 69.9,
        oldPrice: null,
        image: 'images/denim-chemise.png',
        gradient: 'grad-bleu',
        colorFamily: 'bleu',
        colors: [
            { name: 'Denim', hex: '#5c7fa3' }
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        style: 'chemise',
        isNew: true,
        isBestseller: false,
        description: 'Robe chemise en denim léger, ceinturée à la taille, manches à revers. Un basique intemporel à porter du matin au soir.',
        composition: '100% coton chambray.'
    },
    {
        id: 'noire-cocktail',
        name: 'Robe Noire Cocktail',
        price: 79.9,
        oldPrice: 99.9,
        image: 'images/noire-cocktail.png',
        gradient: 'grad-noir',
        colorFamily: 'noir',
        colors: [
            { name: 'Noir', hex: '#1a1a1a' }
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        style: 'habillee',
        isNew: false,
        isBestseller: true,
        description: 'Robe de cocktail au décolleté cœur et jupe évasée. Une pièce élégante pour les soirées d\'été qui se prolongent tard.',
        composition: '95% polyester, 5% élasthanne, doublure satinée.'
    },
    {
        id: 'nuisette-blanche',
        name: 'Nuisette Blanche',
        price: 29.9,
        oldPrice: null,
        image: 'images/nuisette-blanche.png',
        gradient: 'grad-blanc',
        colorFamily: 'blanc',
        colors: [
            { name: 'Blanc', hex: '#ffffff' }
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        style: 'fluide',
        isNew: true,
        isBestseller: false,
        description: 'Nuisette fine à bretelles fines, coupe droite et fluide. Parfaite seule ou en surperposition légère les soirs d\'été.',
        composition: '95% modal, 5% élasthanne.'
    }
];

function findProduct(id) {
    return PRODUCTS.find(p => p.id === id);
}

function formatPrice(value) {
    return value.toFixed(2).replace('.', ',') + ' €';
}

/* Retourne une balise <img> si le produit a une vraie photo, sinon un dégradé placeholder. */
function productPhotoHTML(p, extraClass) {
    extraClass = extraClass || '';
    if (p.image) {
        return `<img src="${p.image}" alt="${p.name}" class="swatch-photo ${extraClass}">`;
    }
    return `<div class="swatch-photo ${p.gradient} ${extraClass}"><span class="swatch-label">Photo à intégrer</span></div>`;
}

/* Catalogue produit — modifie/ajoute des robes ici, tout le site se met à jour. */
const PRODUCTS = [
    {
        id: 'nuance-fuchsia',
        name: 'Robe Nuance',
        price: 69.9,
        oldPrice: 89.9,
        gradient: 'grad-fuchsia',
        colorFamily: 'rose',
        colors: [
            { name: 'Fuchsia', hex: '#e8408a' },
            { name: 'Corail', hex: '#ff6f4f' }
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        style: 'fluide',
        isNew: true,
        isBestseller: true,
        description: "Une robe longue fluide à fines bretelles, pensée pour les soirées d'été méditerranéennes. Tombé aérien et léger.",
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
        description: 'Robe longue à volants, coupe ample et confortable. Un imprimé solaire qui capte tous les regards.',
        composition: '100% viscose.'
    },
    {
        id: 'fuchsia-courte',
        name: 'Robe Fuchsia Courte',
        price: 49.9,
        oldPrice: 59.9,
        gradient: 'grad-fuchsia',
        colorFamily: 'rose',
        colors: [
            { name: 'Fuchsia', hex: '#e8408a' }
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        style: 'courte',
        isNew: true,
        isBestseller: false,
        description: 'Robe courte cintrée, parfaite pour les cocktails en terrasse. Coupe près du corps et dos nu.',
        composition: '95% coton, 5% élasthanne.'
    },
    {
        id: 'bleu-imprime',
        name: 'Robe Bleu Imprimé',
        price: 62.9,
        oldPrice: null,
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
        description: 'Robe mi-longue à imprimé graphique, bretelles ajustables et jupe évasée.',
        composition: '100% viscose.'
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

# Keloar — Landing page de l'agence web (Montréal)

Site de **Keloar**, agence de création de sites web à Montréal, publié sur
[keloar.com](https://keloar.com) par GitHub Pages (déploiement automatique à chaque
modification de `master`, voir `.github/workflows/static.yml`).

Une seule page élégante et animée, en **HTML, CSS et JavaScript vanilla** : aucune
bibliothèque, aucune étape de compilation.

## Contenu

```
index.html              La landing page : accueil, approche, galerie, services,
                        méthode, secteurs, engagements, tarifs, avis & chiffres,
                        l'agence, FAQ, contact
mentions-legales.html   Mentions légales (Québec, à compléter)
confidentialite.html    Politique de confidentialité (Loi 25, à compléter)
a-propos.html           Redirige vers index.html#agence (anciens liens)
contact.html            Redirige vers index.html#contact (anciens liens)
css/style.css           Tous les styles (couleurs en haut du fichier)
js/main.js              Animations et interactions
images/                 Photos (WebP), favicon, image de partage
sitemap.xml, robots.txt Référencement
CNAME                   Domaine keloar.com
```

## Animations

- **Intro** : le logo apparaît lettre par lettre puis le rideau se lève (version courte
  lors des visites suivantes dans la même session).
- **Titres** : les mots glissent depuis le bas quand le titre arrive à l'écran.
- **Photos** : dévoilement de bas en haut, puis léger effet de profondeur (parallaxe).
- **Manifeste** : le texte s'allume mot par mot au fil du défilement.
- **Services** : au survol, une photo suit la souris (ordinateur uniquement).
- **Méthode** : défilement horizontal des 4 étapes (avec photos) sur grand écran, empilé sur mobile.
- **Galerie** : deux rangées de photos qui glissent en sens inverse au défilement.
- **Fond du haut de page** : dégradé mauve et jaune qui ondule lentement.
- **Détails** : curseur personnalisé, boutons « magnétiques », badge rond qui tourne,
  bandeau défilant, barre de progression de lecture, en-tête qui se cache en descendant,
  grand logo animé en pied de page.

Si l'utilisateur a activé « réduire les animations » dans son système, tout s'affiche
directement, sans mouvement. Sans JavaScript, tout le contenu reste visible.

## Lancer le site en local

```bash
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```

## Personnaliser

### Textes
Tout le contenu est dans `index.html`, section par section (repérez les commentaires
`<!-- ===== SERVICES ===== -->`, etc.). L'en-tête et le pied de page sont aussi présents
dans les deux pages légales : pensez à les modifier aux trois endroits.

### Couleurs et polices
En haut de `css/style.css` :

```css
--bg: #ffffff;         /* blanc, fond principal */
--bg-alt: #e9deeb;     /* mauve pâle (galerie, méthode, avis) */
--bg-yellow: #f5e6b8;  /* jaune pâle (tarifs, FAQ) */
--text: #2b2030;       /* aubergine, texte et sections sombres */
--accent: #7b4a8e;     /* mauve profond (mots en italique) */
--yellow: #e8b931;     /* jaune (accents sur fond sombre, badge) */
```

Les mêmes variables existent pour le mode sombre juste en dessous. Polices : *Instrument
Serif* (titres) et *Inter Tight* (textes), chargées depuis Google Fonts.

### Avis clients et chiffres
Dans `index.html`, section `<!-- ===== AVIS & CHIFFRES ===== -->` :

- **Chiffres** : changez le nombre à deux endroits (`data-count="6"` et le texte `6`),
  puis la légende en dessous.
- **Avis** : les trois cartes en pointillés sont des emplacements vides. Remplacez chacune
  par un vrai avis en suivant le modèle donné en commentaire juste au-dessus, et retirez la
  classe `is-placeholder`. Vous pouvez en ajouter autant que vous voulez.
- N'utilisez que de vrais avis, avec l'accord des clients : les faux témoignages sont
  interdits au Canada (Loi sur la concurrence, Loi sur la protection du consommateur).

### Images
Remplacez les fichiers de `images/` en gardant les mêmes noms (format WebP conseillé,
1600 px de large maximum, `cwebp photo.jpg -q 80 -o photo.webp`).

### Formulaire de contact
Sans configuration, le formulaire valide les champs puis affiche la confirmation
(mode démo) : **aucun message n'est envoyé**. Pour recevoir les demandes, créez un
formulaire gratuit sur [Formspree](https://formspree.io) et collez son URL dans
`data-endpoint=""` du formulaire `#quote-form` de `index.html`.

### Statistiques de visites
Le site ne dépose aucun témoin de suivi. Si vous ajoutez un outil de mesure d'audience,
la Loi 25 exige de demander le consentement avant de l'activer, et de mettre à jour
`confidentialite.html`.

## Mettre en ligne

Toute modification envoyée sur la branche `master` est publiée automatiquement sur
keloar.com en une à deux minutes (onglet **Actions** du dépôt pour suivre).

## Crédits photos

Photos issues d'[Unsplash](https://unsplash.com), utilisées selon la
[licence Unsplash](https://unsplash.com/license) (usage commercial autorisé, sans attribution obligatoire).
Recadrées et converties en WebP :

| Fichier | Photo d'origine |
|---|---|
| `hero.webp` | https://images.unsplash.com/photo-1498050108023-c5249f4df085 |
| `projet-boulangerie.webp` | https://images.unsplash.com/photo-1517433670267-08bbd4be890f |
| `projet-mode.webp` | https://images.unsplash.com/photo-1441986300917-64674bd600d8 |
| `projet-cabinet.webp` | https://images.unsplash.com/photo-1589829545856-d10d557cf95f |
| `projet-yoga.webp` | https://images.unsplash.com/photo-1544367567-0f2fcb009e0b |
| `projet-fromagerie.webp` | https://images.unsplash.com/photo-1452195100486-9cc805987862 |
| `projet-artisan.webp` | https://images.unsplash.com/photo-1503387762-592deb58ef4e |
| `atelier.webp` | https://images.unsplash.com/photo-1460925895917-afdab827c52f |
| `galerie-maquette.webp` | https://images.unsplash.com/photo-1586717791821-3f44a563fa4c |
| `galerie-boutique.webp` | https://images.unsplash.com/photo-1472851294608-062f824d29cc |
| `galerie-couleurs.webp` | https://images.unsplash.com/photo-1561070791-2526d30994b5 |
| `galerie-restaurant.webp` | https://images.unsplash.com/photo-1517248135467-4c7edcad34c4 |
| `galerie-ville.webp` | https://images.unsplash.com/photo-1559682468-a6a29e7d9517 |
| `galerie-equipe.webp`, `etape-1.webp` | https://images.unsplash.com/photo-1522202176988-66273c2fd55f |
| `galerie-bureau.webp` | https://images.unsplash.com/photo-1499951360447-b19be8fe80f5 |
| `galerie-cafe.webp` | https://images.unsplash.com/photo-1556740749-887f6717d7e4 |
| `galerie-design.webp` | https://images.unsplash.com/photo-1558655146-9f40138edfeb |
| `galerie-espace.webp` | https://images.unsplash.com/photo-1497215728101-856f4ea42174 |
| `etape-2.webp` | https://images.unsplash.com/photo-1586717791821-3f44a563fa4c |
| `etape-3.webp` | https://images.unsplash.com/photo-1519389950473-47ba0277781c |
| `etape-4.webp` | https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2 |

N'utilisez pas d'images trouvées sur Pinterest ou Google Images : elles appartiennent à leurs auteurs.

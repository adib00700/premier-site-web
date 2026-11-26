# Keloar — Landing page de l'agence web (Montréal)

Site de **Keloar**, agence de création de sites web à Montréal, publié sur
[keloar.com](https://keloar.com) par GitHub Pages (déploiement automatique à chaque
modification de `master`, voir `.github/workflows/static.yml`).

Une seule page élégante et animée, en **HTML, CSS et JavaScript vanilla** : aucune
bibliothèque, aucune étape de compilation.

## Contenu

```
index.html              La landing page : accueil, approche, services, méthode,
                        secteurs, engagements, tarifs, l'agence, FAQ, contact
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
- **Méthode** : défilement horizontal des 4 étapes sur grand écran, empilé sur mobile.
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
--bg: #f4efe7;      /* fond crème */
--text: #161412;    /* encre */
--accent: #b4462a;  /* terracotta */
```

Les mêmes variables existent pour le mode sombre juste en dessous. Polices : *Instrument
Serif* (titres) et *Inter Tight* (textes), chargées depuis Google Fonts.

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

N'utilisez pas d'images trouvées sur Pinterest ou Google Images : elles appartiennent à leurs auteurs.

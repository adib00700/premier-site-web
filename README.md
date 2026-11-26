# Keloar — Site vitrine de l'agence web (Montréal)

Site vitrine de **Keloar**, agence de création de sites web à Montréal, publié sur
[keloar.com](https://keloar.com) via GitHub Pages (fichier `CNAME`).
Fait en **HTML5, CSS3 et JavaScript vanilla** : aucune dépendance, aucune étape de compilation.

> Les prix, les projets du portfolio, les témoignages, les chiffres clés et l'équipe
> sont des **exemples** à remplacer par vos vraies informations.

## Contenu

```
index.html              Accueil : hero, chiffres, services, méthode, réalisations,
                        tarifs, témoignages, FAQ, appel à l'action
a-propos.html           Histoire, valeurs, équipe
contact.html            Formulaire de soumission + coordonnées, heures, carte
mentions-legales.html   Modèle de mentions légales (Québec, à compléter)
confidentialite.html    Politique de confidentialité et témoins (Loi 25, à compléter)
css/style.css           Tous les styles (variables de couleurs en haut du fichier)
js/main.js              Menu, thème sombre, animations, filtres, carrousel, FAQ,
                        validation du formulaire, bandeau témoins
images/                 Illustrations temporaires (SVG), favicon, image de partage
sitemap.xml, robots.txt Référencement
CNAME                   Domaine personnalisé keloar.com (GitHub Pages)
exercice/               Anciens exercices, sans lien avec le site
```

Fonctionnalités : mode clair/sombre (automatique + bouton), menu burger mobile,
apparition au défilement, compteurs animés, filtres du portfolio, carrousel de témoignages
(boutons, puces, glisser au doigt, pause au survol), FAQ en accordéon, validation du
formulaire avec messages d'erreur, bandeau de témoins (cookies), carte Google Maps chargée
seulement après consentement, données structurées Schema.org, balises Open Graph.

## Lancer le site en local

Dans un terminal, à la racine du dépôt :

```bash
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```

(ou l'extension **Live Server** de VS Code). Un double-clic sur `index.html` fonctionne aussi.

## Personnaliser

### Textes
Les textes sont directement dans les fichiers `.html`. L'en-tête et le pied de page sont
répétés dans chaque page : modifiez les 5 fichiers (un « Rechercher / Remplacer dans tous
les fichiers » de votre éditeur suffit).

À remplacer en priorité :
- prix des forfaits (section `#tarifs` de `index.html` et la FAQ) ;
- projets, témoignages et équipe ;
- les champs entre [crochets] dans `mentions-legales.html` (NEQ, TPS/TVQ…) et
  `confidentialite.html` (responsable de la protection des renseignements personnels,
  obligatoire selon la Loi 25).

### Couleurs et police
En haut de `css/style.css` :

```css
--primary: #4f46e5;    /* couleur principale */
--secondary: #10b981;  /* couleur secondaire */
```

Les mêmes variables existent pour le mode sombre juste en dessous. Pour changer de police,
remplacez `Inter` dans le lien Google Fonts de chaque page et dans `--font`.

### Images
- Remplacez les fichiers de `images/` en gardant les mêmes noms, ou changez les `src`.
- Pour vos photos, préférez le format **WebP** (≈ 1600 px de large max) : `cwebp photo.jpg -q 80 -o photo.webp`.
- Gardez des attributs `alt` descriptifs, `width`/`height` et `loading="lazy"`.
- L'équipe utilise des initiales en cercle : remplacez le `<div class="team-photo">` par
  `<img class="team-photo" src="images/prenom.webp" alt="Prénom Nom" style="object-fit:cover">`.
- `images/og-image.png` (1200×630) est l'image affichée lors d'un partage sur les réseaux.

### Formulaire de contact
Sans configuration, le formulaire valide les champs puis affiche le message de
confirmation (mode démo) : **aucun message n'est envoyé**. Pour recevoir les demandes :

1. Créez un formulaire gratuit sur [Formspree](https://formspree.io) (ou équivalent).
2. Dans `contact.html`, collez son URL dans `data-endpoint=""` :
   `<form id="quote-form" novalidate data-endpoint="https://formspree.io/f/VOTRE_ID">`

### Carte Google Maps
L'adresse est dans l'attribut `data-src` du bloc `#map` de `contact.html`.

### Statistiques
Ajoutez le script de votre outil (Plausible, Matomo, Google Analytics…) dans la fonction
`loadAnalytics()` de `js/main.js` : il ne sera chargé qu'après acceptation des témoins.

## Mettre en ligne

Le site est servi par **GitHub Pages** depuis la branche `master` avec le domaine `keloar.com`
(*Settings → Pages*). Fusionnez vos changements dans `master` : la mise à jour est en ligne
en une à deux minutes.

Après la mise en ligne : déclarez le site et `https://keloar.com/sitemap.xml` dans
Google Search Console, et créez votre fiche Google Business Profile à Montréal pour le
référencement local.

## Crédits photos

Photos issues d'[Unsplash](https://unsplash.com), utilisées selon la
[licence Unsplash](https://unsplash.com/license) (usage commercial autorisé, sans attribution obligatoire).
Recadrées et converties en WebP :

| Fichier | Photo d'origine |
|---|---|
| `hero-site.webp` | https://images.unsplash.com/photo-1460925895917-afdab827c52f |
| `projet-boulangerie.webp` | https://images.unsplash.com/photo-1517433670267-08bbd4be890f |
| `projet-mode.webp` | https://images.unsplash.com/photo-1441986300917-64674bd600d8 |
| `projet-cabinet.webp` | https://images.unsplash.com/photo-1589829545856-d10d557cf95f |
| `projet-yoga.webp` | https://images.unsplash.com/photo-1544367567-0f2fcb009e0b |
| `projet-fromagerie.webp` | https://images.unsplash.com/photo-1452195100486-9cc805987862 |
| `projet-artisan.webp` | https://images.unsplash.com/photo-1503387762-592deb58ef4e |
| `atelier.webp` | https://images.unsplash.com/photo-1498050108023-c5249f4df085 |

N'utilisez pas d'images trouvées sur Pinterest ou Google Images : elles appartiennent à leurs auteurs.

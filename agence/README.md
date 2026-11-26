# Studio Lumen — Site vitrine d'agence web

Site vitrine complet, responsive et accessible pour une agence de création de sites web,
en **HTML5, CSS3 et JavaScript vanilla** (aucune dépendance, aucune étape de compilation).

> Les valeurs « Studio Lumen », « Lyon », l'adresse, le téléphone, les prix et les projets
> sont des **exemples** à remplacer par vos vraies informations (voir plus bas).

## Contenu

```
agence/
├── index.html              Accueil : hero, chiffres, services, méthode, réalisations,
│                           tarifs, témoignages, FAQ, appel à l'action
├── a-propos.html           Histoire, valeurs, équipe
├── contact.html            Formulaire de devis + coordonnées, horaires, carte
├── mentions-legales.html   Modèle de mentions légales (à compléter)
├── confidentialite.html    Politique de confidentialité / cookies (RGPD)
├── css/style.css           Tous les styles (variables de couleurs en haut du fichier)
├── js/main.js              Menu, thème sombre, animations, filtres, carrousel,
│                           FAQ, validation du formulaire, bandeau cookies
├── images/                 Illustrations temporaires (SVG), favicon, image de partage
├── sitemap.xml / robots.txt
```

Fonctionnalités : mode clair/sombre (automatique + bouton), menu burger mobile,
apparition au défilement, compteurs animés, filtres du portfolio, carrousel de témoignages
(boutons, puces, glisser au doigt, pause au survol), FAQ en accordéon, validation du
formulaire avec messages d'erreur, bandeau cookies, carte Google Maps chargée seulement
après consentement, données structurées Schema.org, balises Open Graph.

## Lancer le site en local

Ouvrez un terminal dans le dossier `agence/` puis :

```bash
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```

(ou l'extension **Live Server** de VS Code). Un double-clic sur `index.html` fonctionne aussi.

## Personnaliser

### Textes
Les textes sont directement dans les fichiers `.html`. L'en-tête et le pied de page sont
répétés dans chaque page : pensez à modifier les 5 fichiers (un « Rechercher / Remplacer
dans tous les fichiers » de votre éditeur suffit, par ex. `Studio Lumen` → `Votre Agence`).

À remplacer en priorité :
- nom de l'agence, ville, adresse, téléphone, e-mail ;
- prix des formules (section `#tarifs` de `index.html`) ;
- projets, témoignages et équipe ;
- l'URL `https://www.studio-lumen.fr/` dans les balises `canonical` / `og:` de chaque page,
  dans le bloc JSON-LD de `index.html`, dans `sitemap.xml` et `robots.txt` ;
- les champs entre [crochets] dans `mentions-legales.html` et `confidentialite.html`.

### Couleurs et police
En haut de `css/style.css`, modifiez les variables :

```css
--primary: #4f46e5;    /* couleur principale */
--secondary: #10b981;  /* couleur secondaire */
```

Les mêmes variables existent pour le mode sombre juste en dessous. Pour changer de police,
remplacez `Inter` dans le lien Google Fonts de chaque page et dans `--font`.

### Images
- Remplacez les fichiers de `images/` en gardant les mêmes noms, ou changez les `src`.
- Pour vos photos, préférez le format **WebP** (≈ 1600 px de large max) : `cwebp photo.jpg -q 80 -o photo.webp`.
- Gardez les attributs `alt` descriptifs, `width`/`height` et `loading="lazy"`.
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
`loadAnalytics()` de `js/main.js` : il ne sera chargé qu'après acceptation des cookies.

## Mettre en ligne

- **Netlify** : glissez-déposez le dossier `agence/` sur <https://app.netlify.com/drop>.
- **Vercel** : importez le dépôt et choisissez `agence` comme « Root Directory ».
- **GitHub Pages** : le dossier est accessible à l'adresse `…/agence/` du site du dépôt.
  Pour qu'il soit à la racine d'un domaine dédié, déplacez son contenu dans un dépôt à part
  et activez Pages dans *Settings → Pages*.

Après la mise en ligne : déclarez le site et `sitemap.xml` dans Google Search Console,
et créez votre fiche Google Business Profile pour le référencement local.

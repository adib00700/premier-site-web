# Automation Goldenott → WhatsApp (Keloar.com)

Petit service qui, à la commande d'un client (ou déclenché manuellement),
génère une ligne IPTV sur Goldenott (login / mot de passe / URL) et envoie
ces accès directement sur WhatsApp via l'API Cloud officielle de Meta.

Le site (`index.html` à la racine) est hébergé en statique sur GitHub Pages
et ne peut pas exécuter ce code : ce dossier `server/` doit être déployé
séparément (Render, Railway, Vercel, ou ton propre serveur/VPS).

## 1. Ce qu'il reste à faire avant que ça fonctionne réellement

### a. Brancher l'API Goldenott (obligatoire)

Le fichier `src/lib/goldenott.js` contient un **squelette** : je n'ai pas pu
récupérer la doc officielle (`https://goldenott.net/api/documentation`,
bloquée depuis mon environnement). Pour le finaliser :

1. Ouvre cette doc, ou dans ton panel revendeur Goldenott la section
   "API" / "Developer".
2. Note : l'URL de base, l'endpoint pour créer une ligne, la méthode
   d'authentification (clé API ? user/pass revendeur ?), les champs
   attendus en entrée, et les champs renvoyés (login, mot de passe, URL).
3. Donne-moi ces infos (ou colle-moi un exemple `curl`/Postman) et
   j'ajuste `buildRequestBody()` et `parseResponse()` dans ce fichier.

### b. Configurer WhatsApp Business Cloud API (Meta)

1. Crée une app sur [Meta for Developers](https://developers.facebook.com/),
   ajoute le produit "WhatsApp".
2. Récupère `WHATSAPP_PHONE_NUMBER_ID` et génère un token d'accès permanent
   (via un système utilisateur d'entreprise) → `WHATSAPP_ACCESS_TOKEN`.
3. Dans WhatsApp Manager > Message Templates, crée un template approuvé
   (catégorie "Utility") avec 4 variables dans le corps, par exemple :

   ```
   Bonjour {{1}}, voici vos accès Keloar.com :
   Identifiant : {{2}}
   Mot de passe : {{3}}
   URL de connexion : {{4}}
   ```

   C'est obligatoire pour le premier message envoyé à un client (WhatsApp
   n'autorise pas les messages libres tant que le client ne t'a pas écrit
   dans les dernières 24h). Mets son nom exact dans `WHATSAPP_TEMPLATE_NAME`.

### c. Copier `.env.example` en `.env` et remplir toutes les valeurs.

## 2. Lancer en local

```bash
cd server
npm install
cp .env.example .env   # puis remplir les valeurs
npm run dev
```

## 3. Déployer (ex. Render / Railway)

- Nouveau "Web Service" à partir de ce repo, "Root Directory" = `server`.
- Build command: `npm install` — Start command: `npm start`.
- Renseigner toutes les variables de `.env.example` dans les "Environment
  Variables" de la plateforme (jamais commiter le `.env`).
- Récupère l'URL publique du service (ex. `https://keloar-auto.onrender.com`)
  et renseigne-la dans `js/order.js` à la racine du site
  (`ORDER_API_URL`), puis republie le site.

## 4. Endpoints

- `POST /api/orders` — public, appelé par le formulaire de commande du
  site. Body: `{ "name": "...", "phone": "+33612345678", "packageId": "premium" }`.
  Rate-limité (20 requêtes / 15 min / IP).
- `POST /api/admin/generate` — déclenchement manuel (même body), protégé
  par le header `x-admin-key: <ADMIN_API_KEY>`.
- `POST /api/admin/resend` — renvoie des accès déjà connus en message texte
  libre (utile dans une conversation WhatsApp déjà ouverte). Body:
  `{ "name", "phone", "login", "password", "url" }`. Protégé aussi.

## 5. Sécurité

- `ADMIN_API_KEY` doit être une chaîne longue et aléatoire, jamais exposée
  côté client.
- `ALLOWED_ORIGINS` doit lister uniquement ton domaine (`https://keloar.com`).
- Ne commite jamais `.env` (déjà exclu via `.gitignore`).

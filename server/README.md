# Automation Goldenott → WhatsApp (Keloar.com)

Petit service qui, à la commande d'un client (ou déclenché manuellement),
génère une ligne IPTV sur Goldenott (login / mot de passe / URL) et envoie
ces accès directement sur WhatsApp via l'API Cloud officielle de Meta.

Le site (`index.html` à la racine) est hébergé en statique sur GitHub Pages
et ne peut pas exécuter ce code : ce dossier `server/` doit être déployé
séparément (Render, Railway, Vercel, ou ton propre serveur/VPS).

## 1. Ce qu'il reste à faire avant que ça fonctionne réellement

### a. Terminer la config Goldenott (obligatoire)

L'intégration Goldenott (`src/lib/goldenott.js`) est branchée sur la vraie
API confirmée via leur doc Swagger (`https://goldenott.net/docs`) :
authentification par header `X-API-Key`, création de ligne via
`POST /v1/lines`, URL de connexion renvoyée dans `dns_link_for_samsung_lg`.

Il reste seulement à renseigner **`GOLDENOTT_PACKAGE_MAP`** dans `.env` avec
les vrais identifiants numériques de ton compte :

1. Récupère ton token API depuis ton tableau de bord Goldenott →
   `GOLDENOTT_API_KEY`.
2. Appelle `GET /v1/packages` (ou regarde dans le dashboard) pour connaître
   le `package_id` de chacune de tes offres.
3. Récupère de la même façon `template_id`, `dns_domain_id` et
   `tv_domain_id` (sections Templates / Domains du dashboard).
4. Renseigne ces IDs dans `GOLDENOTT_PACKAGE_MAP` pour les 3 clés
   `essentiel`, `premium`, `famille` (voir `.env.example` pour le format
   JSON exact).

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

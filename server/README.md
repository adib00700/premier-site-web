# Automation Goldenott → WhatsApp — essai gratuit 24h par message

Un client envoie un message WhatsApp contenant un mot-clé (ex. "test",
"essai") sur ton numéro WhatsApp Business → ce service génère une ligne
d'essai 24h sur Goldenott (login / mot de passe / URL) et répond
automatiquement avec ces accès, directement dans la conversation WhatsApp.

Aucun site web n'est impliqué. Les autres messages (questions, demandes
d'abonnement payant...) ne déclenchent rien : tu continues à y répondre
toi-même normalement, comme aujourd'hui.

Ce service doit tourner en continu quelque part (Render, Railway, Vercel,
ou ton propre serveur/VPS) pour pouvoir recevoir les webhooks de Meta.

## 1. Ce qu'il reste à faire avant que ça fonctionne réellement

### a. Créer une app WhatsApp Business Cloud API (Meta)

1. Crée une app sur [Meta for Developers](https://developers.facebook.com/),
   ajoute le produit "WhatsApp".
2. Dans "API Setup" : récupère `WHATSAPP_PHONE_NUMBER_ID`, et génère un
   token d'accès permanent (via un système utilisateur d'entreprise) →
   `WHATSAPP_ACCESS_TOKEN`.
3. Dans "Settings > Basic" : récupère l'"App Secret" → `WHATSAPP_APP_SECRET`
   (sert à vérifier que les webhooks reçus viennent bien de Meta).
4. Choisis un mot de passe aléatoire pour `WHATSAPP_VERIFY_TOKEN` (tu le
   réutiliseras à l'étape webhook ci-dessous).
5. (Optionnel, pour le déclenchement manuel via `/api/admin/generate`
   uniquement) Dans WhatsApp Manager > Message Templates, crée un template
   approuvé (catégorie "Utility") avec 4 variables :

   ```
   Bonjour {{1}}, voici votre essai gratuit 24h Keloar.com :
   Identifiant : {{2}}
   Mot de passe : {{3}}
   URL de connexion : {{4}}
   ```

### b. Terminer la config Goldenott

L'intégration (`src/lib/goldenott.js`) est branchée sur la vraie API
confirmée via leur doc Swagger (`https://goldenott.net/docs`) :
authentification par header `X-API-Key`, création de ligne via
`POST /v1/lines`, URL de connexion renvoyée dans `dns_link_for_samsung_lg`.

Il reste à renseigner les IDs de ton **package d'essai 24h** dans `.env` :

1. Récupère ton token API depuis ton tableau de bord Goldenott →
   `GOLDENOTT_API_KEY`.
2. Appelle `GET /v1/packages` (ou regarde dans le dashboard) pour trouver le
   `package_id` de ton offre d'essai 24h (crée-la dans Goldenott si elle
   n'existe pas encore).
3. Récupère de la même façon `template_id`, `dns_domain_id` et
   `tv_domain_id` (sections Templates / Domains du dashboard).
4. Renseigne ces 4 IDs dans `GOLDENOTT_TRIAL_PACKAGE_ID`,
   `GOLDENOTT_TRIAL_TEMPLATE_ID`, `GOLDENOTT_TRIAL_DNS_DOMAIN_ID` et
   `GOLDENOTT_TRIAL_TV_DOMAIN_ID` (voir `.env.example`).

### c. Copier `.env.example` en `.env` et remplir toutes les valeurs.

## 2. Lancer en local

```bash
cd server
npm install
cp .env.example .env   # puis remplir les valeurs
npm run dev
```

Pour tester les webhooks en local avant de déployer, expose le port avec
un tunnel (ex. `ngrok http 3000`) et utilise l'URL `https://...ngrok.io`
donnée à l'étape 3 ci-dessous.

## 3. Déployer et brancher le webhook

1. Nouveau "Web Service" à partir de ce repo, "Root Directory" = `server`.
   Build command: `npm install` — Start command: `npm start`.
2. Renseigne toutes les variables de `.env.example` dans les "Environment
   Variables" de la plateforme (jamais commiter le `.env`).
3. Dans Meta for Developers > ton app > WhatsApp > Configuration :
   - Callback URL : `https://ton-service.exemple.com/webhook/whatsapp`
   - Verify token : la même valeur que `WHATSAPP_VERIFY_TOKEN`
   - Clique "Verify and save", puis abonne-toi au champ webhook `messages`.

À partir de là, tout message contenant un des mots-clés de
`WHATSAPP_TRIGGER_KEYWORDS` reçoit automatiquement une réponse avec un essai.

## 4. Endpoints

- `GET /webhook/whatsapp` — utilisé une seule fois par Meta pour vérifier
  l'URL (poignée de main).
- `POST /webhook/whatsapp` — reçoit les messages entrants ; vérifie la
  signature Meta (`WHATSAPP_APP_SECRET`) avant de traiter quoi que ce soit.
- `POST /api/admin/generate` — déclenchement manuel (toi qui contactes un
  client en premier). Body : `{ "name": "...", "phone": "+33612345678" }`,
  header `x-admin-key: <ADMIN_API_KEY>`.
- `POST /api/admin/resend` — renvoie des accès déjà connus en message texte
  libre. Body : `{ "name", "phone", "login", "password", "url" }`, même
  header.

## 5. Anti-doublon

Un même numéro qui renvoie plusieurs fois le mot-clé dans les 24h reçoit à
nouveau les **mêmes** accès (pas de nouvelle ligne créée à chaque fois) —
stocké dans `server/data/trials.json` (exclu de git). Passé 24h, une
nouvelle demande génère un nouvel essai.

## 6. Sécurité

- `ADMIN_API_KEY` doit être une chaîne longue et aléatoire, jamais exposée
  publiquement.
- `WHATSAPP_APP_SECRET` doit être configuré : sans lui, le webhook refuse
  toute requête (empêche quiconque connaissant l'URL de déclencher de
  fausses générations).
- Ne commite jamais `.env` (déjà exclu via `.gitignore`).

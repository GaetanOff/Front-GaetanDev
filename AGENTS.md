# AGENTS.md — Guide pour les agents IA

Point d'entrée pour tout agent IA (Claude Code, Codex, Copilot, Cursor…) qui travaille sur ce dépôt.
Lis ce fichier en entier avant de modifier le code, puis la page de `docs/` qui couvre la zone que tu touches.

## Le projet en bref

Portfolio et vitrine commerciale de Gaëtan Faucher (gaetandev.fr) : site public bilingue FR/EN (accueil, à propos, réalisations, contact, mentions légales), chatbot IA, visite guidée vocale, et un back-office `/admin` protégé par SSO (whitelist, emails, supervision de proxies).

- **Stack** : Angular 22 (composants standalone, signals, `ChangeDetectionStrategy.OnPush`), TypeScript 6, Tailwind CSS 3, RxJS 7, Zod (uniquement dans `admin/email` ; les formulaires publics utilisent les `Validators` Angular), Cloudflare Turnstile (`ngx-turnstile`), marked + DOMPurify.
- **Pas de SSR** : application SPA buildée avec `@angular/build:application`.
- **Backends externes** (aucun dans ce dépôt) : API admin (`environment.apiBaseUrl`), API du chatbot (`environment.chatbotApiUrl`), fournisseur SSO OIDC (`environment.sso`), EmailJS pour le formulaire de contact, Cloudflare Turnstile (captcha) et Cloudflare Web Analytics (chargé par `index.html`).
- **Langue du projet** : français (commits, docs, commentaires). Les textes affichés sont dans `src/assets/i18n/{fr,en}.json`.

## Commandes

```bash
npm ci               # installer (respecte le lockfile et les overrides)
npm start            # serveur de dev sur http://localhost:4200
npm run build        # build de production dans dist/Front-Gaetan2mz-V2
npm run test:ci      # tests unitaires Karma/Jasmine en ChromeHeadless (comme la CI)
npm run docs:check   # vérifie que la doc couvre tout le code (voir plus bas)
```

La CI (`.github/workflows/ci.yml`) exécute `npm ci`, `npm run build` et `npm run test:ci` sur Node 22, pour les push sur `develop`, `master` et `refactor/**` et les PR vers `develop` et `master`. Lance aussi ces commandes en local : une modification n'est terminée que si elles passent.

Ne régénère pas `package-lock.json` sous Windows sans vérifier qu'il garde les entrées `@emnapi/*`, sinon `npm ci` casse en CI (voir `docs/tooling.md`).

## Carte de la documentation

| Page | Couvre |
| --- | --- |
| [docs/architecture.md](docs/architecture.md) | Bootstrap, composant racine, environnements, types partagés, styles globaux |
| [docs/routing-i18n.md](docs/routing-i18n.md) | Routes, préfixes `/fr` `/en`, `LanguageGuard`, `I18nService`, fichiers de traduction |
| [docs/features/public-pages.md](docs/features/public-pages.md) | Accueil, à propos, réalisations, sections parcours (compétences, expériences, certifications, langues), services, mentions légales, page d'erreur, skeletons |
| [docs/features/contact.md](docs/features/contact.md) | Formulaire de contact, EmailJS, captcha, limitation d'envoi |
| [docs/features/auth-sso.md](docs/features/auth-sso.md) | SSO OIDC/PKCE, callback, `AuthGuard`, intercepteur HTTP |
| [docs/features/admin.md](docs/features/admin.md) | Back-office : whitelist, emails, proxies, `AdminService`, polling |
| [docs/features/chatbot.md](docs/features/chatbot.md) | Assistant IA flottant |
| [docs/features/voice-tour.md](docs/features/voice-tour.md) | Visite guidée vocale (moteur, étapes, audio) |
| [docs/voice-tour.md](docs/voice-tour.md) | Script de narration des MP3 de la visite |
| [docs/seo.md](docs/seo.md) | `SeoService`, `index.html`, sitemap, robots, `llms.txt` |
| [docs/tooling.md](docs/tooling.md) | Build, tests, CI, dépendances, Tailwind, conventions d'outillage |

L'index complet est dans [docs/README.md](docs/README.md).

## Conventions de code

Règles pour tout code nouveau ou réécrit. Une partie du code est plus ancienne et ne les suit pas encore : le back-office et l'auth SSO (`ChangeDetectionStrategy.Eager`, injection par constructeur, textes anglais en dur), `SkeletonComponent` (`@Input()`, `Eager`), `LocalerouteService` et `LanguageGuard` (injection par constructeur), `ChatbotComponent` (`@ViewChild`, `CommonModule`). Ne le « corrige » pas au passage, sauf si c'est la tâche.

- **Composants standalone uniquement**, `changeDetection: ChangeDetectionStrategy.OnPush`, injection via `inject()`.
- **État local en signals** (`signal`, `computed`, `effect`) ; RxJS pour le HTTP et les flux d'événements.
- **Textes du site public** : jamais en dur dans les templates. Ajoute la clé dans `fr.json` **et** `en.json` (même structure : le type `TranslationTexts` est déduit de `fr.json`, donc une clé présente seulement dans `en.json` passe inaperçue à la compilation) et lis-la via `i18n.text()`. Exception existante : les expériences et certifications sont traduites par des ternaires `isEnglish()` dans leur composant TS (voir `docs/features/public-pages.md`).
- **Liens internes** : passe par `LocalerouteService` pour conserver le préfixe de langue.
- **Arborescence** : `components/base/` = pages routées, `components/include/` = composants réutilisables, `services/<domaine>/`, `guards/`, `interceptors/`, `utils/`.
- **Style** : Tailwind dans les templates ; CSS de composant limité (budget de 4 kb par composant en production).
- **TypeScript** : guillemets simples, indentation 2 espaces (`.editorconfig`), mode `strict`.
- **HTML injecté** (markdown du chatbot, etc.) : toujours passer par DOMPurify.
- **Commits** : Conventional Commits en français, ex. `feat(tour): …`, `fix(deps): …`.

## Système de documentation

La doc vit dans `docs/` et est écrite **pour être lue par des agents** : factuelle, orientée « où est quoi, comment ça marche, où ça casse ».

### Format d'une page

Chaque page commence par un frontmatter qui déclare les fichiers qu'elle couvre :

```markdown
---
title: Authentification SSO
sources:
  - src/app/services/sso/          # un dossier (slash final) couvre tout son contenu
  - src/app/guards/auth.guard.ts   # un fichier couvre aussi son .spec.ts
updated: 2026-10-27
---
```

Le corps suit le gabarit [docs/_template.md](docs/_template.md) : Rôle, Fichiers, Fonctionnement, Contrats, Points d'attention, Tests, Recettes. Supprime une section vide plutôt que d'écrire « N/A ».

### Règles de rédaction

1. N'écris que ce que le code confirme. Pas de fonctionnalité supposée, pas de roadmap.
2. Cite des chemins de fichiers et des noms de symboles, pas de numéros de ligne (ils périment).
3. Documente le **pourquoi** et les pièges ; ne recopie pas le code.
4. Une zone de code = une page propriétaire. Les autres pages renvoient vers elle par lien.

### Vérification : `npm run docs:check`

Le script `scripts/docs-check.mjs` :

- signale tout fichier suivi par git sous `src/` (hors images, audio et PDF) qu'aucune page ne déclare dans `sources` ;
- signale toute entrée de `sources` qui ne correspond à aucun fichier (doc périmée) ;
- avec `--since <ref>` (ex. `npm run docs:check -- --since master`), liste les pages dont les sources ont changé depuis `<ref>` sans que la page ait été modifiée.

### Quand mettre la doc à jour

- Tu ajoutes, déplaces ou supprimes un fichier sous `src/` → mets à jour les `sources` de la page propriétaire (ou crée une page et ajoute-la à la carte ci-dessus et à `docs/README.md`).
- Tu changes un comportement, un contrat d'API, une route, une clé i18n structurante → mets à jour la page et sa date `updated`.
- Avant de terminer, lance `npm run docs:check -- --since master` et traite ce qu'il remonte.

### Régénérer toute la doc

Pour un nouvel agent ou après un gros refactor, demande : « Régénère la documentation en suivant la section *Système de documentation* d'AGENTS.md ». Procédure :

1. Liste les fichiers avec `git ls-files src` et regroupe-les selon la carte ci-dessus.
2. Pour chaque page, relis **tout** le code de ses `sources` (y compris les specs) et réécris la page selon le gabarit.
3. Mets à jour la carte, `docs/README.md`, puis lance `npm run docs:check` jusqu'à zéro erreur.

## Garde-fous

- `src/environments/*.ts` contient des identifiants publics (EmailJS, client SSO) : n'y ajoute jamais de secret serveur. Attention : en dev, `apiBaseUrl` et `chatbotApiUrl` pointent sur les API de production. D'autres identifiants publics sont en dur ailleurs : la clé de site Turnstile dans `custom-captcha.component.ts`, le jeton Cloudflare Web Analytics dans `index.html`.
- Les `overrides` de `package.json` corrigent des alertes Dependabot ; n'en retire pas sans vérifier l'alerte associée et la compatibilité Angular (voir `docs/tooling.md`).
- Ne modifie pas les MP3 de `src/assets/audio/tour/` sans suivre `docs/voice-tour.md`.

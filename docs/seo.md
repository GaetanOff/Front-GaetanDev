---
title: SEO, métadonnées et fichiers pour robots
sources:
  - src/app/services/seo/
  - src/index.html
  - src/robots.txt
  - src/sitemap.xml
  - src/llms.txt
  - src/llms-full.txt
updated: 2026-10-27
---

# SEO, métadonnées et fichiers pour robots

## Rôle

Le référencement repose sur deux couches : un `src/index.html` statique (métadonnées par défaut, données structurées globales, scripts tiers) servi pour toutes les URL, et `SeoService`, appelé par chaque page publique pour réécrire côté client le titre, les meta, les liens canonical/hreflang et un bloc JSON-LD propre à la page. S'y ajoutent les fichiers statiques pour robots : `robots.txt`, `sitemap.xml`, `llms.txt` et `llms-full.txt`.

## Fichiers

| Fichier | Responsabilité |
| --- | --- |
| `src/app/services/seo/seo.service.ts` | `SeoService` (root) et l'interface `SeoData` ; constante `SeoService.BASE_URL = 'https://gaetandev.fr'` |
| `src/index.html` | Document unique de la SPA : meta par défaut (FR), Open Graph, Twitter, canonical/hreflang par défaut, JSON-LD global, style critique, scripts Cloudflare, `<noscript>` |
| `src/robots.txt` | Autorise tous les robots (moteurs et crawlers IA) sauf `/admin`, déclare le sitemap |
| `src/sitemap.xml` | URL publiques en trois variantes (sans préfixe, `/fr`, `/en`) avec `xhtml:link` hreflang |
| `src/llms.txt` | Résumé du site au format llms.txt (en français) destiné aux LLM |
| `src/llms-full.txt` | Version détaillée : expertise, services, liste des réalisations publiques, pages, mentions légales, consigne de citation |

Les quatre fichiers texte/XML sont copiés à la racine du build via le tableau `assets` de `angular.json` (voir [tooling.md](tooling.md)).

## Fonctionnement

### `SeoService.update(data: SeoData)`

Appelée dans un `effect()` du constructeur de chaque page routée, qui lit `i18n.text()` : elle est donc rejouée à chaque changement de langue. Elle pose, dans l'ordre :

1. `document.documentElement.lang` = `en` ou `fr` ;
2. `<title>` (`Title.setTitle`) ;
3. `meta[name=description]` et `meta[name=robots]` (`noindex, nofollow` si `noindex`, sinon `index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1`) ;
4. Open Graph : `og:title`, `og:description`, `og:url` (= canonical), `og:type` (`data.type ?? 'website'`), `og:locale` et `og:locale:alternate` (`fr_FR` / `en_US`) ;
5. Twitter : `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image` (`/assets/img/metaLogo.webp`) ;
6. liens : `link[rel=canonical]`, `link[rel=alternate][hreflang=fr|en|x-default]` (créés s'ils n'existent pas, sinon mis à jour) — ou, si `noindex`, suppression de tous ces liens ;
7. JSON-LD : un `<script id="seo-jsonld-page" type="application/ld+json">` contenant un `@graph` avec un `WebPage` (`@id` = canonical, `isPartOf` → `#website`, `about` → `#person`), un `BreadcrumbList` à deux niveaux (« GaetanDev » → titre de la page) si `path` n'est pas vide, puis les entités de `data.jsonLd`. Si `noindex`, ce script est supprimé.

Ce que le service ne touche pas (reste celui de `index.html`) : `og:image`, `og:image:alt`, `og:site_name`, `keywords`, `author`, `category`, `theme-color`.

### Langue, canonical et hreflang

La langue est déduite de **l'URL** (`isEnglishPath(router.url)`), pas de `I18nService`. Pour une page de chemin `path` (sans préfixe, `''` pour l'accueil) :

| URL visitée | canonical | hreflang `fr` | hreflang `en` | hreflang `x-default` |
| --- | --- | --- | --- | --- |
| `/fr{path}` | `https://gaetandev.fr/fr{path}` | `/fr{path}` | `/en{path}` | `{path}` ou `/` |
| `/en{path}` | `https://gaetandev.fr/en{path}` | idem | idem | idem |
| `{path}` (sans préfixe) | `https://gaetandev.fr{path}` (ou `/`) | idem | idem | idem |

Chaque variante est donc auto-canonique ; la version sans préfixe sert de `x-default`. Le routage des trois variantes est décrit dans [routing-i18n.md](routing-i18n.md).

### Appelants

| Composant (`src/app/components/base/…`) | `path` | `type` | `jsonLd` supplémentaire |
| --- | --- | --- | --- |
| `home/home.component.ts` | `''` | `profile` | `ProfilePage` (`mainEntity` → `#person`) |
| `about/about.component.ts` | `/about` | `profile` | `OfferCatalog` des trois services, construit depuis les clés i18n `services.*` |
| `achievements/achievements.component.ts` | `/achievements` | défaut | `ItemList` de `CreativeWork` construite depuis `achievements.list` (avec `url` si `redirect`) |
| `contact/contact.component.ts` | `/contact` | défaut | `ContactPage` |
| `legal/legal.component.ts` | `/legal` | défaut | — |
| `legal/cgv/cgv.component.ts` | `/legal/cgv` | défaut | — |
| `error/error.component.ts` | `''` | — | — (`noindex: true`) |

Titres et descriptions viennent des clés i18n `seo.<page>.{title,description}` (`home`, `about`, `achievements`, `contact`, `legal`, `cgv`, `error`). Les pages admin n'appellent pas `SeoService`. Le détail des pages est dans [features/public-pages.md](features/public-pages.md).

### `src/index.html`

- `<html lang="fr">`, `<title>` et meta par défaut en français : `description`, `robots` (index), `keywords`, `author`, `category`, `theme-color` (`#111827`).
- Open Graph et Twitter par défaut, avec `og:image` / `twitter:image` = `https://gaetandev.fr/assets/img/metaLogo.webp` et `og:site_name` = `GaetanDev`.
- Canonical `https://gaetandev.fr/` et hreflang `fr` → `/fr`, `en` → `/en`, `x-default` → `/` : ce sont les balises que `SeoService.setLink()` retrouve et met à jour ensuite.
- **JSON-LD global** (script sans `id`, jamais modifié) : `@graph` avec `Person` (`@id` `https://gaetandev.fr/#person`), `ProfessionalService` (`#business`, adresse, SIRET) et `WebSite` (`#website`). Les entités injectées par `SeoService` et par les pages y font référence par ces `@id`.
- Préconnexions à `challenges.cloudflare.com` et `static.cloudflareinsights.com`.
- Scripts tiers : Cloudflare Turnstile (`turnstile/v0/api.js?render=explicit`, `async defer`, utilisé par le captcha du contact et du chatbot) et le beacon Cloudflare Web Analytics en fin de `<body>`.
- Style critique inline (fond dégradé de `body`, `app-root` en `display: block; min-height: 100vh`), favicon `assets/img/metaLogo.webp`.
- `<noscript>` avec un `<h1>` et un résumé en français (activité, contact, GitHub).

### `src/robots.txt`

Bloc `User-agent: *` (`Allow: /`, `Disallow: /admin`) répété explicitement pour Googlebot, Bingbot et une liste de crawlers IA (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, GoogleOther, Gemini-Deep-Research, Applebot(-Extended), Amazonbot, CCBot, cohere-ai, meta-externalagent, FacebookBot, DuckAssistBot, MistralAI-User, xAI-Bot). Choix assumé : le site est ouvert aux IA (commentaire « GEO friendly »). Déclare `Sitemap: https://gaetandev.fr/sitemap.xml` et mentionne `llms.txt` en commentaire.

### `src/sitemap.xml`

Pour l'accueil, `/about`, `/achievements` et `/contact` : trois `<url>` (sans préfixe, `/fr`, `/en`), chacune avec les mêmes `xhtml:link` hreflang `fr`, `en`, `x-default` que `SeoService`. `/legal` et `/legal/cgv` n'ont que leur variante sans préfixe (avec hreflang vers `/fr/…` et `/en/…`). `lastmod` est figé à la main (`2026-07-02`), `priority` décroît de 1.0 (accueil) à 0.3 (légal).

### `src/llms.txt` et `src/llms-full.txt`

Fichiers markdown en français destinés aux LLM et crawlers IA (qui n'exécutent pas forcément le JavaScript). `llms.txt` : résumé, liste des pages (URL sans préfixe), services, contact, liens légaux en « Optional ». `llms-full.txt` : version longue avec domaines d'expertise, services détaillés, **liste des réalisations publiques** avec URL, pages, informations légales et consigne de citation. Leur contenu est rédigé à la main : il duplique des informations qui vivent ailleurs (`achievements.list` et `services.*` dans les fichiers i18n, mentions légales, JSON-LD de `index.html`).

## Contrats

**`SeoData`** :

| Champ | Rôle |
| --- | --- |
| `title`, `description` | Titre et description (title, meta, OG, Twitter, JSON-LD) |
| `path` | Chemin **sans préfixe de langue** : `''` pour l'accueil, `'/about'`… Sert au canonical, aux hreflang et au breadcrumb |
| `type?` | `'website'` (défaut), `'profile'` ou `'article'` → `og:type` |
| `noindex?` | `robots: noindex, nofollow`, retire canonical, hreflang et JSON-LD de page |
| `jsonLd?` | Entités ajoutées au `@graph` de la page |

**Identifiants stables** : `@id` `https://gaetandev.fr/#person`, `#business`, `#website` (définis dans `index.html`, référencés par `SeoService` et les pages) ; `id="seo-jsonld-page"` pour le script JSON-LD par page.

**URL publiques** des fichiers : `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`.

## Points d'attention

- **SPA sans SSR** : le HTML initial de toutes les URL est `index.html`. Un robot qui n'exécute pas le JavaScript voit, pour chaque page, le titre et la description de l'accueil en français, `lang="fr"` et **le canonical `https://gaetandev.fr/`** — donc toutes les pages pointent vers l'accueil tant que `SeoService` n'a pas tourné. Le texte du `<noscript>`, `llms.txt` et `llms-full.txt` sont les seuls contenus lisibles sans JS. Les données structurées par page (breadcrumb, `ItemList`, `OfferCatalog`) n'existent qu'après rendu JS. La réécriture des routes vers `index.html` côté hébergement n'est pas configurée dans ce dépôt.
- **Langue déduite de l'URL** : sur une URL sans préfixe, `I18nService` peut afficher l'anglais (préférence `isEnglish` en `localStorage`) alors que `SeoService` pose `lang="fr"`, `og:locale` `fr_FR` et `inLanguage` `fr-FR` avec un titre et une description en anglais.
- Ne donne pas l'`id` `seo-jsonld-page` au JSON-LD global de `index.html` : il serait écrasé par le premier appel à `update()`, puis supprimé par la page d'erreur.
- `noindex` (page d'erreur) supprime canonical et hreflang ; ils sont recréés par `setLink()` à la page suivante. Les pages admin n'appellent pas le service : en navigation client, elles gardent les balises de la page précédente (y compris `robots: index`) ; seul `robots.txt` (`Disallow: /admin`) les exclut.
- `twitter:image` est réécrit par le service, `og:image` non : si l'image change, modifie les deux (`index.html` et `SeoService`).
- Le sitemap est maintenu à la main : il n'est pas généré depuis `app.routes.ts`. `lastmod` n'est mis à jour par aucun outil.
- Le sitemap ne liste pas `/fr/legal`, `/en/legal`, `/fr/legal/cgv`, `/en/legal/cgv` comme `<loc>`, contrairement aux autres pages, alors qu'il les déclare en hreflang.
- `llms.txt` / `llms-full.txt` dupliquent du contenu : **à mettre à jour quand les réalisations (`achievements.list`), les services, les coordonnées, les mentions légales ou la liste des pages changent**.
- Les identifiants Cloudflare présents dans `index.html` (jeton du beacon Web Analytics) sont publics par nature ; n'y ajoute pas de secret.

## Tests

Aucun fichier `.spec.ts` pour `SeoService`, et aucun contrôle automatique de `index.html`, du sitemap, de `robots.txt` ou des `llms*.txt`. Vérification manuelle : `npm start`, puis inspecter `<head>` (title, meta, `link[rel=canonical]`, `link[hreflang]`, `#seo-jsonld-page`) sur `/`, `/fr/about`, `/en/achievements` et une URL inexistante (doit être `noindex`).

## Recettes

### Ajouter une page au SEO

1. **Route** : déclare la page dans `createPublicChildren()` de `src/app/app.routes.ts` pour qu'elle existe sans préfixe, sous `/fr` et sous `/en` (voir [routing-i18n.md](routing-i18n.md)).
2. **i18n** : ajoute `seo.<page>.title` et `seo.<page>.description` dans `src/assets/i18n/fr.json` **et** `en.json`.
3. **Composant** : injecte `SeoService` et appelle `this.seo.update({ title, description, path: '/<page>', type?, jsonLd? })` dans un `effect()` du constructeur qui lit `i18n.text()` (pour se rejouer au changement de langue). Référence les entités globales par `${SeoService.BASE_URL}/#person` si besoin.
4. **Sitemap** : ajoute dans `src/sitemap.xml` les trois `<url>` (`/<page>`, `/fr/<page>`, `/en/<page>`) avec les trois `xhtml:link` hreflang, sur le modèle des pages existantes.
5. **llms** : ajoute la page à la section « Pages » de `src/llms.txt` et « Pages du site » de `src/llms-full.txt` (et son contenu dans `llms-full.txt` si elle apporte de l'information nouvelle).
6. Si la page est privée : `noindex: true` dans `SeoData` et une règle `Disallow` dans `robots.txt` (pour chaque `User-agent`), sans l'ajouter au sitemap.

### Mettre à jour après un changement de contenu

Réalisation, service ou coordonnées modifiés dans les fichiers i18n → répercute dans `llms-full.txt` (et `llms.txt` si cela touche le résumé) ; identité ou adresse → JSON-LD de `index.html` et `llms-full.txt` ; puis mets à jour les `lastmod` concernés du sitemap.

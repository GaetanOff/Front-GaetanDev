---
title: Pages publiques
sources:
  - src/app/components/base/home/
  - src/app/components/base/about/
  - src/app/components/base/achievements/
  - src/app/components/base/error/
  - src/app/components/base/legal/
  - src/app/components/include/cv/
  - src/app/components/include/services/
  - src/app/components/include/skeletons/
  - src/assets/img/
  - src/assets/files/
updated: 2026-10-27
---

# Pages publiques

## Rôle

Pages vitrines du site : accueil, à propos (offre de services + CV en ligne), réalisations, mentions légales / CGV et page 404. Elles sont purement présentationnelles : aucun appel réseau, tout le contenu vient des fichiers de traduction ou de tableaux en dur dans les composants. Le formulaire de contact a sa propre page : [contact.md](./contact.md).

## Fichiers

| Fichier | Responsabilité |
| --- | --- |
| `src/app/components/base/home/home.component.*` | Accueil (`/`) : titre, accroche, deux boutons (contact, à propos). CSS : animation `animate-wave` de l'emoji. |
| `src/app/components/base/about/about.component.*` | À propos (`/about`) : intro, bouton CV, puis assemble `app-services`, `app-competences`, `app-experience`, `app-certif`, `app-languages`. |
| `src/app/components/base/achievements/achievements.component.*` | Réalisations (`/achievements`) : grille de cartes projet. |
| `src/app/components/base/error/error.component.*` | Page 404 (route `**`). |
| `src/app/components/base/legal/legal.component.*` | Mentions légales (`/legal`). |
| `src/app/components/base/legal/cgv/cgv.component.*` | CGU/CGV (`/legal/cgv`). |
| `src/app/components/base/legal/legal.routes.ts` | `legalRoutes`, chargé en lazy par `app.routes.ts`. |
| `src/app/components/include/services/services.component.*` | Trois cartes d'offre (IA, Développement, DevOps) avec lien vers `/contact`. |
| `src/app/components/include/cv/competences/` | Grille des technologies (logos). |
| `src/app/components/include/cv/experience/` | Frise des expériences + calcul de durée. |
| `src/app/components/include/cv/certif/` | Frise des certifications. |
| `src/app/components/include/cv/languages/` | Langues parlées. |
| `src/app/components/include/skeletons/skeleton.component.*` | Placeholder de chargement animé, utilisé uniquement par l'admin. |
| `src/assets/img/` | Images du site (voir « Assets »). |
| `src/assets/files/00084228-1_ApplicationWeb_GaetanDev.pdf` | Seul fichier du dossier ; lié depuis le `©` du pied de page dans `src/app/components/app.component.html`. |

## Fonctionnement

### Routage

Toutes ces pages sont déclarées par `createPublicChildren()` dans `src/app/app.routes.ts`, montées trois fois (sans préfixe, sous `/fr`, sous `/en`) avec `LanguageGuard`. `/legal` est en lazy-loading via `legalRoutes` (`''` → `LegalComponent`, `cgv` → `CgvComponent`). La 404 est la route `**` racine, hors préfixe de langue. Détails : [../routing-i18n.md](../routing-i18n.md).

### Schéma commun

Chaque page routée (sauf les include) :

- injecte `I18nService` en public et lit tous ses textes via `i18n.text()` (les JSON `fr.json` / `en.json` sont importés statiquement, le changement de langue est donc instantané et sans HTTP) ;
- appelle `SeoService.update()` dans un `effect()` du constructeur, pour que titre, description, canonical et JSON-LD se recalculent quand la langue change. Le JSON-LD référence toujours la personne via `${SeoService.BASE_URL}/#person`. Voir [../seo.md](../seo.md).

| Page | Clé SEO | `path` passé | Particularités SEO |
| --- | --- | --- | --- |
| `HomeComponent` | `seo.home` | `''` | `type: 'profile'`, JSON-LD `ProfilePage` |
| `AboutComponent` | `seo.about` | `/about` | `type: 'profile'`, JSON-LD `OfferCatalog` construit à partir de `services.devTitle/dev`, `devopsTitle/devops`, `iaTitle/ia` |
| `AchievementsComponent` | `seo.achievements` | `/achievements` | JSON-LD `ItemList` de `CreativeWork`, généré depuis `achievements.list` (le `url` n'est ajouté que si `redirect` est non vide) |
| `LegalComponent` | `seo.legal` | `/legal` | — |
| `CgvComponent` | `seo.cgv` | `/legal/cgv` | — |
| `ErrorComponent` | `seo.error` | `''` | `noindex: true` |

### Accueil (`HomeComponent`)

Bloc `data-tour="hero"` : `home.welcome` + « Faucher » en dégradé (en dur) + emoji 👋 animé, `desc`, puis deux liens `routerLink` construits avec `LocalerouteService.getLocalizedRoute()` vers `/contact` (`home.contactButton`) et `/about` (`learnMoreButton`). Le signal `currentLang` est déclaré mais inutilisé.

### À propos (`AboutComponent`)

Bloc `data-tour="about-intro"` : `about.title`, `about.role`, `desc` et un bouton « Télécharger mon CV » (`about.cvButton`). **Le bouton ne télécharge rien** : `processForm()` affiche seulement un `toast.error(about.cvNotAvailable)` (ngx-sonner). Suivent les include, chacun avec un attribut `data-tour` posé sur l'hôte (`services`, `competences`, `experience`, `certif`) ; `app-languages` n'en a pas.

### Réalisations (`AchievementsComponent`)

- Données : `i18n.text().achievements.list` (titre `achievements.title`, chapô `achievements.description`). Chaque entrée : `name`, `description`, `image`, `redirect`, `categories`.
- Rendu : `@for` (track `project.name`) dans une grille 1/2/3 colonnes portant `data-tour="achievements"`. Deux `ng-template` (`cardContent`, `innerCard`) via `NgTemplateOutlet` évitent de dupliquer le contenu entre la version lien et la version non cliquable.
- Si `redirect` est non vide : la carte est un `<a target="_blank" rel="noopener noreferrer">`, avec pastille verte animée (`animate-ping`) et icône lien externe. Sinon : `<div>` avec pastille bleue fixe.
- L'image n'est affichée que si `image` est renseigné.
- Pas de filtre, pas de pagination, pas d'IntersectionObserver : toutes les réalisations sont rendues d'un coup. Le champ `categories` (ex. `["DEV"]`) n'est lu nulle part.

### Mentions légales et CGV

Templates statiques de cartes `ios-card`. Chaque section = un titre (clé `legal.<section>`) + un tableau de paragraphes (`legal.<section>Text`, itéré avec `@for ... track text`). `LegalComponent` : `declaration`, `host` (texte simple `hostText`), `reproductionTitle` + `reproductionText` + `copyrightText`. `CgvComponent` : `preamble`, `definitions`, `cgu`, `command`, `payment`, `retractation`, `price`. Titres de page : `title.legal`, `title.cgv`.

### Page 404 (`ErrorComponent`)

Affiche `error.notfound.*` et un bouton retour accueil. Le lien est calculé par sa propre méthode `getLocalizedRoute()`, qui duplique la logique de `LocalerouteService` mais lit `window.location.pathname` au lieu de `router.url` : sur `/fr/xxx` le bouton mène à `/fr/`, sans préfixe il mène à `/`.

### Include du CV

#### `app-services` (`ServicesComponent`)

Trois cartes dans cet ordre : Solutions IA (`services.iaTitle`, liste `services.ia`, prix `services.devis`), Développement mis en avant (bordure verte animée `animate-ping-light` définie dans `services.component.css`, prix « 400€ » **en dur** + `services.perDay`, liste `services.dev`), DevOps (`services.devopsTitle`, `services.devops`, `services.devis`). Chaque carte a un bouton `services.contactButton` vers `/contact` via `LocalerouteService`. Les mêmes clés alimentent le JSON-LD `OfferCatalog` de `AboutComponent`.

#### `app-competences` (`CompetencesComponent`)

Tableau en dur `competencesList: { name, image }[]` dans le TS (noms de technologies, non traduits). Chaque entrée = carte 32×32 avec logo `assets/img/comp/*.webp` (`alt` = `name + ' logo'`). Seul le titre vient de l'i18n (`cv.competences.title`).

#### `app-experience` (`ExperienceComponent`)

- `experiencesList` est un `computed()` en dur dans le TS : `name`, `date`, `description`, `active`. `date` et `description` sont traduits par ternaire `i18n.isEnglish() ? … : …`, pas par le JSON.
- Frise verticale : les cartes alternent gauche/droite selon l'index pair/impair (`timeline-item-left/right`) ; sous 768 px tout passe à gauche. `active: true` = point vert avec halo animé, sinon point gris.
- `calculateDuration(date)` découpe `date` sur `" - "`, parse chaque borne avec `parseDate()` (format « Mois AAAA », noms de mois FR ou EN selon la langue courante), traite la borne de fin égale à `cv.today` comme « maintenant », puis compose la durée avec les clés `cv.year(s)`, `cv.month(s)`, `cv.and`, `cv.lessThanMonth`, `cv.unknownDuration`.

#### `app-certif` (`CertifComponent`)

Même frise et même CSS que l'expérience (le fichier `certif.component.css` est une copie de `experience.component.css`). `certifList` est un `computed()` en dur avec ternaires FR/EN ; pas de calcul de durée.

#### `app-languages` (`LanguagesComponent`)

Liste `cv.languages.langList` de l'i18n, sans logique.

### Skeletons (`SkeletonComponent`)

`<app-skeleton [variant]>` avec `SkeletonVariant` = `'input' | 'input-small' | 'list' | 'details' | 'text-area' | 'panel'`. Chaque variante est un bloc gris translucide ; l'effet de brillance vient de la classe `shimmer` (pseudo-élément `before:` + `animate-[shimmer_2s_infinite]`, keyframes `shimmer` définies dans `src/styles.css`). Utilisé par les pages admin (`email`, `whitelist`, `proxies`, `detailserver`), jamais par les pages publiques. Le formulaire de contact réimplémente le même shimmer en ligne au lieu d'utiliser ce composant.

### Assets (`src/assets/img/`)

| Emplacement | Contenu | Utilisé par |
| --- | --- | --- |
| `achievements/` | Logos des projets, majoritairement `.webp` (un `.svg`) | Champ `image` de `achievements.list` dans les JSON |
| `comp/` | Logos des technologies, `.webp` | `CompetencesComponent.competencesList` |
| `home/` | Quatre SVG décoratifs | Aucune référence dans `src/` |
| `france.svg`, `english.svg` | Drapeaux du sélecteur de langue | `languageImg` de `src/app/components/app.component.ts` |
| `metaLogo.webp` | Logo / favicon / image Open Graph | `src/index.html`, `SeoService` |
| `pdp.webp` | Photo de profil | Aucune référence dans `src/` |

Le dossier entier `src/assets` est copié tel quel au build (`angular.json`), les chemins s'écrivent donc `assets/img/...` sans slash initial.

## Contrats

- **Routes** : `''`, `about`, `achievements`, `legal`, `legal/cgv` (sous `''`, `fr`, `en`) et `**` → `ErrorComponent`.
- **`SkeletonComponent`** : `@Input() variant: SkeletonVariant` (défaut `'input'`), type `SkeletonVariant` exporté.
- **Ancres de la visite guidée** (`src/app/services/tour/tour.steps.ts`) : `data-tour="hero"` (accueil), `about-intro`, `services`, `competences`, `experience`, `certif` (à propos), `achievements` (grille, étape avec `scroll: true` qui fait défiler la grille pendant la narration). Le moteur les cherche par `document.querySelector('[data-tour="…"]')`. Voir [./voice-tour.md](./voice-tour.md).
- **Clés i18n structurantes** : `home.*`, `about.*`, `desc`, `learnMoreButton`, `services.*`, `cv.*`, `achievements.{title,description,list}`, `legal.*`, `title.{legal,cgv}`, `error.notfound.*`, `seo.{home,about,achievements,legal,cgv,error}`. Le type `TranslationTexts` est déduit de `fr.json` : `en.json` doit avoir exactement la même structure.

## Points d'attention

- **Renommer ou supprimer un attribut `data-tour`** listé ci-dessus casse silencieusement l'étape correspondante de la visite guidée (le spotlight ne trouve plus sa cible). Les hôtes d'include ciblés portent `class="block"` (un élément custom est `inline` par défaut) : le conserver, car le moteur de visite mesure la cible avec `getBoundingClientRect()` pour choisir le défilement.
- **Textes en dur malgré la convention i18n** : expériences et certifications (ternaires FR/EN dans le TS), noms de compétences, « Faucher » et l'emoji de l'accueil, le prix « 400€ » des services. Changer un libellé de l'expérience exige de modifier le TS, pas les JSON.
- **Format de date de l'expérience imposé** : `calculateDuration` n'accepte que « Mois AAAA - Mois AAAA » ou « Mois AAAA - Aujourd'hui/Today » (exactement la valeur de `cv.today`), séparateur `" - "` avec espaces, mois en toutes lettres avec accents (`février`, `août`, `décembre`). Tout autre format affiche `cv.unknownDuration`.
- **Durée approximative** : seuls les mois comptent (le jour est ignoré) et un écart de 1 mois s'affiche « Moins d'un mois » (`remainingMonths <= 1`). « Janvier 2020 - Janvier 2020 » donne aussi « Moins d'un mois ».
- **Clé `track` dupliquée** : `experiencesList` contient deux entrées `name: 'Université de Montpellier'` alors que le `@for` suit `exp.name` ; Angular signale les clés dupliquées en dev. Suivre plutôt `exp.name + exp.date` si on touche ce template.
- **`achievements.list` est dupliqué** dans `fr.json` et `en.json`, y compris `image` et `redirect` : toute modification non techniquement textuelle (URL, image, ordre) doit être faite dans les deux fichiers. L'ordre du tableau = ordre d'affichage = `position` du JSON-LD.
- **`track project.name`** : deux réalisations ne peuvent pas avoir le même `name`.
- **Bouton CV factice** : le PDF de `src/assets/files/` n'est pas le CV ; il n'est lié que depuis le pied de page, par une URL absolue `https://www.gaetandev.fr/assets/files/...` (un renommage du fichier casse ce lien sans erreur de build).
- **Assets orphelins** : `img/home/*`, `img/pdp.webp`, `img/achievements/pizzaoplomo.webp` et `img/comp/CloudProvider.webp` ne sont référencés nulle part dans `src/`.
- **Contenu dupliqué ailleurs** : `src/llms-full.txt` reprend la liste des réalisations et des services, `src/index.html` contient un JSON-LD statique (`knowsAbout`, services). Ils ne sont pas générés depuis les JSON (voir [../seo.md](../seo.md)).
- `SkeletonComponent` déroge aux conventions : `@Input()` décorateur au lieu de `input()` et `ChangeDetectionStrategy.Eager` au lieu d'`OnPush`. La variante `text-area` utilise `bg-gray-300` (opaque) contrairement aux autres.
- `ErrorComponent.getLocalizedRoute()` duplique `LocalerouteService` ; préférer le service si on modifie cette page.

## Tests

Chaque composant a un spec qui vérifie seulement la création (`should create`) : `home`, `about`, `achievements`, `error`, `legal`, `cgv`, `services`, `competences`, `experience`, `certif`, `languages`. Ceux qui utilisent `routerLink` fournissent `provideRouter([])`. `SkeletonComponent` n'a pas de spec. Rien ne couvre `calculateDuration`, le rendu conditionnel lien/non-lien des réalisations ni la présence des ancres `data-tour`.

Lancer de façon ciblée :

```bash
npx ng test --watch=false --browsers=ChromeHeadlessCI --include src/app/components/include/cv
```

## Recettes

### Ajouter une réalisation

1. Déposer le logo dans `src/assets/img/achievements/` (`.webp` de préférence, nom en minuscules sans espace).
2. Ajouter l'entrée dans `achievements.list` de `src/assets/i18n/fr.json` **et** `src/assets/i18n/en.json`, à la position voulue (l'ordre est l'ordre d'affichage) : `name` (unique), `description` (traduite), `image: "assets/img/achievements/<fichier>"`, `redirect` (URL ou `""` pour une carte non cliquable), `categories` (conservé pour la cohérence du type, non utilisé).
3. Rien à toucher dans le TS : la grille et le JSON-LD `ItemList` se mettent à jour seuls.
4. Mettre à jour la section « Réalisations publiques » de `src/llms-full.txt` si la réalisation doit y figurer.
5. Lancer `npm run build` (vérifie que les deux JSON restent compatibles avec `TranslationTexts`).

### Ajouter une compétence

1. Déposer le logo dans `src/assets/img/comp/<Nom>.webp`.
2. Ajouter `{ name: '<Nom affiché>', image: 'assets/img/comp/<Nom>.webp' }` dans `competencesList` de `src/app/components/include/cv/competences/competences.component.ts` (l'ordre est l'ordre d'affichage ; `name` unique car utilisé comme `track`).
3. Aucun JSON à modifier. Éventuellement compléter `knowsAbout` dans `src/index.html`.

### Ajouter une expérience

1. Ajouter un objet dans `experiencesList` de `src/app/components/include/cv/experience/experience.component.ts`, en tête pour la plus récente : `name`, `date` et `description` sous forme de ternaires `this.i18n.isEnglish() ? '<EN>' : '<FR>'`, `active` (`true` = poste en cours, point vert animé).
2. Respecter le format de `date` décrit plus haut dans les deux langues (« Octobre 2021 - Aujourd'hui » / « October 2021 - Today »), sinon la durée affiche « Durée inconnue ».
3. Garder `name` unique (ou faire évoluer l'expression `track` du template).

### Ajouter une certification

1. Ajouter un objet dans `certifList` de `src/app/components/include/cv/certif/certif.component.ts` (`name`, `date` et `description` en ternaires FR/EN, `active`).
2. `name` doit être unique (`track certif.name`). Aucune contrainte de format sur `date` (pas de calcul de durée).

### Ajouter une section à une page légale

Ajouter les clés `legal.<section>` et `legal.<section>Text` (tableau de paragraphes) dans les deux JSON, puis une `<section class="ios-card ...">` sur le modèle des existantes dans `legal.component.html` ou `cgv.component.html`.

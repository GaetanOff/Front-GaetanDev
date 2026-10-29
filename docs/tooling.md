---
title: Outillage, build, tests et CI
sources:
  - src/test.ts
  - package.json
  - angular.json
  - tsconfig.json
  - tsconfig.app.json
  - tsconfig.spec.json
  - karma.conf.js
  - .postcssrc.json
  - .editorconfig
  - .github/
  - scripts/docs-check.mjs
updated: 2026-10-29
---

# Outillage, build, tests et CI

## Rôle

Tout ce qui sert à installer, builder, tester et vérifier le projet : scripts npm, configuration Angular CLI, TypeScript, Karma/Jasmine, Tailwind, workflows GitHub Actions, Dependabot et la politique des `overrides` npm. Le gestionnaire de paquets est **npm** (lockfile `package-lock.json` v3) ; l'ancien `pnpm-lock.yaml` a été supprimé (commit `ab78ddf`).

## Fichiers

| Fichier | Responsabilité |
| --- | --- |
| `package.json` | Scripts, dépendances, `overrides` de sécurité, `optionalDependencies` `@emnapi/*`. |
| `angular.json` | Projet unique `Front-Gaetan2mz-V2` : cibles `build`, `serve`, `test`, `extract-i18n`. |
| `tsconfig.json` | Options TypeScript et Angular communes (`strict`, `strictTemplates`…). |
| `tsconfig.app.json` / `tsconfig.spec.json` | Points d'entrée de compilation de l'app et des tests. |
| `src/test.ts` | Initialise l'environnement de test Angular (`BrowserDynamicTestingModule`, `platformBrowserDynamicTesting`) après `zone.js/testing`. |
| `karma.conf.js` | Runner Karma : Jasmine, Chrome, launcher `ChromeHeadlessCI`, couverture. |
| `.postcssrc.json` | Branche le plugin `@tailwindcss/postcss` (Tailwind 4) sur le pipeline CSS du builder Angular. La configuration Tailwind elle-même est en CSS dans `src/styles.css`. |
| `.editorconfig` | UTF-8, espaces, indentation 2, guillemets simples pour `*.ts`. |
| `.github/workflows/ci.yml` | Build + tests à chaque push/PR sur certaines branches. |
| `.github/workflows/semgrep.yml` | Analyse Semgrep et upload SARIF. |
| `.github/dependabot.yml` | Mises à jour de version Dependabot hebdomadaires pour `npm` (groupe `angular` pour les `@angular/*`) et `github-actions`, sur la branche par défaut. |
| `scripts/docs-check.mjs` | Vérifie la couverture de `src/` par `docs/` (`npm run docs:check`). |

## Fonctionnement

### Scripts npm

| Script | Commande | Effet |
| --- | --- | --- |
| `start` | `ng serve` | Dev-server (`@angular/build:dev-server`), configuration `development` par défaut, donc `src/environments/environment.ts`. |
| `build` | `ng build --configuration production --optimization true` | Build de prod dans `dist/Front-Gaetan2mz-V2` (`--optimization true` est redondant avec la configuration `production`). |
| `watch` | `ng build --watch --configuration development` | Build de dev incrémental. |
| `test` | `ng test` | Karma en mode watch dans un Chrome visible (`browsers: ['Chrome']`). |
| `test:ci` | `ng test --watch=false --browsers=ChromeHeadlessCI` | Exécution unique en headless, comme la CI. |
| `docs:check` | `node scripts/docs-check.mjs` | Contrôle de la doc, voir [AGENTS.md](../AGENTS.md) (section « Système de documentation »). |

### Build (`angular.json`)

- Builder `@angular/build:application` (esbuild/Vite), point d'entrée `browser: src/main.ts`, `polyfills: [src/polyfills.ts]`, `index: src/index.html`, styles `src/styles.css`, `tsConfig: tsconfig.app.json`. `defaultConfiguration` : `production`.
- **Assets copiés** tels quels à la racine du build : `src/favicon.ico`, `src/assets`, `src/robots.txt`, `src/sitemap.xml`, `src/llms.txt`, `src/llms-full.txt` (ces fichiers SEO sont décrits dans [seo.md](seo.md)).
- **Configuration `production`** :
  - budgets : `initial` 500 kb (avertissement) / 1 mb (erreur) ; `anyComponentStyle` 2 kb / 4 kb ;
  - `fileReplacements` : `src/environments/environment.ts` remplacé par `environment.prod.ts` (voir [architecture.md](architecture.md)) ;
  - `outputHashing: all`.
- **Configuration `development`** : sans optimisation, avec source maps et `namedChunks`.
- `extract-i18n` existe mais n'est pas utilisée : l'i18n passe par des JSON maison ([routing-i18n.md](routing-i18n.md)).
- Schematics : composants/directives/services générés avec le suffixe de type (`type: component`…), séparateur `.` pour guards, interceptors, pipes, resolvers, modules. `cli.analytics` désactivé.

### TypeScript

- `tsconfig.json` : `strict`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `resolveJsonModule` (indispensable à l'import de `fr.json`/`en.json`), `esModuleInterop`, `moduleResolution: bundler`, `target: ES2022`, `module: es2020`, `useDefineForClassFields: false`, `experimentalDecorators`. Côté Angular : `strictTemplates`, `strictInjectionParameters`, `strictInputAccessModifiers`.
- Alias `paths` `src/*` → `./src/*` : il remplace `baseUrl` (déprécié en TypeScript 6, erreur TS5101) depuis la migration Angular 22 (commit `8038629`). Certains fichiers importent ainsi `src/app/...` au lieu d'un chemin relatif.
- `tsconfig.app.json` : compile `src/main.ts` et `src/polyfills.ts` (+ `src/**/*.d.ts`), `types: []`.
- `tsconfig.spec.json` : compile `src/test.ts`, `src/polyfills.ts`, `src/**/*.spec.ts`, avec `types: ['jasmine']`.
- Les deux désactivent les diagnostics étendus `nullishCoalescingNotNullable` et `optionalChainNotNullable` (ajouté par la migration Angular 22).

### Tests (Karma + Jasmine)

- Cible `test` : builder `@angular/build:karma`, `main: src/test.ts`, `karmaConfig: karma.conf.js`, mêmes polyfills et styles que l'app, assets `src/favicon.ico` et `src/assets`.
- `karma.conf.js` : frameworks `jasmine` ; plugins `karma-jasmine`, `karma-chrome-launcher`, `karma-jasmine-html-reporter`, `karma-coverage` ; reporters `progress` et `kjhtml` ; launcher personnalisé **`ChromeHeadlessCI`** = `ChromeHeadless` avec `--no-sandbox --disable-gpu`, utilisé par `test:ci` et donc par la CI.
- La couverture (`coverageReporter`, sortie `coverage/Front-Gaetan2mz-V2`, html + text-summary) n'est produite qu'avec `ng test --code-coverage` ; `istanbul-lib-instrument` est en devDependency pour cela (ajout de la migration Angular 22).
- Versions : Jasmine `~3.8.0`, `karma-jasmine` `~4.0.0`, Karma `~6.4.4`. Les types `@types/jasmine` sont en `~7.0.0`, donc **en avance sur le runtime 3.8** : une API Jasmine récente compile mais peut échouer à l'exécution (`karma-jasmine` 4 n'embarque que Jasmine 3.x).

### Tailwind CSS

- Tailwind `^4.3.3` via `@tailwindcss/postcss` (déclaré dans `.postcssrc.json`). Il n'y a plus de `tailwind.config.js` : la configuration est en CSS en tête de `src/styles.css` (`@import 'tailwindcss' source(none)`, directives `@source`, bloc `@theme`).
- Le bloc `@theme` définit deux animations d'entrée de 300 ms, `animate-fade-in-down` (menu mobile, 0,5 rem depuis le haut) et `animate-fade-in-up` (panneau du chatbot, 1 rem depuis le bas), appliquées en `motion-safe:`. `scale-98` (utilisé en `active:scale-98` par le menu mobile) n'a plus besoin d'extension : Tailwind 4 accepte toute valeur numérique de `scale-*`. Aucun plugin n'est installé : les classes de `tailwindcss-animate` (`animate-in`, `fade-in`, `slide-in-*`) ne génèrent rien. Une classe inconnue de Tailwind ne provoque aucune erreur de build, elle est simplement ignorée.
- `@source` scanne `./*.{html,ts}` et `./app/**/*.{html,ts}` (relatifs à `src/`), comme le `content` de l'ancienne config v3 ; `source(none)` coupe la détection automatique, qui scannerait aussi les JSON i18n, les `.txt` et les specs. Les `.ts` sont scannés : les classes écrites dans des chaînes TypeScript (ex. la constante `shimmer` de `SkeletonComponent`) sont générées, à condition d'être écrites en entier.
- Un `@layer base` de `src/styles.css` rétablit trois défauts de Tailwind 3 que Tailwind 4 a changés : couleur de bordure `gray-200` (v4 : `currentColor`), placeholder `gray-400` (v4 : couleur du texte à 50 %), `cursor: pointer` sur les boutons (v4 : `default`). Sans lui, chaque `border` sans couleur explicite prendrait la couleur du texte.
- Pièges de la v4 rencontrés lors de la migration :
  - `@apply` dans un CSS de composant exige `@reference 'tailwindcss';` en tête de fichier, et chaque utilitaire y embarque ses `@property` et fallbacks (le CSS de `ExperienceComponent`/`CertifComponent` dépassait alors le budget de 2 kb) ; ces deux fichiers sont donc écrits en CSS simple.
  - `translate-*`, `scale-*` et `rotate-*` posent les propriétés CSS `translate`/`scale`/`rotate`, plus `transform` : `transform-none` ne les annule pas (utiliser `translate-none`), et ils se cumulent avec un `transform` écrit à la main.
  - Classes renommées : `shadow-sm` → `shadow-xs`, `drop-shadow-sm` → `drop-shadow-xs`, `backdrop-blur-sm` → `backdrop-blur-xs`, `outline-none` → `outline-hidden`, `flex-grow` → `grow`. Une ancienne classe compile encore mais change de rendu (ex. `shadow-sm` est l'ancien `shadow`).
  - Les couleurs de la palette sont en `oklch` et la pile `font-sans` par défaut commence par `-apple-system` (plus `ui-sans-serif, system-ui`).
  - Les utilitaires sont dans des cascade layers natives (`@layer utilities`) : le CSS non layeré de `src/styles.css` (`.ios-card`, `.ios-btn`…) et des composants l'emporte sur eux quelle que soit la spécificité.

### CI GitHub Actions

- **`ci.yml`** (job `build-and-test`, `ubuntu-latest`, Node 22 avec cache npm) : `npm ci`, `npm run build`, `npm run test:ci`. Déclenché par `push` sur `develop`, `master`, `refactor/**` et par `pull_request` vers `develop`, `master`. Permissions : `contents: read`.
- **`semgrep.yml`** : `push` et `pull_request` sur `master`, plus un cron hebdomadaire (`36 11 * * 3`, mercredi 11:36 UTC). Utilise `returntocorp/semgrep-action` épinglé par SHA, avec les secrets `SEMGREP_APP_TOKEN` et `SEMGREP_DEPLOYMENT_ID`, puis `github/codeql-action/upload-sarif@v4` (`semgrep.sarif`, même en cas d'échec).

### Politique des dépendances et des `overrides`

L'historique (`git log --oneline`, commits `fix(deps)` et `fix(security)`) montre un cycle répété : une alerte Dependabot ou `npm audit` vise une dépendance **transitive**, presque toujours d'outillage (Angular CLI et son serveur MCP, Karma, Vite, Tailwind), qu'on ne peut pas mettre à jour directement ; on ajoute ou relève alors un plancher dans `overrides`. Chaque commit cite les GHSA et numéros d'alerte traités. Règles qui en découlent :

- **Les paquets `@angular/*` montent ensemble** : ils ont des plages de peer dependencies exactes entre eux (commits `3f24e2a`, `ecde228`). Une montée partielle laisse npm conserver d'anciennes versions et peut imposer de régénérer le lock.
- **Un override ne doit pas contredire la chaîne Angular.** Le commit `da397a7` a retiré un override `vite ^7.3.6` qui empêchait le linker Angular de s'appliquer au pré-bundling (page blanche sous `ng serve`, Angular 22 exigeant Vite 8) et un override `@babel/core ^7` qui contredisait la dépendance `@babel/core` 8 d'`@angular/build`. L'override `vite` est aujourd'hui `^8.3.3`.
- **Overrides qui forcent une majeure hors contrainte** : `postcss-selector-parser ^7.1.6`, posé quand Tailwind 3.4 demandait `^6.1.2` (aucun correctif en 6.x, commit `9d7820c`), Tailwind 4 n'en dépendant plus ; `@hono/node-server ^2.0.5` (v1 → v2, commit `534a3c7`).
- **Overrides ciblés** : `"karma": { "glob": "7.2.3" }` garde `glob` 7 pour Karma alors que `glob` est forcé en `^10.5.0` ailleurs ; les clés versionnées (`minimatch@^3.0.0`, `@^9.0.0`, `@^10.0.0`, `picomatch@^2.0.0`, `@^4.0.0`) épinglent chaque ligne majeure séparément.
- **Un override ne peut pas viser une dépendance directe avec une autre plage** : `postcss` est en devDependency (`^8.5.32`, exigé par `@tailwindcss/postcss`), donc son override vaut `"$postcss"` (référence à la plage directe, qui reste au-dessus du plancher de sécurité `^8.5.18`). npm 11 tolère l'écart en local, mais npm 10 (celui de Node 22 en CI) lève `EOVERRIDE`, que `npm ci` affiche sous la forme trompeuse « can only install with an existing package-lock.json ». Pour reproduire la CI : `npm exec --package=npm@10 -- npm ci --dry-run --ignore-scripts`.
- **`@emnapi/core` et `@emnapi/runtime` en `optionalDependencies` (1.11.3)** : un lock régénéré sous Windows omet ces entrées (atteintes seulement via des paquets wasm conditionnés par plateforme), ce qui fait échouer `npm ci` sur Linux en CI (commits `af84dfe`, `518d114`). Les deux paquets sont publiés ensemble : les monter à la même version (Dependabot n'en monte qu'un par PR).

## Contrats

- Commandes qui doivent passer avant de considérer une modification terminée : `npm ci`, `npm run build`, `npm run test:ci` (celles de `ci.yml`).
- Sortie du build : `dist/Front-Gaetan2mz-V2` (ignoré par git).
- Style de code (`.editorconfig`) : UTF-8, indentation 2 espaces, ligne finale, pas d'espaces en fin de ligne (sauf `*.md`), `quote_type = single` pour `*.ts`. Aucun linter ni formateur (ESLint, Prettier) n'est configuré.
- `.gitattributes` exclut `*.css` des statistiques de langage GitHub (`linguist-detectable=false`).

## Points d'attention

- La branche principale est `master` (aucune branche `main`) : `ci.yml` et `semgrep.yml` la ciblent toutes deux. Semgrep ne tourne pas sur `develop`.
- `dependabot.yml` regroupe les `@angular/*` dans une seule PR (groupe `angular`), car ils doivent monter ensemble (voir plus haut) ; une PR de version ne relève pas les `overrides`, à vérifier à la main. Les alertes traitées dans les commits `fix(deps)` sont des alertes de sécurité Dependabot, distinctes de ce fichier.
- **Overrides devenus inertes** : plusieurs paquets forcés n'apparaissent plus du tout dans `package-lock.json` (`tar`, `@isaacs/brace-expansion`, `@sigstore/core`, `hono`, `@hono/node-server`, `rollup`, `ip-address`, `undici`, `path-to-regexp`, `express`, `express-rate-limit`, `webpack`, `webpack-dev-server`, `http-proxy-middleware`, `js-yaml`, `loader-utils`, `node-forge`, `on-headers`, et `postcss-selector-parser` depuis Tailwind 4). Ils sont sans effet aujourd'hui mais protègent contre un retour de ces paquets ; ne pas les retirer sans vérifier l'alerte d'origine (voir AGENTS.md).
- **Régénérer le lock** (`npm install` après suppression du lock) sous Windows : vérifier ensuite que les entrées `@emnapi/*` sont toujours dans `package-lock.json`, sinon `npm ci` casse en CI.
- **`src/favicon.ico` est déclaré dans les assets** (build et test) mais n'existe pas dans le dépôt ; l'icône réellement référencée par `index.html` est `assets/img/metaLogo.webp`.
- **Dépendances sans import direct dans `src/`** : `@angular/animations` et `@babel/runtime` (aucun import trouvé). `@angular/platform-browser-dynamic` n'est importé que par `src/test.ts` mais figure dans `dependencies`.
- **Budget de style par composant** de 4 kb (erreur) : un CSS de composant qui grossit casse le build de prod, d'où les styles partagés dans `src/styles.css`.

## Tests

- `src/test.ts` n'a pas de logique propre : il initialise `TestBed` une fois pour toutes les specs. La découverte des `*.spec.ts` est faite par le builder via `tsconfig.spec.json`.
- Les specs vivent à côté du code (`*.spec.ts`) ; chaque page de `docs/` indique ce que couvrent celles de sa zone. Beaucoup ne vérifient que la création (« should be created »).
- Lancer une seule spec : un `fdescribe`/`fit` temporaire, puis `npm run test:ci` (à retirer avant commit).
- Couverture : `npx ng test --watch=false --browsers=ChromeHeadlessCI --code-coverage`, rapport dans `coverage/Front-Gaetan2mz-V2`.

## Recettes

- **Corriger une alerte Dependabot sur une dépendance transitive** : identifier le paquet et la version corrigée dans l'alerte, ajouter/relever l'entrée dans `overrides` de `package.json`, `npm install`, vérifier `npm audit`, puis `npm run build` **et** `npm start` (une incompatibilité Vite/Babel peut ne se voir qu'au dev-server, cf. `da397a7`) et `npm run test:ci`. Vérifier les entrées `@emnapi/*` du lock. Commit `fix(deps): …` citant les GHSA.
- **Monter Angular** : monter tous les `@angular/*` (dépendances et devDependencies, y compris `@angular/build` et `@angular/cli`) à la même version, appliquer `ng update` pour les migrations, puis vérifier que les overrides (notamment `vite`, `esbuild`) restent compatibles avec la nouvelle chaîne.
- **Ajouter un asset statique servi à la racine** (ex. un nouveau `.txt` pour les robots) : l'ajouter au tableau `assets` de la cible `build` dans `angular.json`. Un fichier placé dans `src/assets/` est déjà copié.
- **Changer les branches de CI** : modifier `on.push.branches` / `on.pull_request.branches` de `.github/workflows/ci.yml` (la branche principale est `master`, pas `main`).
- **Ajouter une classe Tailwind générée dynamiquement** : l'écrire en entier dans un fichier scanné (`.html` ou `.ts` sous `src/app/`), sinon elle n'est pas générée.

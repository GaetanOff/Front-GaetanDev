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
  - tailwind.config.js
  - .editorconfig
  - .github/
  - scripts/docs-check.mjs
updated: 2026-10-27
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
| `tailwind.config.js` | Chemins scannés par Tailwind 3 ; aucun thème étendu ni plugin. |
| `.editorconfig` | UTF-8, espaces, indentation 2, guillemets simples pour `*.ts`. |
| `.github/workflows/ci.yml` | Build + tests à chaque push/PR sur certaines branches. |
| `.github/workflows/semgrep.yml` | Analyse Semgrep et upload SARIF. |
| `.github/dependabot.yml` | Configuration des mises à jour de version Dependabot (incomplète, voir plus bas). |
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
- Versions : Jasmine `~3.8.0`, `karma-jasmine` `~4.0.0`, Karma `~6.4.4`.

### Tailwind CSS

- Tailwind `^3.4.17`, configuré par `tailwind.config.js` à la racine (aucun fichier PostCSS dédié : le builder Angular détecte la config Tailwind et l'applique aux directives `@tailwind` de `src/styles.css`).
- `content` scanne `./src/*.html`, `./src/*.ts`, `./src/app/**/**/**/*.html` et `./src/app/**/**/**/*.ts`. Les `.ts` sont scannés : les classes écrites dans des chaînes TypeScript (ex. la constante `shimmer` de `SkeletonComponent`) sont générées, à condition d'être écrites en entier.

### CI GitHub Actions

- **`ci.yml`** (job `build-and-test`, `ubuntu-latest`, Node 22 avec cache npm) : `npm ci`, `npm run build`, `npm run test:ci`. Déclenché par `push` sur `develop`, `main`, `refactor/**` et par `pull_request` vers `develop`, `main`. Permissions : `contents: read`.
- **`semgrep.yml`** : `push` et `pull_request` sur `master`, plus un cron hebdomadaire (`36 11 * * 3`, mercredi 11:36 UTC). Utilise `returntocorp/semgrep-action` épinglé par SHA, avec les secrets `SEMGREP_APP_TOKEN` et `SEMGREP_DEPLOYMENT_ID`, puis `github/codeql-action/upload-sarif@v3` (`semgrep.sarif`, même en cas d'échec).

### Politique des dépendances et des `overrides`

L'historique (`git log --oneline`, commits `fix(deps)` et `fix(security)`) montre un cycle répété : une alerte Dependabot ou `npm audit` vise une dépendance **transitive**, presque toujours d'outillage (Angular CLI et son serveur MCP, Karma, Vite, Tailwind), qu'on ne peut pas mettre à jour directement ; on ajoute ou relève alors un plancher dans `overrides`. Chaque commit cite les GHSA et numéros d'alerte traités. Règles qui en découlent :

- **Les paquets `@angular/*` montent ensemble** : ils ont des plages de peer dependencies exactes entre eux (commits `3f24e2a`, `ecde228`). Une montée partielle laisse npm conserver d'anciennes versions et peut imposer de régénérer le lock.
- **Un override ne doit pas contredire la chaîne Angular.** Le commit `da397a7` a retiré un override `vite ^7.3.6` qui empêchait le linker Angular de s'appliquer au pré-bundling (page blanche sous `ng serve`, Angular 22 exigeant Vite 8) et un override `@babel/core ^7` qui contredisait la dépendance `@babel/core` 8 d'`@angular/build`. L'override `vite` est aujourd'hui `^8.3.3`.
- **Overrides qui forcent une majeure hors contrainte** : `postcss-selector-parser ^7.1.6` alors que Tailwind 3.4 demande `^6.1.2` (aucun correctif en 6.x ; CSS de prod vérifiée identique, commit `9d7820c`) ; `@hono/node-server ^2.0.5` (v1 → v2, commit `534a3c7`).
- **Overrides ciblés** : `"karma": { "glob": "7.2.3" }` garde `glob` 7 pour Karma alors que `glob` est forcé en `^10.5.0` ailleurs ; les clés versionnées (`minimatch@^3.0.0`, `@^9.0.0`, `@^10.0.0`, `picomatch@^2.0.0`, `@^4.0.0`) épinglent chaque ligne majeure séparément.
- **`@emnapi/core` et `@emnapi/runtime` en `optionalDependencies` (1.11.2)** : un lock régénéré sous Windows omet ces entrées (atteintes seulement via des paquets wasm conditionnés par plateforme), ce qui fait échouer `npm ci` sur Linux en CI (commits `af84dfe`, `518d114`).

## Contrats

- Commandes qui doivent passer avant de considérer une modification terminée : `npm ci`, `npm run build`, `npm run test:ci` (celles de `ci.yml`).
- Sortie du build : `dist/Front-Gaetan2mz-V2` (ignoré par git).
- Style de code (`.editorconfig`) : UTF-8, indentation 2 espaces, ligne finale, pas d'espaces en fin de ligne (sauf `*.md`), `quote_type = single` pour `*.ts`. Aucun linter ni formateur (ESLint, Prettier) n'est configuré.
- `.gitattributes` exclut `*.css` des statistiques de langage GitHub (`linguist-detectable=false`).

## Points d'attention

- **`ci.yml` cible `main`, mais la branche principale du dépôt est `master`** (`origin/HEAD -> origin/master` ; aucune branche `main` locale ou distante). Un push ou une PR vers `master` ne déclenche donc pas la CI de build/tests ; seules les PR vers `develop` (et les push sur `develop` / `refactor/**`) la lancent. À l'inverse, Semgrep ne tourne que sur `master`.
- **`dependabot.yml` a `package-ecosystem: ""`** (valeur vide du gabarit GitHub) : aucune mise à jour de version Dependabot n'est réellement configurée. Les alertes traitées dans les commits `fix(deps)` sont des alertes de sécurité Dependabot, distinctes de ce fichier.
- **Overrides devenus inertes** : plusieurs paquets forcés n'apparaissent plus du tout dans `package-lock.json` (`tar`, `@isaacs/brace-expansion`, `@sigstore/core`, `hono`, `@hono/node-server`, `rollup`, `ip-address`, `undici`, `path-to-regexp`, `express`, `express-rate-limit`, `webpack`, `webpack-dev-server`, `http-proxy-middleware`, `js-yaml`, `loader-utils`, `node-forge`, `on-headers`). Ils sont sans effet aujourd'hui mais protègent contre un retour de ces paquets ; ne pas les retirer sans vérifier l'alerte d'origine (voir AGENTS.md).
- **Régénérer le lock** (`npm install` après suppression du lock) sous Windows : vérifier ensuite que les entrées `@emnapi/*` sont toujours dans `package-lock.json`, sinon `npm ci` casse en CI.
- **`src/favicon.ico` est déclaré dans les assets** (build et test) mais n'existe pas dans le dépôt ; l'icône réellement référencée par `index.html` est `assets/img/metaLogo.webp`.
- **Dépendances sans import direct dans `src/`** : `@angular/animations` et `@babel/runtime` (aucun import trouvé). `@angular/platform-browser-dynamic` n'est importé que par `src/test.ts` mais figure dans `dependencies`.
- **Budget de style par composant** de 4 kb (erreur) : un CSS de composant qui grossit casse le build de prod, d'où les styles partagés dans `src/styles.css`.
- **`README.md` est obsolète** : il indique Angular CLI 12.1.4, une commande Tailwind `npx tailwindcss -i ./tailwind.css -o ./src/assets/css/output.css` alors qu'il n'existe ni `tailwind.css` ni `src/assets/css/` (Tailwind passe par le builder Angular), et `ng e2e` qui n'est pas configuré. Se fier à [AGENTS.md](../AGENTS.md) et à cette page.

## Tests

- `src/test.ts` n'a pas de logique propre : il initialise `TestBed` une fois pour toutes les specs. La découverte des `*.spec.ts` est faite par le builder via `tsconfig.spec.json`.
- Les specs vivent à côté du code (`*.spec.ts`) ; chaque page de `docs/` indique ce que couvrent celles de sa zone. Beaucoup ne vérifient que la création (« should be created »).
- Lancer une seule spec : un `fdescribe`/`fit` temporaire, puis `npm run test:ci` (à retirer avant commit).
- Couverture : `npx ng test --watch=false --browsers=ChromeHeadlessCI --code-coverage`, rapport dans `coverage/Front-Gaetan2mz-V2`.

## Recettes

- **Corriger une alerte Dependabot sur une dépendance transitive** : identifier le paquet et la version corrigée dans l'alerte, ajouter/relever l'entrée dans `overrides` de `package.json`, `npm install`, vérifier `npm audit`, puis `npm run build` **et** `npm start` (une incompatibilité Vite/Babel peut ne se voir qu'au dev-server, cf. `da397a7`) et `npm run test:ci`. Vérifier les entrées `@emnapi/*` du lock. Commit `fix(deps): …` citant les GHSA.
- **Monter Angular** : monter tous les `@angular/*` (dépendances et devDependencies, y compris `@angular/build` et `@angular/cli`) à la même version, appliquer `ng update` pour les migrations, puis vérifier que les overrides (notamment `vite`, `esbuild`) restent compatibles avec la nouvelle chaîne.
- **Ajouter un asset statique servi à la racine** (ex. un nouveau `.txt` pour les robots) : l'ajouter au tableau `assets` de la cible `build` dans `angular.json`. Un fichier placé dans `src/assets/` est déjà copié.
- **Changer les branches de CI** : modifier `on.push.branches` / `on.pull_request.branches` de `.github/workflows/ci.yml` (par exemple remplacer `main` par `master`).
- **Ajouter une classe Tailwind générée dynamiquement** : l'écrire en entier dans un fichier scanné (`.html` ou `.ts` sous `src/app/`), sinon elle n'est pas générée.

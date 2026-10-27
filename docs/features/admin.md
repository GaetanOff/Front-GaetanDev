---
title: Back-office admin
sources:
  - src/app/components/base/admin/admin.component.ts
  - src/app/components/base/admin/admin.component.html
  - src/app/components/base/admin/admin.routes.ts
  - src/app/components/base/admin/email/
  - src/app/components/base/admin/proxies/
  - src/app/components/base/admin/whitelist/
  - src/app/components/include/admin/
  - src/app/services/admin/
  - src/app/utils/polling.utils.ts
updated: 2026-10-27
---

# Back-office admin

## Rôle

Back-office privé sous `/admin`, réservé au propriétaire du site : gestion d'une whitelist d'adresses IP, gestion d'alias e-mail `@cf.gaetandev.fr`, supervision d'une liste de proxies HTTP/SOCKS5 et des serveurs qui les scannent. Toutes les données viennent de l'API admin externe (`environment.apiBaseUrl`) via `AdminService`. L'authentification (SSO, `AuthGuard`, intercepteur Bearer) est documentée dans [auth-sso.md](./auth-sso.md).

## Fichiers

| Fichier | Responsabilité |
| --- | --- |
| `src/app/components/base/admin/admin.routes.ts` | `adminRoutes`, chargées en lazy par `src/app/app.routes.ts` sous `admin` |
| `src/app/components/base/admin/admin.component.ts` / `.html` | Page `/admin` : tableau de bord statique (« Dashboard », message de bienvenue) |
| `src/app/components/base/admin/whitelist/whitelist.component.*` | Page `/admin/whitelist` : ajout / suppression d'IPv4 |
| `src/app/components/base/admin/email/email.component.*` | Page `/admin/email` : création / suppression / recherche d'alias, générateur d'alias aléatoire |
| `src/app/components/base/admin/proxies/proxies.component.*` | Page `/admin/proxies` : listes de proxies, statut des serveurs, vérificateur de proxy, export filtré |
| `src/app/components/base/admin/proxies/detailserver/detailserver.component.*` | Page `/admin/proxies/details/:id` : métriques d'un serveur de scan |
| `src/app/components/include/admin/templadmin/templadmin.component.*` | Layout commun `<app-templadmin>` : barre latérale repliable, déconnexion, zone de contenu (`<ng-content>`) |
| `src/app/services/admin/admin.service.ts` | `AdminService` : tous les appels HTTP du back-office + `logout()` |
| `src/app/services/admin/proxy-filter.service.ts` | `ProxyFilterService` : logique pure de filtrage par pays et export texte |
| `src/app/utils/polling.utils.ts` | `startPolling` et `runRefreshLoad` : rafraîchissement périodique des écrans |

Les composants `auth/` et `auth/callback/` appartiennent à [auth-sso.md](./auth-sso.md). Dépendances hors périmètre : `NavService` (`src/app/services/nav/nav.service.ts`), `SkeletonComponent` (`src/app/components/include/skeletons/`), types de `src/app/types.ts` (voir [../architecture.md](../architecture.md)).

## Fonctionnement

### Routes

Préfixe `/admin`, **sans** préfixe de langue `/fr` / `/en` et sans `LanguageGuard` (voir [../routing-i18n.md](../routing-i18n.md)).

| Chemin | Composant | Garde |
| --- | --- | --- |
| `/admin` | `AdminComponent` | `AuthGuard` |
| `/admin/auth` | `AuthComponent` | aucune |
| `/admin/auth/callback` | `CallbackComponent` | aucune |
| `/admin/whitelist` | `WhitelistComponent` | `AuthGuard` |
| `/admin/email` | `EmailComponent` | `AuthGuard` |
| `/admin/proxies` | `ProxiesComponent` | `AuthGuard` |
| `/admin/proxies/details/:id` | `DetailserverComponent` | `AuthGuard` |

Tous les composants sont importés statiquement dans `admin.routes.ts` : le chunk lazy `admin` les contient tous.

### Layout commun (`TempladminComponent`)

- `AppComponent` détecte les URL commençant par `/admin` (`isAdminRoute`) et n'affiche alors que le `<router-outlet>`, sans header ni footer publics (voir [../architecture.md](../architecture.md)). Chaque page admin (sauf `auth` / `callback`) enveloppe elle-même son contenu dans `<app-templadmin>`.
- Le layout est un panneau `fixed inset-0 z-50` plein écran. La barre latérale a deux états, pilotés par `NavService.isAdminNavOpened` (singleton `root`, `true` par défaut) : ouverte (libellés) ou repliée (icônes). L'état survit à la navigation entre pages admin mais pas à un rechargement.
- Liens : Dashboard, Whitelist, Proxies, E-Mail (`routerLink` absolus, `routerLinkActive`), puis Logout → `AdminService.logout()` → `SsoService.logout()`.

### Whitelist (`/admin/whitelist`)

- Au chargement puis toutes les **60 s** : `getWhitelistedIPs()` via `runRefreshLoad`, avec toasts « Refreshing whitelist… » / « Whitelist refreshed ».
- La liste masque toujours `127.0.0.1` (et `hasWhitelistedIPs` l'ignore pour le message « No whitelisted IPs »).
- Ajout : validation Zod (`z.string().ip({ version: "v4" })`, refus de `127.0.0.1`, refus d'un doublon de la liste courante), puis `addWhitelistedIP(address)`. En cas de succès, l'IP est ajoutée localement sans recharger la liste ; le champ n'est pas vidé.
- Suppression : une seule à la fois (`removingIp`), `removeWhitelistedIP(ip)`, retrait local en cas de succès.
- Le `<select>` « Server » (valeurs 1 / 2, lié à `server`) n'est envoyé à aucun appel.

### Alias e-mail (`/admin/email`)

- Au chargement : `getEmailsWords()` **une seule fois** (dictionnaires du générateur), puis `getEmails()` immédiatement et toutes les **60 s** via `runRefreshLoad`.
- Affichage : la liste est montrée dans l'ordre inverse de la réponse. Le champ « Filter aliases » ne masque rien : `filteredEmails` place en tête les alias dont `nom` ou `description` contient le texte (insensible à la casse), puis les autres.
- Création : `nom` et `description` obligatoires ; alias validé par Zod (regex `^[a-zA-Z0-9._-]+$`, unicité insensible à la casse) ; `addEmail(nom, description)`. L'alias n'est ajouté localement que si la réponse a `success === true`, puis le formulaire est vidé.
- Suppression : une à la fois (`removingEmail`), `removeEmail(nom)`, retrait local si `success === true`.
- Générateur (`generateRandomAlias`) : jusqu'à 100 tirages d'un alias unique au format `A{sep}{NN}B` ou `A{sep}B{sep}{xx}` (A ∈ `firstWords`, B ∈ `secondWords`, sep ∈ `-` `.` `_`, NN = 2 chiffres, xx = 2 caractères `[a-z0-9]`) ; remplit le champ alias sans rien envoyer.
- Le domaine `@cf.gaetandev.fr` est écrit en dur dans le template ; l'API ne manipule que la partie locale (`nom`).

### Proxies (`/admin/proxies`)

Deux pollings partagent le même `unsubscribe$` :

- **5 s** : `getScanningProxyServers()` (appel direct, sans toast de succès, toast d'erreur à chaque échec) → `scanningServers`.
- **60 s** : `getProxies()` via `runRefreshLoad` (toasts) → `httpProxies`, `socks5Proxies`, `lastRefresh`, puis recalcul des pays disponibles et de `proxyLimit`.

Écran :

- « Last refresh » (`lastRefresh` brut renvoyé par l'API), et pour HTTP et SOCKS5 les 15 premiers `host:port`.
- Modale « Scanning Servers » : carte par serveur (id, `status` vert si `'online'`, CPU %, RAM %) ; clic → `/admin/proxies/details/:id`.
- Modale « Proxy Checker » : protocole (`http` / `socks5`), hôte, port, serveur (`random` ou un id de `scanningServers`) → `checkProxy(...)`. Affiche `data` (pipe `json`) si `success`, sinon `error`.
- « Download Filtered Proxies » : type de proxy, filtres pays, nombre → fichier texte `host:port` par ligne, nommé `{type}-proxies-{filtres joints par _}.txt` (voir `ProxyFilterService`).

Règles des filtres pays (`ProxiesComponent` + `ProxyFilterService`) :

- `countries` = `['All', ...codes ISO triés]` du type sélectionné (`http` ou `socks5`).
- Avec un seul filtre, l'option `All` est proposée ; le bouton « + » n'apparaît que si ce filtre n'est pas `All`.
- Avec plusieurs filtres, `All` disparaît des options (`filteredCountries`) et tout filtre valant `All` est remplacé par le premier pays disponible (`updateAvailableCountries`). Ajouter un filtre peut donc créer un doublon immédiat.
- Un doublon de code ISO bloque le recalcul et le téléchargement (toast « Duplicate ISO code selected »).
- `proxyLimit` est réinitialisé au nombre de proxies correspondant aux filtres à chaque changement de type ou de filtre **et à chaque refresh de 60 s** : une valeur saisie à la main est écrasée.

### Détail serveur (`/admin/proxies/details/:id`)

- S'abonne à `route.params` ; à chaque `id`, arrête le polling précédent (`pollingStop$`) et en démarre un nouveau à **5 s** sur `getScanningProxyServersDetails(id)`.
- Affiche statut, id, localisation, barres CPU / RAM / disque / swap (couleur via `getLoadBarColor` : vert < 40, jaune < 80, rouge sinon), réseau entrant / sortant rapporté à 10 000 Mbps, et l'IP (`addressIp`) masquée par défaut (bouton « Toggle IP »).
- « Server not found. » s'affiche quand `serverDetails` est `null` (aucune réponse réussie encore).

### Utilitaires de polling (`src/app/utils/polling.utils.ts`)

- `startPolling(intervalMs, stop$, tick)` : appelle `tick()` **immédiatement**, puis à chaque `interval(intervalMs)` jusqu'à ce que `stop$` émette (`takeUntil`). Ne gère aucune erreur (c'est à `tick` de s'en occuper) et n'attend pas la fin de l'appel précédent. Renvoie la `Subscription` (aucun appelant actuel ne la conserve : l'arrêt passe toujours par `stop$` dans `ngOnDestroy`).
- `runRefreshLoad(options)` : si `isBusy()` → renvoie `false` sans rien faire (évite les chevauchements). Sinon `setBusy(true)` et souscrit à `request()` :
  - succès : `onSuccess(data)`, `setBusy(false)`, `detectChanges?.()`, puis `successToast(loadingToast)` si les deux sont fournis ;
  - erreur : `setBusy(false)`, `detectChanges?.()`, `onError?.(error)`, puis `errorToast(loadingToast)`.

Intervalles utilisés : whitelist 60 s, e-mails 60 s, liste de proxies 60 s, statut des serveurs 5 s, détail serveur 5 s.

## Contrats

### Endpoints de `AdminService`

Chemins relatifs à `environment.apiBaseUrl`. Tous reçoivent le Bearer via `authInterceptor` (voir [auth-sso.md](./auth-sso.md)). Types de réponse définis dans `src/app/types.ts`.

| Méthode du service | HTTP | Chemin | Payload | Réponse |
| --- | --- | --- | --- | --- |
| `getProxies()` | GET | `/proxies` | — | `ProxiesResponse` |
| `getScanningProxyServers()` | GET | `/proxies/servers` | — | `ScanningServer[]` |
| `getScanningProxyServersDetails(id: number)` | GET | `/proxies/servers/details?id={id}` | — | `ScanningServer` |
| `checkProxy(protocol, host, port: number, serverToCheck)` | POST | `/proxies/check` | `{ protocol, host, port, server }` — `port` converti en **chaîne**, `server` = `'random'` ou un id (chaîne, issu d'un `<option [value]>`) | `ProxyCheckResponse` |
| `getWhitelistedIPs()` | GET | `/whitelisted` | — | `string[]` |
| `addWhitelistedIP(ip)` | POST | `/whitelisted/add` | `{ address }` | texte brut (`responseType: 'text'`) |
| `removeWhitelistedIP(ip)` | POST | `/whitelisted/delete` | `{ address }` | texte brut (`responseType: 'text'`) |
| `getEmails()` | GET | `/mail/getEmails` | — | `AdminEmail[]` |
| `addEmail(nom, description)` | POST | `/mail` | `{ nom, description }` | `AdminMutationResponse` |
| `removeEmail(nom)` | DELETE | `/mail` | corps JSON `{ nom }` (via `httpClient.request('delete', …, { body })`) | `AdminMutationResponse` |
| `getEmailsWords()` | GET | `/mail/getWords` | — | `EmailWordsResponse` |

Autres membres : `isLogged` (getter → `SsoService.isAuthenticated`, non utilisé actuellement) et `logout()` (délègue à `SsoService.logout()`).

### `ProxyFilterService`

| Méthode | Comportement |
| --- | --- |
| `getDuplicateISO(filters)` | Codes présents plus d'une fois (chacun une fois) |
| `collectCountries(proxies)` | Codes `geolocation.country.iso_code` uniques, triés ; ignore les proxies sans code |
| `filterProxies(proxies, countryFilters, limit?)` | Aucun filtre pays si `countryFilters` vaut exactement `['All']` ; sinon garde les proxies dont le code est dans la liste (`'All'` mélangé à d'autres codes ne correspond à rien) ; puis `slice(0, limit)` si `limit` est fourni |
| `downloadAsTextFile(lines, filename)` | `Blob` `text/plain` (lignes jointes par `\n`), clic sur un `<a download>` créé à la volée, puis `URL.revokeObjectURL` immédiat |

## Points d'attention

- **Toasts de chargement orphelins** : en cas d'erreur, les callbacks `errorToast` passés à `runRefreshLoad` (whitelist, e-mails, proxies) ignorent l'id reçu et créent un nouveau toast d'erreur ; le toast « Refreshing… » correspondant n'est pas remplacé.
- **Toasts répétés** : chaque refresh de 60 s affiche un toast de chargement puis de succès ; le statut des serveurs (5 s) affiche un toast d'erreur à chaque échec, soit un toutes les 5 s si l'API est indisponible.
- **Clignotement du détail serveur** : `DetailserverComponent.subscribeToServer` remet `isLoading` à `true` à chaque tick de 5 s, ce qui réaffiche le skeleton à la place des données à chaque rafraîchissement.
- **Compteur « … N more »** dans `proxies.component.html` : affiche la longueur totale de la liste, pas le nombre de proxies au-delà des 15 affichés.
- **Générateur d'alias avant chargement des mots** : si `getEmailsWords()` n'a pas encore répondu (ou a échoué), `firstWords` / `secondWords` sont vides et l'alias généré contient `undefined`. Le signal `wordsLoaded` est alimenté mais n'est lu nulle part (le bouton n'est pas désactivé).
- **Mises à jour optimistes locales** : après ajout/suppression, la liste locale est modifiée sans relecture ; le prochain polling (jusqu'à 60 s) remplace l'état par celui du serveur.
- Les requêtes HTTP lancées par un tick ne sont pas annulées à la destruction du composant : seul le polling s'arrête.
- **Conventions non respectées dans cette zone** (à connaître avant de modifier) : `AdminComponent` et `TempladminComponent` sont en `ChangeDetectionStrategy.Eager` (les autres écrans sont en `OnPush` avec signals) ; `AdminService` et `TempladminComponent` injectent par constructeur ; tous les textes du back-office (anglais et quelques libellés français) sont en dur dans les templates et les toasts, sans passer par `I18nService` ; `email.component.ts` importe `AdminService` par le chemin non relatif `src/app/services/admin/admin.service`.
- Dans la barre latérale repliée, Whitelist, Proxies et E-Mail utilisent la même icône (étoile).
- `TempladminComponent.logout()` affiche « Successfully logged out » avant même l'appel de révocation.
- Les composants en `OnPush` modifient des champs non-signal via `ngModel` (`address`, `emailName`, `proxyHost`…) : cela fonctionne parce que les changements viennent d'événements du template. Si tu modifies ces champs depuis un callback asynchrone, passe par un signal.

## Tests

- `src/app/services/admin/proxy-filter.service.spec.ts` : doublons ISO, collecte triée des pays, filtre `All`, filtre par pays + limite. Seule spec avec de la logique.
- `admin.component.spec.ts`, `whitelist.component.spec.ts`, `email.component.spec.ts`, `proxies.component.spec.ts`, `detailserver.component.spec.ts` (avec `ActivatedRoute` simulé, `id: '1'`), `templadmin.component.spec.ts`, `admin.service.spec.ts` : création uniquement. Les specs de composants fournissent `provideHttpClientTesting()` mais ne vérifient aucune requête.
- Non couverts : `polling.utils.ts` (aucune spec), validations Zod, logique de filtres pays de `ProxiesComponent`, générateur d'alias, contrats HTTP d'`AdminService`, `downloadAsTextFile`.
- Lancement ciblé : `npx ng test --watch=false --browsers=ChromeHeadlessCI --include src/app/services/admin --include src/app/components/base/admin`.

## Recettes

- **Ajouter un écran admin** : créer le composant sous `src/app/components/base/admin/<nom>/` en l'enveloppant dans `<app-templadmin>` ; ajouter la route dans `admin.routes.ts` avec `canActivate: [AuthGuard]` ; ajouter le lien dans les **deux** listes (ouverte et repliée) de `templadmin.component.html`.
- **Ajouter un endpoint** : ajouter une méthode à `AdminService` en construisant l'URL depuis `API_BASE` (le préfixe `environment.apiBaseUrl` déclenche le Bearer) ; déclarer le type de réponse dans `src/app/types.ts` ; préciser `responseType: 'text'` si l'API ne renvoie pas de JSON.
- **Rafraîchir périodiquement des données** : `startPolling(ms, this.unsubscribe$, () => this.load())` dans `ngOnInit`, `unsubscribe$.next()` + `complete()` dans `ngOnDestroy` ; dans `load`, utiliser `runRefreshLoad` avec un signal `isLoading` pour éviter les chevauchements.
- **Changer une règle de filtrage des proxies** : modifier `ProxyFilterService` (logique pure) et sa spec, puis ajuster `updateAvailableCountries` / `updateProxyLimit` dans `ProxiesComponent` si l'UI des filtres change.

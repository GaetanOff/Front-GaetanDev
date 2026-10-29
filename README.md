# Front-GaetanDev

Portfolio et vitrine de [gaetandev.fr](https://gaetandev.fr) : site bilingue FR/EN, chatbot IA, visite guidée vocale et back-office `/admin` protégé par SSO.
Angular 22 (standalone, signals), Tailwind CSS 4, tests Karma/Jasmine.

## Démarrer

```bash
npm ci
npm start            # http://localhost:4200
npm run build        # dist/Front-Gaetan2mz-V2
npm run test:ci      # tests unitaires en ChromeHeadless
npm run docs:check   # couverture de la documentation
```

Tailwind est compilé par le build Angular : pas de commande séparée.

## Documentation

- [AGENTS.md](AGENTS.md) : conventions, garde-fous et système de documentation (point d'entrée pour les agents IA).
- [docs/](docs/README.md) : architecture, routage et i18n, fonctionnalités, SEO, outillage.

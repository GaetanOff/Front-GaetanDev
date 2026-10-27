---
title: Index de la documentation
sources:
updated: 2026-10-27
---

# Documentation du projet

Documentation technique du portfolio gaetandev.fr, écrite pour les développeurs et les agents IA.
Les règles d'écriture et de mise à jour sont dans la section *Système de documentation* de [AGENTS.md](../AGENTS.md).

## Socle

- [Architecture](architecture.md) : bootstrap, composant racine, environnements, types partagés, styles globaux.
- [Routage et i18n](routing-i18n.md) : routes, préfixes de langue, `LanguageGuard`, traductions.
- [Outillage](tooling.md) : build, tests, CI, dépendances, Tailwind.
- [SEO](seo.md) : `SeoService`, `index.html`, sitemap, robots, `llms.txt`.

## Fonctionnalités

- [Pages publiques](features/public-pages.md) : accueil, à propos, réalisations, sections parcours, services, mentions légales, erreur.
- [Contact](features/contact.md) : formulaire, EmailJS, captcha, limitation d'envoi.
- [Authentification SSO](features/auth-sso.md) : OIDC + PKCE, garde, intercepteur.
- [Back-office](features/admin.md) : whitelist, emails, proxies.
- [Chatbot](features/chatbot.md) : assistant IA flottant.
- [Visite guidée vocale](features/voice-tour.md) : moteur et étapes ; [script de narration](voice-tour.md) des MP3.

## Gabarit

[_template.md](_template.md) : structure à copier pour une nouvelle page.

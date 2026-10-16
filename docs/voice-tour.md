# Visite guidée vocale — script de narration

Chaque étape de la visite joue un MP3 et affiche le même texte en sous-titres.
Génère un fichier par étape et par langue avec Cartesia, puis dépose-le **exactement** au chemin indiqué.

- Format : MP3, 44,1 kHz, mono ou stéréo (128 kbps suffit).
- Garde la même voix et la même vitesse sur toutes les étapes.
- Pas de silence long en début/fin de fichier : l'enchaînement ajoute déjà ~0,7 s entre deux étapes.
- Si un fichier manque, la visite fonctionne quand même en mode « sous-titres uniquement ».
- Les sous-titres viennent de `src/assets/i18n/{fr,en}.json` (clé `tour.steps`). Si tu modifies un texte ici pour la prononciation, garde le JSON aligné pour que le défilement des mots reste synchro.
- L'ordre et les cibles des étapes sont définis dans `src/app/services/tour/tour.steps.ts`.

## Français → `src/assets/audio/tour/fr/`

### `01-intro.mp3` — Bienvenue

```text
Bienvenue. Je vais vous accompagner pendant quelques instants, à la découverte de l'univers de Gaëtan Faucher. Développeur Fullstack, DevOps, et passionné d'intelligence artificielle. Installez-vous. On commence.
```

### `02-navigation.mp3` — Navigation

```text
Tout part d'ici. Une navigation pensée pour aller à l'essentiel : son parcours, ses réalisations, et un accès direct pour le contacter.
```

### `03-about.mp3` — À propos

```text
Voici Gaëtan. Basé à Montpellier, il conçoit des solutions qui réunissent le code, le cloud et l'automatisation. Avec une seule obsession : que la technologie serve vraiment votre projet.
```

### `04-services.mp3` — Services

```text
Trois expertises. Le développement sur mesure, multiplateforme. Le DevOps : pipelines d'intégration continue, conteneurs, et infrastructure as code. Et les solutions d'intelligence artificielle, de l'intégration de modèles jusqu'à l'automatisation de vos workflows.
```

### `05-skills.mp3` — Stack technique

```text
Sous le capot, une stack moderne. Go, Python, TypeScript. AWS, Terraform, Kubernetes. Et tout l'écosystème de la donnée et de l'IA.
```

### `06-experience.mp3` — Parcours

```text
Un parcours construit sur le terrain. Chaque expérience a forgé la même conviction : livrer vite, livrer bien, et livrer durable.
```

### `07-certifications.mp3` — Certifications

```text
Des compétences validées par des certifications reconnues. Parce que l'exigence, ça se prouve.
```

### `08-achievements.mp3` — Réalisations

```text
Place aux réalisations. Applications web, réseau de distribution de contenu, pipelines MLOps, infrastructures de serveurs de jeux. Des projets concrets, du premier commit jusqu'à la production.
```

### `09-contact.mp3` — Contact

```text
Un projet en tête ? C'est ici que tout commence. Quelques mots suffisent, et Gaëtan vous répond sous quarante-huit heures.
```

### `10-assistant.mp3` — Assistant IA

```text
Et si vous êtes pressé, son assistant IA est disponible à tout moment, juste ici. Posez-lui toutes vos questions.
```

### `11-outro.mp3` — À bientôt

```text
Merci pour votre visite. La suite, c'est à vous de l'écrire. À très vite.
```

## English → `src/assets/audio/tour/en/`

### `01-intro.mp3` — Welcome

```text
Welcome. For the next few moments, I'll be your guide through the world of Gaëtan Faucher. Fullstack developer, DevOps engineer, and passionate about artificial intelligence. Sit back. Let's begin.
```

### `02-navigation.mp3` — Navigation

```text
It all starts here. A navigation designed to get straight to the point: his background, his work, and a direct line to reach him.
```

### `03-about.mp3` — About

```text
Meet Gaëtan. Based in Montpellier, he builds solutions that bring together code, cloud and automation. With one obsession: making technology truly serve your project.
```

### `04-services.mp3` — Services

```text
Three areas of expertise. Custom, cross-platform development. DevOps: continuous integration pipelines, containers, and infrastructure as code. And artificial intelligence solutions, from model integration all the way to automating your workflows.
```

### `05-skills.mp3` — Tech stack

```text
Under the hood, a modern stack. Go, Python, TypeScript. AWS, Terraform, Kubernetes. And the whole data and AI ecosystem.
```

### `06-experience.mp3` — Experience

```text
A career built in the field. Every experience has shaped the same belief: ship fast, ship well, and ship to last.
```

### `07-certifications.mp3` — Certifications

```text
Skills backed by recognized certifications. Because high standards should be proven.
```

### `08-achievements.mp3` — Achievements

```text
Now, the work. Web applications, a content delivery network, MLOps pipelines, game server infrastructures. Real projects, from the very first commit all the way to production.
```

### `09-contact.mp3` — Contact

```text
Got a project in mind? This is where it all begins. A few words are enough, and Gaëtan will get back to you within forty-eight hours.
```

### `10-assistant.mp3` — AI assistant

```text
And if you're in a hurry, his AI assistant is available anytime, right here. Ask it anything.
```

### `11-outro.mp3` — See you soon

```text
Thank you for visiting. What comes next is yours to write. See you very soon.
```


import { Injectable, signal, computed, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private _isEnglish = signal<boolean>(this.getInitialLanguage());

  public readonly isEnglish = this._isEnglish.asReadonly();
  public readonly text = computed(() => this.getTexts(this.isEnglish()));

  constructor() {
    effect(() => {
      try {
        localStorage.setItem('isEnglish', JSON.stringify(this.isEnglish()));
      } catch (e) {
        console.error('Could not access localStorage.', e);
      }
    });
  }

  private getInitialLanguage(): boolean {
    // First, try to detect from URL if language prefix is present
    if (typeof window !== 'undefined') {
      const urlMatch = window.location.pathname.match(/^\/(fr|en)(\/|$)/);
      if (urlMatch) {
        return urlMatch[1] === 'en';
      }
    }
    
    // If no language prefix in URL, use localStorage or default to French
    try {
      const storedLang = localStorage.getItem('isEnglish');
      return storedLang ? JSON.parse(storedLang) : false; // Default to French
    } catch (e) {
      console.error('Could not access localStorage.', e);
      return false;
    }
  }

  public toggleLanguage(): void {
    this._isEnglish.update(isEnglish => !isEnglish);
  }

  public setLanguage(lang: 'fr' | 'en'): void {
    this._isEnglish.set(lang === 'en');
  }

  private getTexts(isEnglish: boolean) {
    return {
      "lang": (isEnglish ? "Language changed to english." : "Langue changé en français."),
      "title": {
        "about": (isEnglish ? "About Me" : "A Propos"),
        "achievements": (isEnglish ? "Achievements" : "Réalisations"),
        "cgv": (isEnglish ? "TOS/CGV" : "CGU/CGV"),
        "legal": (isEnglish ? "Legal mention" : "Mention légales"),
      },
      "learnMoreButton": (isEnglish ? "Learn more" : "En savoir plus"),
      "desc": (isEnglish ?
          "I am a Fullstack and DevOps developer, passionate about automation, Cloud and integrating AI into concrete solutions." :
          "Je suis développeur Fullstack et DevOps, passionné par l'automatisation, le Cloud et l'intégration de l'IA dans des solutions concrètes."
      ),
      "navbar": {
        "home": (isEnglish ? "Home" : "Accueil"),
        "about": (isEnglish ? "About Me" : "A Propos"),
        "achievements": (isEnglish ? "Achievements" : "Réalisations"),
      },
      "footer": {
        "legal": (isEnglish ? "Legal mention" : "Mention légales"),
        "cgv": (isEnglish ? "TOS/CGV" : "CGU/CGV"),
        "devWithLove": (isEnglish ? "Developed and designed with ❤️ by Gaëtan Faucher" : "Développé et conçu avec ❤️ par Gaëtan Faucher"),
      },
      "home": {
        "welcome": (isEnglish ? "Hello, I'm Gaëtan" : "Bonjour, je suis Gaëtan"),
        "contactButton": (isEnglish ? "Contact me" : "Me contacter"),
      },
      "contact": {
        "title": (isEnglish ? "Contact me" : "Me contacter"),
        "nameLabel": (isEnglish ? "Name" : "Nom"),
        "emailLabel": "Email",
        "messageLabel": "Message",
        "sendButton": (isEnglish ? "Send Message" : "Envoyer le message"),
        "sendingButton": (isEnglish ? "Sending..." : "Envoi en cours..."),
        "validation": {
          "nameRequired": (isEnglish ? "Your name is required." : "Votre nom est requis."),
          "nameMinLength": (isEnglish ? "Your name must be at least 3 characters long." : "Votre nom doit comporter au moins 3 caractères."),
          "emailRequired": (isEnglish ? "Your email is required." : "Votre e-mail est requis."),
          "emailInvalid": (isEnglish ? "Please enter a valid email address." : "Veuillez entrer une adresse e-mail valide."),
          "messageRequired": (isEnglish ? "A message is required." : "Un message est requis."),
          "captchaInvalid": (isEnglish ? "Verification failed. Please confirm you're not a robot." : "Vérification échouée. Merci de confirmer que vous n'êtes pas un robot."),
        },
        "form": {
          "nameInvalid": (isEnglish ? "Your name must be at least 3 characters long." : "Votre nom doit comporter au moins 3 caractères."),
          "mailInvalid": (isEnglish ? "Please enter a valid email address." : "Veuillez entrer une adresse e-mail valide."),
          "messageInvalid": (isEnglish ? "A message is required." : "Un message est requis."),
          "captchaInvalid": (isEnglish ? "Verification failed. Please confirm you're not a robot." : "Vérification échouée. Merci de confirmer que vous n'êtes pas un robot."),
          "limit": (isEnglish ? "Please wait a moment before sending another message." : "Veuillez patienter quelques instants avant d'envoyer un nouveau message."),
          "loading": (isEnglish ? "Sending..." : "Envoi en cours..."),
          "success": (isEnglish ? "Your message has been sent successfully! I'll get back to you soon." : "Votre message a été envoyé avec succès ! Je vous répondrai bientôt."),
          "server": (isEnglish ? "An error occurred. Please try again later." : "Une erreur est survenue. Veuillez réessayer plus tard."),
        },
        "limitMessage": (isEnglish ? "Please wait a moment before sending another message." : "Veuillez patienter quelques instants avant d'envoyer un nouveau message."),
        "successMessage": (isEnglish ? "Your message has been sent successfully! I'll get back to you soon." : "Votre message a été envoyé avec succès ! Je vous répondrai bientôt."),
        "errorMessage": (isEnglish ? "An error occurred. Please try again later." : "Une erreur est survenue. Veuillez réessayer plus tard."),
      },
      "about": {
        "title": (isEnglish ? "About me" : "A propos de moi"),
        "role": (isEnglish ? "Hello, I am Gaëtan Faucher." : "Bonjour, je suis Gaëtan Faucher."),
        "cvButton": (isEnglish ? "Download my CV" : "Télécharger mon CV"),
        "cvNotAvailable": (isEnglish ? "CV is not available at the moment." : "Le CV n'est pas disponible pour le moment."),
      },
      "achievements": {
        "title": (isEnglish ? "My Achievements" : "Mes Réalisations"),
        "description": (isEnglish ? "Here's a list of my accomplishments that I am allowed to showcase publicly. Please note that some of my accomplishments are not included on this list due to non-disclosure agreements in effect." : "Voici une liste de mes réalisations dont j'ai l'autorisation de partager publiquement. Veuillez noter que certaines de mes réalisations ne figurent pas sur cette liste en raison de contrats de confidentialité en vigueur."),
        "list": [
          {
            "name": "llmops-finetune-pipeline",
            "description": (isEnglish ? "End-to-end MLOps pipeline for fine-tuning and deploying small open-source LLMs with LoRA." : "Pipeline MLOps de bout en bout pour le fine-tuning et le déploiement de petits LLM open-source avec LoRA."),
            "image": "assets/img/achievements/llmops-finetune-pipeline.webp",
            "redirect": "https://github.com/GaetanOff/llmops-finetune-pipeline",
            "categories": ["DEV"]
          },
          {
            "name": "TMConseils",
            "description": (!isEnglish ? "Application web pour une entreprise d'accompagnement stratégique sur mesure." : "Web application for a customized strategic coaching company."),
            "image": "assets/img/achievements/tmconseils.webp",
            "redirect": "https://tm-conseils.net/",
            "categories": ["DEV"]
          },
          {
            "name": "LookAway",
            "description": (!isEnglish ? "Application macOS pour protéger vos yeux en vous invitant à faire des pauses régulières." : "A macOS menu-bar application to protect your eyes by prompting regular breaks."),
            "image": "assets/img/achievements/lookaway.webp",
            "redirect": "https://github.com/GaetanOff/LookAway",
            "categories": ["DEV"]
          },
          {
            "name": "Content Delivery Network",
            "description": (isEnglish ? "My content distribution network to be able to have a fast and reliable distribution." : "Mon réseau de distribution de contenu pour pouvoir avoir une diffusion rapides et fiables."),
            "image": "assets/img/achievements/cdn.webp",
            "redirect": "https://cdn.gaetandev.fr/",
            "categories": ["SYS", "DO"]
          },
          {
            "name": "TCPing",
            "description": (!isEnglish ? "Outil léger de test de connexion TCP." : "A lightweight TCP connection testing tool."),
            "image": "assets/img/achievements/tcping.webp",
            "redirect": "https://github.com/GaetanOff/TCPing",
            "categories": ["SYS", "DO"]
          },
          {
            "name": "PixelmonGo",
            "description": (isEnglish ? "Management of the infrastructure of the entire server." : "Gestion de l'infrastructure de l'ensemble du serveur."),
            "image": "assets/img/achievements/pixelmongo.webp",
            "redirect": "https://pixelmongo.fr/",
            "categories": ["SYS"]
          },
          {
            "name": "FirstSky",
            "description": (isEnglish ? "Management of the infrastructure of the entire server." : "Gestion de l'infrastructure de l'ensemble du serveur."),
            "image": "assets/img/achievements/firstsky.webp",
            "redirect": "https://firstsky.net/",
            "categories": ["SYS"]
          },
          {
            "name": "Hôtel Neptune",
            "description": (isEnglish ? "School project for creating a web application for a fictitious hotel." : "Projet d'école de création d'une application web pour un hôtel fictif."),
            "image": "assets/img/achievements/neptune.webp",
            "redirect": "https://github.com/Projet-Hotel-Neptune-GLJQR/Application",
            "categories": ["DEV", "DO"]
          },
          {
            "name": "FoxFood",
            "description": (isEnglish ? "School project for creating a fictitious company." : "Projet d'école de création d'une entreprise fictive."),
            "image": "assets/img/achievements/foxfood.svg",
            "redirect": "https://github.com/Fox-Food",
            "categories": ["DEV", "DO"]
          },
          {
            "name": "ImmoCT",
            "description": (isEnglish ? "Web application for an independent real estate agent that allows them to showcase their listings." : "Application web pour un agent immobilier indépendant qui permet de mettre en avant ses offres."),
            "image": "assets/img/achievements/immoct.webp",
            "redirect": "https://www.immoct.fr/",
            "categories": ["DEV", "DO"]
          },
          {
            "name": "CT-Energetique",
            "description": (isEnglish ? "Web application for a Chinese medicine company." : "Application web pour une entreprise de médécine chinoise."),
            "image": "assets/img/achievements/ctenergetique.webp",
            "redirect": "https://www.ct-energetique.fr/",
            "categories": ["DEV", "DO"]
          },
          {
            "name": "HeavyCloud",
            "description": (isEnglish ? "Creation of a hosting provider offering VPS as well as Anti-DDoS solutions." : "Création d'un hébergeur proposant des VPS ainsi que des solutions Anti-DDoS."),
            "image": "assets/img/achievements/heavycloud.webp",
            "redirect": "",
            "categories": ["DEV"]
          },
          {
            "name": "ChloeCM",
            "description": (isEnglish ? "Web application to showcase the journey of a Master's degree student." : "Application web pour présenter le parcours d'une étudiante en Master."),
            "image": "assets/img/achievements/chloecm.webp",
            "redirect": "https://www.chloecm.fr/",
            "categories": ["DEV"]
          },
          {
            "name": "VitaPot",
            "description": (isEnglish ? "Management of the development of an practice minecraft server." : "Gestion du développement d'un serveur minecraft practice."),
            "image": "assets/img/achievements/VitaPot.webp",
            "redirect": "https://twitter.com/vitapot",
            "categories": ["DEV", "SYS"]
          },
          {
            "name": "PvPIng",
            "description": (isEnglish ? "Development of an practice minecraft server." : "Développement d'un serveur minecraft practice."),
            "image": "assets/img/achievements/pvping.webp",
            "redirect": "https://twitter.com/ServeurPvPing",
            "categories": ["DEV", "SYS"]
          },
          {
            "name": "RealMC",
            "description": (isEnglish ? "Creation/Management/Development of a practice minecraft server." : "Création/Gestion/Développement d'un serveur minecraft practice."),
            "image": "assets/img/achievements/realmc.webp",
            "redirect": "https://youtu.be/SD1547llpvI",
            "categories": ["DEV", "SYS"]
          },
          {
            "name": "LiptonPvP",
            "description": (isEnglish ? "Creation/Management/Development of a practice minecraft server." : "Création/Gestion/Développement d'un serveur minecraft practice."),
            "image": "assets/img/achievements/liptonpvp.webp",
            "redirect": "https://youtu.be/l5aYEVQmop8",
            "categories": ["DEV", "SYS"]
          }
        ]
      },
      "services": {
        "title": (isEnglish ? "What I offer" : "Ce que je propose"),
        "devis": (isEnglish ? "Quotation" : "Sur devis"),
        "contactButton": (isEnglish ? "Contact me" : "Contactez-moi"),
        "perDay": "/" + (isEnglish ? "day" : "jour"),
        "devTitle": (isEnglish ? "Development" : "Développement"),
        "dev": [
          (isEnglish ? "Custom development" : "Développement sur mesure"),
          (isEnglish ? "Multi-platform" : "Multi plateforme"),
          (isEnglish ? "Advice" : "Conseil"),
        ],
        "devopsTitle": "DevOps",
        "devops": [
          (isEnglish ? "CI/CD Pipelines" : "Pipelines CI/CD"),
          (isEnglish ? "Containerization (Docker/K8s)" : "Conteneurisation (Docker/K8s)"),
          (isEnglish ? "Infrastructure as Code" : "Infrastructure as Code"),
        ],
        "iaTitle": (isEnglish ? "AI Solutions" : "Solutions IA"),
        "ia": [
          (isEnglish ? "Model integration" : "Intégration de modèles"),
          (isEnglish ? "Workflow automation" : "Automatisation de workflows"),
          (isEnglish ? "AI audit & strategy" : "Audit & stratégie IA"),
        ]
      },
      "cv": {
        "competences": {
          "title": (isEnglish ? "Main technologies used" : "Principales technologies utilisées"),
        },
        "certif": {
          "title": (isEnglish ? "Certificates" : "Certifications"),
        },
        "experience": {
          "title": (isEnglish ? "Experiences" : "Expériences"),
        },
        "languages": {
          "title": (isEnglish ? "Languages" : "Langues"),
          "langList": [
            (isEnglish ? "French" : "Français"),
            (isEnglish ? "English" : "Anglais"),
          ]
        },
        "today": (isEnglish ? "Today" : "Aujourd'hui"),
        "unknownDuration": (isEnglish ? "Unknown duration" : "Durée inconnue"),
        "lessThanMonth": (isEnglish ? "Less than a month" : "Moins d'un mois"),
        "year": (isEnglish ? "year" : "an"),
        "years": (isEnglish ? "years" : "ans"),
        "month": (isEnglish ? "month" : "mois"),
        "months": (isEnglish ? "months" : "mois"),
        "and": (isEnglish ? "and" : "et"),
      },
      "chatbot": {
        "title": (isEnglish ? "AI Assistant" : "Assistant IA"),
        "subtitle": (isEnglish ? "Ask me anything!" : "Posez-moi vos questions !"),
        "toggle": (isEnglish ? "Open chat" : "Ouvrir le chat"),
        "close": (isEnglish ? "Close chat" : "Fermer le chat"),
        "clear": (isEnglish ? "Clear conversation" : "Effacer la conversation"),
        "placeholder": (isEnglish ? "Type your message..." : "Tapez votre message..."),
        "captchaPlaceholder": (isEnglish ? "Complete verification first..." : "Complétez la vérification..."),
        "send": (isEnglish ? "Send" : "Envoyer"),
        "welcome": (isEnglish ? "Hello! I'm Gaëtan's AI assistant. How can I help you today?" : "Bonjour ! Je suis l'assistant IA de Gaëtan. Comment puis-je vous aider ?"),
        "error": (isEnglish ? "Sorry, an error occurred. Please try again." : "Désolé, une erreur s'est produite. Veuillez réessayer."),
        "captchaTitle": (isEnglish ? "Quick verification" : "Vérification rapide"),
        "captchaDescription": (isEnglish ? "Please complete this quick verification to start chatting with the AI assistant." : "Merci de compléter cette vérification rapide pour pouvoir discuter avec l'assistant IA."),
        "captchaError": (isEnglish ? "Verification failed. Please try again." : "La vérification a échoué. Veuillez réessayer."),
      },
      "error": {
        "notfound": {
          "title": (isEnglish ? "Page not found" : "Page introuvable"),
          "description": (isEnglish ? "The page you are looking for does not exist." : "La page que vous cherchez n'existe pas."),
          "moved": (isEnglish ? "It might have been moved or deleted." : "Elle pourrait avoir fait l'objet d'un transfert ou d'une suppression."),
          "button": (isEnglish ? "Go to the home page" : "Retourner à la page d'accueil")
        }
      },
      "legal": {
        "declaration": (isEnglish ? "Statement" : "Déclaration"),
        "declarationText": [
          (isEnglish ? "GaetanDev.fr edited by: FAUCHER Gaëtan Individual entrepreneur" : "GaetanDev.fr édité par: FAUCHER Gaëtan Entrepreneur individuel"),
          "Siret: 91028598000017, CFE URSSAF 34",
          (isEnglish ? "Adress" : "Adresse") + ": 509 RUE DE BUGAREL 34070 MONTPELLIER",
          (isEnglish ? "Director of publication" : "Directeur de la publication") + ": Gaëtan Faucher - contact@gaetandev.fr",
        ],
        "host": (isEnglish ? "Host" : "Hébergeur"),
        "hostText": (isEnglish ? "The gaetandev.fr site is hosted on the servers of Amazon Web Services Inc, PO Box 81226, Seattle, WA 981808-1226 – USA. https://aws.amazon.com/en/compliance/eu-data-protection/." : "Le site gaetandev.fr est hébergé sur les serveurs de Amazon Web Services Inc, PO Box 81226, Seattle, WA 981808-1226 – USA. https://aws.amazon.com/fr/compliance/eu-data-protection/."),
        "reproductionTitle": (isEnglish ? "Reproduction" : "Reproduction"),
        "reproductionText": (isEnglish ? "This entire site is subject to international legislation on copyright and intellectual property." : "L'ensemble de ce site relève des législations internationales sur le droit d'auteur et la propriété intellectuelle."),
        "copyrightText": (isEnglish ? "All reproduction rights are reserved." : "Tous les droits de reproduction sont réservés."),
        "preamble": (isEnglish ? "Preamble" : "Préambule"),
        "preambleText": [
          (isEnglish ? "Access to the gaetandev.fr site is free, with no obligation to purchase." : "L'accès au site gaetandev.fr est gratuit, sans obligation d'achat."),
          (isEnglish ? "The gaetandev.fr site reserves the right to modify" : "Le site gaetandev.fr se réserve le droit de modifier"),
          (isEnglish ? "without notice or announcement of these general conditions of sale which must" : "sans préavis ou annonce les présentes conditions générales de vente qui devront"),
          (isEnglish ? "be consulted before any purchase. The user must be of legal age or" : "être consultées avant tout achat. L'utilisateur doit être majeur ou"),
          (isEnglish ? "have authorization from their manager before making a purchase." : "disposer d'une autorisation de son responsable avant d'effectuer un achat."),
        ],
        "definitions": (isEnglish ? "Definitions" : "Définitions"),
        "definitionsText": [
          (isEnglish ? "The services belonging to gaetandev.fr constitute all the services available at the URL https://gaetandev.fr/." : "Les services appartenant à gaetandev.fr constituent l'ensemble des services disponibles à l'URL https://gaetandev.fr/.")
        ],
        "cgu": (isEnglish ? "Terms of use" : "Conditions d'utilisation"),
        "cguText": [
          (isEnglish ? "All items offered on the gaetandev.fr website remain the exclusive property of" : "Tous les articles proposés sur le site gaetandev.fr restent la propriété exclusive de"),
          (isEnglish ? "gaetandev.fr. As such, no one has the right to sell or resell the content belonging to" : "gaetandev.fr. À ce titre personne n'a le droit de vendre ou revendre le contenu appartenant à"),
          (isEnglish ? "gaetandev.fr without permission. Failure to comply with the conditions of use or sale may lead to" : "gaetandev.fr sans autorisation. Un non-respect des conditions d'utilisation ou de vente pourra conduire à des"),
          (isEnglish ? "proceedings and a ban on the use of all gaetandev.fr services." : "poursuites et une interdiction d'utilisation de tous les services de gaetandev.fr."),
        ],
        "command": (isEnglish ? "Order process" : "Processus de commande"),
        "commandText": [
          (isEnglish ? "Any validated order constitutes an irrevocable acceptance of the general conditions of sale and the" : "Toute commande validée constitue une acception irrévocable des conditions générales de vente et du"),
          (isEnglish ? "payment and validate your transaction. The data recorded by gaetandev.fr constitute the proof" : "paiement et validera votre transaction. Les données enregistrée par gaetandev.fr constituent la preuve"),
          (isEnglish ? "of all transactions made by gaetandev.fr and its customers. The data recorded by" : "de l'ensemble des transactions passées par gaetandev.fr et ses clients. Les données enregistrées par"),
          (isEnglish ? "the payment system constitutes proof of financial transactions." : "le système de paiement constitue la preuve des transactions financières."),
        ],
        "payment": (isEnglish ? "Payment" : "Paiement"),
        "paymentText": [
          (isEnglish ? "Payment is made online through Paypal." : "Le paiement s'effectue en ligne par le biais de Paypal."),
          (isEnglish ? "Personal information and credit card numbers never circulate" : "Les informations personnelles ainsi que les numéros de carte bancaire ne circulent jamais"),
          (isEnglish ? "in plain text between the browser and the server, the data is encrypted and transmitted by the SSL protocol." : "en clair entre le navigateur et le serveur, les données sont chiffrées et transmises par le protocole SSL."),
        ],
        "retractation": (isEnglish ? "Right to retract" : "Droit de rétractation"),
        "retractationText": [
          (isEnglish ? "Notwithstanding article L. 121-20-2 of the French Consumer Code," : "Par dérogation à l'article L. 121-20-2 du Code Français de la consommation,"),
          (isEnglish ? "the customer no longer has the right of withdrawal" : "le client n'a plus le droit de rétractation"),
          (isEnglish ? "from the date and time of provision of services. By way of derogation from article" : "à compter de la date et heure de fourniture de services. Par dérogation à l'article"),
          (isEnglish ? "L. 121-20-1 of the French Consumer Code, the customer has a right of withdrawal of 7 (seven) days if the service has not yet been delivered." : "L. 121-20-1 du Code Français de la consommation, le client a un droit de rétractation de 7 (sept) jours si le service n'a pas encore été livré."),
          (isEnglish ? "This right of withdrawal is made by message to the email address" : "Ce droit de rétractation s'effectue par message à l'adresse mail") + ": contact@gaetandev.fr",
        ],
        "price": (isEnglish ? "Prices" : "Tarifs"),
        "priceText": [
          (isEnglish ? "The rates are communicated to the customer through a quote and an invoice." : "Les tarifs sont communiqués au client grâce à un devis et une facture."),
          (isEnglish ? "The gaetandev.fr site reserves the right to modify its prices at any time." : "Le site gaetandev.fr se réserve le droit de modifier ses prix à tout moment."),
        ],
      }
    };
  }
}

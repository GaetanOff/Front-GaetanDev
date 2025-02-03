import {EventEmitter, Injectable} from '@angular/core';
import {LocalstorageService} from "../localstorage/localstorage.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  isFrench: boolean = false;
  text: any;
  updateEvent: EventEmitter<any> = new EventEmitter();

  constructor(private localStorage: LocalstorageService, private router: Router) {
    const englishQueryParam: boolean = window.location.href.includes("/en");
    const frenchQueryParam: boolean = window.location.href.includes("/fr");
    const hasCache: boolean = (this.localStorage.get.getItem("english") === "true");

    if (englishQueryParam) {
      this.localStorage.get.setItem("english", "true");
      this.isFrench = true;
      this.router.navigate([""]).then(() => console.log("Redirected to english version"));
    } else if (frenchQueryParam) {
      this.localStorage.get.setItem("english", "false");
      this.isFrench = false;
      this.router.navigate([""]).then(() => console.log("Redirected to french version"));
    } else if (hasCache) {
      this.isFrench = true;
    }

    this.update();
  }


  update(): void {
    this.text = {
      "lang": (this.isFrench ? "Langue changé en français." : "Language changed to english."),
      "title": {
        "about": (this.isFrench ? "About Me" : "A Propos"),
        "achievements": (this.isFrench ? "Achievements" : "Réalisations"),
        "cgv": (this.isFrench ? "TOS/CGV" : "CGU/CGV"),
        "legal": (this.isFrench ? "Legal mention" : "Mention légales"),
      },
      "devWithLove": (this.isFrench ?
          "Developed and designed with ❤️ by Gaëtan Faucher" :
          "Développé et conçu avec ❤️ par Gaëtan Faucher"
      ),
      "learnMoreButton": (this.isFrench ? "Learn more" : "En savoir plus"),
      "learnMoreButtonAchievements": (this.isFrench ? "See more" : "Voir plus de réalisations"),
      "desc": (this.isFrench ?
          "I am a young full-stack developer and DevOps ! I am very interested in new technologies, development and computing." :
          "Je suis un jeune développeur full-stack et DevOps ! Je m'intéresse beaucoup aux nouvelles technologies, au développement et à l'informatique."
      ),

      //include
      "navbar": {
        "home": (this.isFrench ? "Home" : "Accueil"),
        "about": (this.isFrench ? "About Me" : "A Propos"),
        "achievements": (this.isFrench ? "Achievements" : "Réalisations"),
      },
      "footer": {
        "legal": (this.isFrench ? "Legal mention" : "Mention légales"),
        "cgu": (this.isFrench ? "TOS/CGV" : "CGU/CGV"),
      },
      "services": {
        "title": (this.isFrench ? "What I offer" : "Ce que je propose"),
        "devis": (this.isFrench ? "Quotation" : "Sur devis"),
        "contactButton": (this.isFrench ? "Contact me" : "Contactez-moi"),
        "sysadmin": [
          (this.isFrench ? "Facility" : "Installation"),
          (this.isFrench ? "Securing" : "Sécurisation"),
          (this.isFrench ? "Surveillance" : "Surveillance"),
        ],
        "perDay": "/" + (this.isFrench ? "day" : "jour"),
        "devTitle": (this.isFrench ? "Development" : "Développement"),
        "dev": [
          (this.isFrench ? "Custom development" : "Développement sur mesure"),
          (this.isFrench ? "Multi-platform" : "Multi plateforme"),
          (this.isFrench ? "Advice" : "Conseil"),
        ],
        "devops": [
          (this.isFrench ? "Facility" : "Installation"),
          (this.isFrench ? "Securing" : "Sécurisation"),
          (this.isFrench ? "Surveillance" : "Surveillance"),
        ],
      },
      "cv": {
        "competences": {
          "title": (this.isFrench ? "Main technologies used" : "Principales technologies utilisées"),
        },
        "certif": {
          "title": (this.isFrench ? "Certificates" : "Certifications"),
        },
        "experience": {
          "title": (this.isFrench ? "Experiences" : "Expériences"),
        },
        "languages": {
          "title": (this.isFrench ? "Languages" : "Langues"),
          "langList": [
            (this.isFrench ? "French" : "Français"),
            (this.isFrench ? "English" : "Anglais"),
          ]
        }
      },

      //base
      "home": {
        "welcome": (this.isFrench ? "Hello, I'm Gaëtan" : "Bonjour, je suis Gaëtan"),
        "contactButton": (this.isFrench ? "Contact me" : "Me contacter"),
      },
      "about": {
        "title": (this.isFrench ? "About me" : "A propos de moi"),
        "role": (this.isFrench ? "Hello, I am Gaëtan Faucher." : "Bonjour, je suis Gaëtan Faucher."),
        "cvButton": (this.isFrench ? "Download my CV" : "Télécharger mon CV"),
        "cvNotAvailable": (this.isFrench ? "This feature is not yet available" : "Cette fonctionnalité n'est pas encore disponible"),
      },
      "achievements": {
        "title": (this.isFrench ? "My achievements" : "Mes réalisations"),
        "description": (this.isFrench ? "Here's a list of my accomplishments that I am allowed to showcase publicly. Please note that some of my accomplishments are not included on this list due to non-disclosure agreements in effect." : "Voici une liste de mes réalisations dont j'ai l'autorisation de partager publiquement. Veuillez noter que certaines de mes réalisations ne figurent pas sur cette liste en raison de contrats de confidentialité en vigueur."),
        "chloecm": (this.isFrench ? "Web application to showcase the journey of a Master's degree student." : "Application web pour présenter le parcours d'une étudiante en Master."),
        "liptonpvp": (this.isFrench ? "Creation/Management/Developement of an practice minecraft server." : "Création/Gestion/Développement d'un serveur minecraft practice."),
        "pvping": (this.isFrench ? "Development of an practice minecraft server." : "Développement d'un serveur minecraft practice."),
        "vitapot": (this.isFrench ? "Management of the development of an practice minecraft server." : "Gestion du développement d'un serveur minecraft practice."),
        "cdn": (this.isFrench ? "My content distribution network to be able to have a fast and reliable distribution." : "Mon réseau de distribution de contenu pour pouvoir avoir une diffusion rapides et fiables."),
        "immoct": (this.isFrench ? "Web application for an independent real estate agent that allows them to showcase their listings." : "Application web pour un agent immobilier indépendant qui permet de mettre en avant ses offres."),
        "ctenergetique": (this.isFrench ? "Web application for a Chinese medicine company." : "Application web pour une entreprise de médécine chinoise."),
        "firstsky": (this.isFrench ? "Management of the infrastructure of the entire server." : "Gestion de l'infrastructure de l'ensemble du serveur."),
        "pizzaoplomo": (this.isFrench ? "School project for creating a fictitious company." : "Projet d'école de création d'une entreprise fictive."),
        "heavycloud": (this.isFrench ? "Creation of a hosting provider offering VPS as well as Anti-DDoS solutions." : "Création d'un hébergeur proposant des VPS ainsi que des solutions Anti-DDoS."),
        "neptune": (this.isFrench ? "School project for creating a web application for a fictitious hotel." : "Projet d'école de création d'une application web pour un hôtel fictif.")
      },
      "shield": {
        "title": (this.isFrench ? "Shield GaetanDev" : "Bouclier GaetanDev"),
        "servers": (this.isFrench ? "Server currently protected" : "Serveur actuellement protégé"),
        "protected": (this.isFrench ? "Attack received successfully mitigated" : "Attaque reçue atténuée avec succès"),
        "total": (this.isFrench ? "Number of people connected to the infrastructure" : "Nombre de personnes connectées sur l'infrastructure"),
      },
      "contact": {
        "title": (this.isFrench ? "Contact me" : "Me contacter"),
        "name": (this.isFrench ? "Name" : "Prénom"),
        "sendButton": (this.isFrench ? "Send my message" : "Envoyer mon message"),
        "form": {
          "invalid": (this.isFrench ? "Error, invalid form !" : "Erreur, formulaire invalide !"),
          "server": (this.isFrench ? "Error, server down !" : "Erreur, serveur hors-service !"),
          "nameInvalid": (this.isFrench ? "Error, invalid name !" : "Erreur, prénom invalide !"),
          "mailInvalid": (this.isFrench ? "Error, invalid mail !" : "Erreur, mail invalide !"),
          "messageInvalid": (this.isFrench ? "Error, invalid message !" : "Erreur, message invalide !"),
          "captchaInvalid": (this.isFrench ? "Error, captcha form !" : "Erreur, captcha invalide !"),
          "success": (this.isFrench ? "Success, email sent !" : "Succès, mail envoyé !"),
          "loading": (this.isFrench ? "Sending..." : "Envoi en cours..."),
          "limit": (this.isFrench ? "Warning, please wait a bit !" : "Attention, attendez encore quelques minutes !"),
        }
      },
      "legal": {
        "declaration": (this.isFrench ? "Statement" : "Déclaration"),
        "declarationText": [
          (this.isFrench ?
              "GaetanDev.fr edited by: FAUCHER Gaëtan Individual entrepreneur" :
              "GaetanDev.fr édité par: FAUCHER Gaëtan Entrepreneur individuel"
          ),
          "Siret: 91028598000017, CFE URSSAF 34",
          (this.isFrench ? "Adress" : "Adresse") + ": 509 RUE DE BUGAREL 34070 MONTPELLIER",
          (this.isFrench ? "Director of publication" : "Directeur de la publication") + ": Gaëtan Faucher - contact@gaetandev.fr",
        ],
        "host": (this.isFrench ? "Host" : "Hébergeur"),
        "hostText": [
          this.isFrench ?
            "The gaetandev.fr site is hosted on the servers of Amazon Web Services Inc, PO Box 81226, Seattle, WA 981808-1226 – USA. https://aws.amazon.com/en/compliance/eu-data-protection/.\n" :
            "Le site gaetandev.fr est hébergé sur les serveurs de Amazon Web Services Inc, PO Box 81226, Seattle, WA 981808-1226 – USA. https://aws.amazon.com/fr/compliance/eu-data-protection/.",
        ],
        "reproductionText":
          this.isFrench ?
              "This entire site is subject to international legislation on copyright and intellectual property." :
              "L'ensemble de ce site relève des législations internationales sur le droit d'auteur et la propriété intellectuelle.",
        "copyrightText": this.isFrench ? "All reproduction rights are reserved." : "Tous les droits de reproduction sont réservés.",
        "preamble": (this.isFrench ? "Preamble" : "Préambule"),
        "preambleText": [
          (this.isFrench ?
              "Access to the gaetandev.fr site is free, with no obligation to purchase." :
              "L'accès au site gaetandev.fr est gratuit, sans obligation d'achat."
          ),
          (this.isFrench ?
              "The gaetandev.fr site reserves the right to modify" :
              "Le site gaetandev.fr se réserve le droit de modifier"
          ),
          (this.isFrench ?
              "without notice or announcement of these general conditions of sale which must" :
              "sans préavis ou annonce les présentes conditions générales de vente qui devront"
          ),
          (this.isFrench ?
              "be consulted before any purchase. The user must be of legal age or" :
              "être consultées avant tout achat. L'utilisateur doit être majeur ou"
          ),
          (this.isFrench ?
              "have authorization from their manager before making a purchase." :
              "disposer d'une autorisation de son responsable avant d'effectuer un achat."
          ),
        ],
        "definitions": (this.isFrench ? "Definitions" : "Définitions"),
        "definitionsText": [
          (this.isFrench ?
              "The services belonging to gaetandev.fr constitute all the services available at the URL https://gaetandev.fr/." :
              "Les services appartenant à gaetandev.fr constituent l'ensemble des services disponibles à l'URL https://gaetandev.fr/."
          )
        ],
        "cgu": (this.isFrench ? "Terms of use" : "Conditions d'utilisation"),
        "cguText": [
          (this.isFrench ?
              "All items offered on the gaetandev.fr website remain the exclusive property of" :
              "Tous les articles proposés sur le site gaetandev.fr restent la propriété exclusive de"
          ),
          (this.isFrench ?
              "gaetandev.fr. As such, no one has the right to sell or resell the content belonging to" :
              "gaetandev.fr. À ce titre personne n'a le droit de vendre ou revendre le contenu appartenant à"
          ),
          (this.isFrench ?
              "gaetandev.fr without permission. Failure to comply with the conditions of use or sale may lead to" :
              "gaetandev.fr sans autorisation. Un non-respect des conditions d'utilisation ou de vente pourra conduire à des"
          ),
          (this.isFrench ?
              "proceedings and a ban on the use of all gaetandev.fr services." :
              "poursuites et une interdiction d'utilisation de tous les services de gaetandev.fr."
          ),
        ],

        "command": (this.isFrench ? "Order process" : "Processus de commande"),
        "commandText": [
          (this.isFrench ?
              "Any validated order constitutes an irrevocable acceptance of the general conditions of sale and the" :
              "Toute commande validée constitue une acception irrévocable des conditions générales de vente et du"
          ),
          (this.isFrench ?
              "payment and validate your transaction. The data recorded by gaetandev.fr constitute the proof" :
              "paiement et validera votre transaction. Les données enregistrée par gaetandev.fr constituent la preuve"
          ),
          (this.isFrench ?
              "of all transactions made by gaetandev.fr and its customers. The data recorded by" :
              "de l'ensemble des transactions passées par gaetandev.fr et ses clients. Les données enregistrées par"
          ),
          (this.isFrench ?
              "the payment system constitutes proof of financial transactions." :
              "le système de paiement constitue la preuve des transactions financières."
          ),
        ],

        "payment": (this.isFrench ? "Payment" : "Paiement"),
        "paymentText": [
          (this.isFrench ?
              "Payment is made online through Paypal." :
              "Le paiement s'effectue en ligne par le biais de Paypal."
          ),
          (this.isFrench ?
              "Personal information and credit card numbers never circulate"
              : "Les informations personnelles ainsi que les numéros de carte bancaire ne circulent jamais"
          ),
          (this.isFrench ?
              "in plain text between the browser and the server, the data is encrypted and transmitted by the SSL protocol." :
              "en clair entre le navigateur et le serveur, les données sont chiffrées et transmises par le protocole SSL."
          ),
        ],

        "retractation": (this.isFrench ? "Right to retract" : "Droit de rétractation"),
        "retractationText": [
          (this.isFrench ?
              "Notwithstanding article L. 121-20-2 of the French Consumer Code," :
              "Par dérogation à l'article L. 121-20-2 du Code Français de la consommation,"
          ),
          (this.isFrench ?
            "the customer no longer has the right of withdrawal" : "le client n'a plus le droit de rétractation"),
          (this.isFrench ?
              "from the date and time of provision of services. By way of derogation from article" :
              "à compter de la date et heure de fourniture de services. Par dérogation à l'article"
          ),
          (this.isFrench ?
              "L. 121-20-1 of the French Consumer Code, the customer has a right of withdrawal of 7 (seven) days if the service has not yet been delivered." :
              "L. 121-20-1 du Code Français de la consommation, le client a un droit de rétractation de 7 (sept) jours si le service n'a pas encore été livré."
          ),
          (this.isFrench ?
              "This right of withdrawal is made by message to the email address" :
              "Ce droit de rétractation s'effectue par message à l'adresse mail"
          ) + ": contact@gaetandev.fr",
        ],

        "price": (this.isFrench ? "Prices" : "Tarifs"),
        "priceText": [
          (this.isFrench ?
              "The rates are communicated to the customer through a quote and an invoice." :
              "Les tarifs sont communiqués au client grâce à un devis et une facture."
          ),
          (this.isFrench ?
              "The gaetandev.fr site reserves the right to modify its prices at any time." :
              "Le site gaetandev.fr se réserve le droit de modifier ses prix à tout moment."
          ),
        ],
      }
    };

    this.updateEvent.emit(this.isFrench);
  }
}

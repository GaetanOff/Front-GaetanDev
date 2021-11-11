import {Component, OnInit} from '@angular/core';
import {NotifierService} from "angular-notifier";
import {HttpClient} from "@angular/common/http";
import {Title} from "@angular/platform-browser";
import {NavService} from "../../../services/nav/nav.service";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  name: string | undefined;
  email: string | undefined;
  message: string | undefined;
  private lastName: string | undefined;
  private captcha: boolean;
  private readonly notifier: NotifierService;
  private http: HttpClient;

  constructor(private notifierService: NotifierService, private httpClient: HttpClient, private titleService: Title, private navService: NavService) {
    this.notifier = notifierService;
    this.http = httpClient;
    this.captcha = false;
  }

  resolved() {
    this.captcha = true;
  }

  ngOnInit(): void {
    window.scrollTo({top: 0});
    this.navService.updateNav();

    // @ts-ignore
    document.getElementById("contact").classList.toggle("font-bold");

    this.titleService.setTitle("Gaetan • Contact");
  }

  processForm() {
    if (this.name == undefined || this.email == undefined || this.message == undefined) {
      this.notifier.notify('error', 'Erreur, formulaire invalide !');
    } else if (this.name.length < 3) {
      this.notifier.notify('error', 'Erreur, nom invalide !');
    } else if (!this.email.includes("@") || !this.email.includes(".")) {
      this.notifier.notify('error', 'Erreur, mail invalide !');
    } else if (this.message.length < 3) {
      this.notifier.notify('error', 'Erreur, message invalide !');
    } else if (!this.captcha) {
      this.notifier.notify('error', 'Erreur, captcha invalide !');
    } else {
      this.notifier.notify('success', 'Succès, mail envoyé !');

      /**let postVars = {
        email : this.email,
        name : this.name,
        message : this.message
      };**/

      if (this.lastName == this.name) {
        location.reload();
        return;
      }

      this.http.get("https://gaetandev.fr/assets/contact.php?email=" + this.email + "&name=" + this.name + "&message=" + this.message)
        .subscribe()

      this.lastName = this.name;
    }
  }

}

import {Component, OnInit} from '@angular/core';
import {NotifierService} from "angular-notifier";
import {HttpClient} from "@angular/common/http";
import {Title} from "@angular/platform-browser";
import {NavService} from "../../../services/nav/nav.service";
import {I18nService} from "../../../services/i18n/i18n.service";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {
  name: string | undefined;
  email: string | undefined;
  message: string | undefined;
  private lastName: string | undefined;
  private captcha: boolean;
  private readonly notifier: NotifierService;
  private http: HttpClient;

  constructor(public i18n: I18nService, private notifierService: NotifierService, private httpClient: HttpClient, private titleService: Title, private navService: NavService) {
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

    document.getElementById("contact")?.classList.toggle("font-bold");

    this.titleService.setTitle("Gaetan • Contact");
  }

  processForm() {
    if (this.name == undefined || this.email == undefined || this.message == undefined) {
      this.notifier.notify('error', this.i18n.text.contact.form.invalid);
    } else if (this.name.length < 3) {
      this.notifier.notify('error', this.i18n.text.contact.form.nameInvalid);
    } else if (!this.email.includes("@") || !this.email.includes(".")) {
      this.notifier.notify('error', this.i18n.text.contact.form.mailInvalid)
    } else if (this.message.length < 3) {
      this.notifier.notify('error', this.i18n.text.contact.form.messageInvalid)
    } else if (!this.captcha) {
      this.notifier.notify('error', this.i18n.text.contact.form.captchaInvalid)
    } else {
      if (this.lastName == this.name) {
        location.reload();
        return;
      }

      this.notifier.notify('success', this.i18n.text.contact.form.success);

      this.http.get("https://cdn.gaetandev.fr/gaetan/files/contact.php?email=" + this.email + "&name=" + this.name + "&message=" + this.message);

      this.lastName = this.name;
    }
  }

}

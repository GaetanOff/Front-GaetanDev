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

  constructor(public i18n: I18nService, private notifierService: NotifierService, private httpClient: HttpClient, private titleService: Title, private navService: NavService) {
  }

  ngOnInit(): void {
    window.scrollTo({top: 0});

    this.navService.updateNav();

    document.getElementById("contact")?.classList.toggle("font-medium");
    document.getElementById("contact")?.classList.toggle("font-bold");

    this.titleService.setTitle("Gaetan • Contact");
  }

  processForm() {
    if (this.name == undefined || this.email == undefined || this.message == undefined) {
      this.notifierService.notify('error', this.i18n.text.contact.form.invalid);
    } else if (this.name.length < 3) {
      this.notifierService.notify('error', this.i18n.text.contact.form.nameInvalid);
    } else if (!this.email.includes("@") || !this.email.includes(".")) {
      this.notifierService.notify('error', this.i18n.text.contact.form.mailInvalid);
    } else if (this.message.length < 3) {
      this.notifierService.notify('error', this.i18n.text.contact.form.messageInvalid);
    } else {
      const formData = new FormData() as FormData;
      formData.append('name', this.name);
      formData.append('email', this.email);
      formData.append('message', this.message);

      this.httpClient.post("https://api.gaetandev.fr/contact", formData).subscribe(res => {
        if (res)
          this.notifierService.notify('success', this.i18n.text.contact.form.success);
        else this.notifierService.notify('error', this.i18n.text.contact.form.server);
      });

      this.name = undefined;
      this.email = undefined;
      this.message = undefined;
    }
  }

}

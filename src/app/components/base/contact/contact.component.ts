import {Component, OnInit} from '@angular/core';
import {NotifierService} from "angular-notifier";
import {HttpClient} from "@angular/common/http";
import {Title} from "@angular/platform-browser";
import {NavService} from "../../../services/nav/nav.service";
import {I18nService} from "../../../services/i18n/i18n.service";
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

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

    this.navService.updateNav("contact");

    this.titleService.setTitle("Gaetan • Contact");
  }

  processForm(): void {
    const { name, email, message } = this;

    if (name === undefined || email === undefined || message === undefined) {
      this.notifierService.notify('error', this.i18n.text.contact.form.invalid);
    } else if (name.length < 3) {
      this.notifierService.notify('error', this.i18n.text.contact.form.nameInvalid);
    } else if (!email.includes("@") || !email.includes(".")) {
      this.notifierService.notify('error', this.i18n.text.contact.form.mailInvalid);
    } else if (message.length < 3) {
      this.notifierService.notify('error', this.i18n.text.contact.form.messageInvalid);
    } else {
      /**
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('message', message);

      this.httpClient.post("https://api.gaetandev.fr/contact", formData).subscribe(res => {
        if (res) {
          this.notifierService.notify('success', this.i18n.text.contact.form.success);
        } else {
          this.notifierService.notify('error', this.i18n.text.contact.form.server);
        }
      });
       **/
      const templateParams = {
        name: this.name,
        email: this.email,
        message: this.message
      };

      emailjs.send('service_katu34t', 'template_3rprude', templateParams, 'SsUfOyd0KywiMRRLl')
        .then((result: EmailJSResponseStatus) => {
          this.notifierService.notify('success', this.i18n.text.contact.form.success);
        }, (error) => {
          this.notifierService.notify('error', this.i18n.text.contact.form.server);
        });

      this.name = undefined;
      this.email = undefined;
      this.message = undefined;
    }
  }

}

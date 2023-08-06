import {Component, OnInit} from '@angular/core';
import {NotifierService} from "angular-notifier";
import {HttpClient} from "@angular/common/http";
import {Title} from "@angular/platform-browser";
import {NavService} from "../../../services/nav/nav.service";
import {I18nService} from "../../../services/i18n/i18n.service";
import emailjs from '@emailjs/browser';
import {LimitService} from "../../../services/limit/limit.service";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {
  name: string | undefined;
  email: string | undefined;
  message: string | undefined;

  constructor(public i18n: I18nService, private notifierService: NotifierService, private httpClient: HttpClient,
              private titleService: Title, private navService: NavService, private limitService: LimitService) {
  }

  ngOnInit(): void {
    window.scrollTo({top: 0});

    this.navService.updateNav("contact");

    this.titleService.setTitle("Gaetan • Contact");
  }

  processForm(): void {
    const {name, email, message} = this;

    if (name === undefined || email === undefined || message === undefined) {
      this.notifierService.notify('error', this.i18n.text.contact.form.invalid);
    } else if (name.length < 3) {
      this.notifierService.notify('error', this.i18n.text.contact.form.nameInvalid);
    } else if (!email.includes("@") || !email.includes(".")) {
      this.notifierService.notify('error', this.i18n.text.contact.form.mailInvalid);
    } else if (message.length < 3) {
      this.notifierService.notify('error', this.i18n.text.contact.form.messageInvalid);
    } else {
      const templateParams: { name: string | undefined; message: string | undefined; email: string | undefined } = {
        name: this.name,
        email: this.email,
        message: this.message
      };

      emailjs.send('service_katu34t', 'template_3rprude', templateParams, 'SsUfOyd0KywiMRRLl')
        .then((): void => {
          if (this.limitService.checkLimit()) {
            this.notifierService.notify('warning', this.i18n.text.contact.form.limit);
            return;
          }

          this.notifierService.notify('success', this.i18n.text.contact.form.success);
          this.limitService.setLimit({hours: 0, minutes: 10});
        }, (): void => {
          this.notifierService.notify('error', this.i18n.text.contact.form.server);
        });

      this.name = undefined;
      this.email = undefined;
      this.message = undefined;
    }
  }

}

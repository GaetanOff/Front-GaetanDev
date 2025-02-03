import {Component, OnInit} from '@angular/core';
import { toast } from 'ngx-sonner';
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
  protected readonly toast = toast;

  name: string | undefined;
  email: string | undefined;
  message: string | undefined;

  constructor(public i18n: I18nService, private httpClient: HttpClient,
              private titleService: Title, private navService: NavService, private limitService: LimitService) {
  }

  ngOnInit(): void {
    window.scrollTo({top: 0});

    this.navService.updateNav("contact");

    this.titleService.setTitle("Gaetan • Contact");
  }

  async processForm(): Promise<void> {
    const {name, email, message} = this;

    if (name === undefined || email === undefined || message === undefined) {
      this.toast.error(this.i18n.text.contact.form.invalid);
    } else if (name.length < 3) {
      this.toast.error(this.i18n.text.contact.form.nameInvalid);
    } else if (!email.includes("@") || !email.includes(".")) {
      this.toast.error(this.i18n.text.contact.form.mailInvalid);
    } else if (message.length < 3) {
      this.toast.error(this.i18n.text.contact.form.messageInvalid)
    } else {
      const templateParams: { name: string | undefined; message: string | undefined; email: string | undefined } = {
        name: this.name,
        email: this.email,
        message: this.message
      };

      if (this.limitService.checkLimit()) {
        this.toast.warning(this.i18n.text.contact.form.limit);
        return;
      }

      const lastToast: string | number = toast.loading(this.i18n.text.contact.form.loading || "Envoi en cours...");

      emailjs.send('service_katu34t', 'template_3rprude', templateParams, 'SsUfOyd0KywiMRRLl')
        .then((): void => {
          this.toast.success(this.i18n.text.contact.form.success, { id: lastToast });
          this.limitService.setLimit({hours: 0, minutes: 10});
        }, (): void => {
          this.toast.error(this.i18n.text.contact.form.server, { id: lastToast });
        });

      this.name = undefined;
      this.email = undefined;
      this.message = undefined;
    }
  }

}

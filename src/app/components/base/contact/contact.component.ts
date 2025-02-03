import { Component, OnInit } from '@angular/core';
import { toast } from 'ngx-sonner';
import { HttpClient } from "@angular/common/http";
import { Title } from "@angular/platform-browser";
import { NavService } from "../../../services/nav/nav.service";
import { I18nService } from "../../../services/i18n/i18n.service";
import emailjs from '@emailjs/browser';
import { LimitService } from "../../../services/limit/limit.service";
import { z } from "zod";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {
  protected readonly toast = toast;

  name: string = "";
  email: string = "";
  message: string = "";

  mpdmldpsmzl: string | null = null;
  dkqgdoijqdljbkfks: string = "0x4AAAAAAAQVPyoNLB-x1-gG";

  constructor(
    public i18n: I18nService,
    private httpClient: HttpClient,
    private titleService: Title,
    private navService: NavService,
    private limitService: LimitService
  ) {}

  ngOnInit(): void {
    window.scrollTo({top: 0});
    this.navService.updateNav("contact");
    this.titleService.setTitle("Gaetan • Contact");
  }

  dkmdpqjdnqdoqdkn(event: string | null) {
    this.mpdmldpsmzl = event;
  }

  private formSchema = z.object({
    name: z.string()
      .min(3, this.i18n.text.contact.form.nameInvalid),
    email: z.string()
      .email(this.i18n.text.contact.form.mailInvalid),
    message: z.string()
      .min(3, this.i18n.text.contact.form.messageInvalid),
    captcha: z.string().nullable()
      .refine(value => value !== null, { message: this.i18n.text.contact.form.captchaInvalid })
  });

  async processForm(): Promise<void> {
    const { name, email, message, mpdmldpsmzl } = this;

    const validationResult = this.formSchema.safeParse({ name, email, message, captcha: mpdmldpsmzl });

    if (!validationResult.success) {
      validationResult.error.errors.forEach(err => {
        this.toast.error(err.message);
      });
      return;
    }

    if (this.limitService.checkLimit()) {
      this.toast.warning(this.i18n.text.contact.form.limit);
      return;
    }

    const lastToast: string | number = toast.loading(this.i18n.text.contact.form.loading || "Envoi en cours...");

    const templateParams = { name, email, message };

    emailjs.send('service_katu34t', 'template_3rprude', templateParams, 'SsUfOyd0KywiMRRLl')
      .then(() => {
        this.toast.success(this.i18n.text.contact.form.success, { id: lastToast });
        this.limitService.setLimit({ hours: 0, minutes: 10 });
      })
      .catch(() => {
        this.toast.error(this.i18n.text.contact.form.server, { id: lastToast });
      });

    this.name = "";
    this.email = "";
    this.message = "";
  }
}

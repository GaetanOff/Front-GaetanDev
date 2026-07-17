import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { I18nService } from "../../../services/i18n/i18n.service";
import { SeoService } from "../../../services/seo/seo.service";
import { LimitService } from "../../../services/limit/limit.service";
import { toast } from 'ngx-sonner';
import { CustomCaptchaComponent } from '../../include/captcha/custom-captcha.component';
import { environment } from '../../../../environments/environment';

import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, CustomCaptchaComponent],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  public i18n = inject(I18nService);
  private limitService = inject(LimitService);
  private seo = inject(SeoService);

  constructor() {
    effect(() => {
      const seoText = this.i18n.text().seo.contact;
      this.seo.update({
        title: seoText.title,
        description: seoText.description,
        path: '/contact',
        jsonLd: [{
          '@type': 'ContactPage',
          'mainEntity': { '@id': `${SeoService.BASE_URL}/#person` }
        }]
      });
    });
  }

  public loading = signal(false);
  public captchaToken = signal<string | null>(null);

  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get message() { return this.contactForm.get('message'); }

  onTurnstileResolved(token: string | null) {
    this.captchaToken.set(token);
  }

  async onSubmit(): Promise<void> {
    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      if (this.name?.invalid) {
        toast.error(
          this.name.errors?.['required']
            ? this.i18n.text().contact.validation.nameRequired
            : this.i18n.text().contact.validation.nameMinLength
        );
      } else if (this.email?.invalid) {
        toast.error(
          this.email.errors?.['required']
            ? this.i18n.text().contact.validation.emailRequired
            : this.i18n.text().contact.validation.emailInvalid
        );
      } else if (this.message?.invalid) {
        toast.error(this.i18n.text().contact.validation.messageRequired);
      }
      return;
    }

    if (!this.captchaToken()) {
      toast.error(this.i18n.text().contact.validation.captchaInvalid);
      return;
    }

    if (this.limitService.checkLimit()) {
      toast.warning(this.i18n.text().contact.form.limit);
      return;
    }

    const { name, email, message } = this.contactForm.value;
    this.loading.set(true);
    const lastToast: string | number = toast.loading(this.i18n.text().contact.form.loading || "Envoi en cours...");

    const templateParams = {
      name: name || '',
      email: email || '',
      message: message || '',
    };

    const { serviceId, templateId, publicKey } = environment.emailjs;

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then(() => {
        toast.success(this.i18n.text().contact.form.success, { id: lastToast });
        this.limitService.setLimit({ hours: 0, minutes: 10 });
        this.contactForm.reset();
        this.captchaToken.set(null);
      })
      .catch(() => {
        toast.error(this.i18n.text().contact.form.server, { id: lastToast });
      }).finally(() => {
        this.loading.set(false);
        this.captchaToken.set(null);
      });
  }
}

import { Component, ChangeDetectionStrategy, inject, signal, effect, viewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { I18nService } from "../../../services/i18n/i18n.service";
import { SeoService } from "../../../services/seo/seo.service";
import { LimitService } from "../../../services/limit/limit.service";
import { toast } from 'ngx-sonner';
import { GdCaptchaComponent } from '../../include/gd-captcha/gd-captcha.component';
import { environment } from '../../../../environments/environment';

/** Corps attendu par le worker api-contact (workers/api-contact). */
export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  captchaToken: string;
}

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, GdCaptchaComponent],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  public i18n = inject(I18nService);
  private http = inject(HttpClient);
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
  private captcha = viewChild(GdCaptchaComponent);

  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get message() { return this.contactForm.get('message'); }

  onCaptchaResolved(token: string | null) {
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

    const captchaToken = this.captchaToken();
    if (!captchaToken) {
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

    const request: ContactRequest = {
      name: name || '',
      email: email || '',
      message: message || '',
      captchaToken,
    };

    try {
      await firstValueFrom(this.http.post(environment.contactApiUrl, request));
      toast.success(this.i18n.text().contact.form.success, { id: lastToast });
      this.limitService.setLimit({ hours: 0, minutes: 10 });
      this.contactForm.reset();
    } catch (error) {
      // Le worker répond 403 { error: 'captcha_failed' } quand siteverify refuse le jeton.
      const captchaRefused = error instanceof HttpErrorResponse && error.error?.error === 'captcha_failed';
      toast.error(
        captchaRefused ? this.i18n.text().contact.validation.captchaInvalid : this.i18n.text().contact.form.server,
        { id: lastToast }
      );
    } finally {
      this.loading.set(false);
      this.captchaToken.set(null);
      this.captcha()?.reset();
    }
  }
}

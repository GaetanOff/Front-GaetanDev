import { Component, ChangeDetectionStrategy, inject, signal, AfterViewInit, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import {I18nService} from "../../../services/i18n/i18n.service";
import {LimitService} from "../../../services/limit/limit.service";
import {toast} from 'ngx-sonner';
import {z} from "zod";
import { debounceTime } from 'rxjs/operators';
import { CustomCaptchaComponent } from '../../include/captcha/custom-captcha.component';

import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, CustomCaptchaComponent],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  public i18n = inject(I18nService);
  private limitService = inject(LimitService);
  private cdr = inject(ChangeDetectorRef);
  private titleService = inject(Title);

  ngOnInit(): void {
    this.titleService.setTitle("Gaetan • Contact");
  }

  public loading = signal(false);

  public captchaToken = signal<string | null>(null);
  public formValid = signal(false);

  // Always show Turnstile
  public showTurnstile = signal(true);

  private getFormSchema() {
    return z.object({
      name: z.string()
        .min(3, this.i18n.text().contact.form.nameInvalid),
      email: z.string()
        .email(this.i18n.text().contact.form.mailInvalid),
      message: z.string()
        .min(3, this.i18n.text().contact.form.messageInvalid),
      captcha: z.string().nullable()
        .refine(value => value !== null, {message: this.i18n.text().contact.form.captchaInvalid})
    });
  }

  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', Validators.required),
  });

  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get message() { return this.contactForm.get('message'); }

  ngAfterViewInit() {
    // Subscribe to form value changes to show/hide Turnstile
    this.contactForm.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.checkFormValidity();
    });

    // Also check on status changes (for validation state)
    this.contactForm.statusChanges.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.checkFormValidity();
    });
  }

  ngOnDestroy() {
    // No cleanup needed with ngx-turnstile component
  }

  private checkFormValidity() {
    const name = this.name?.value;
    const email = this.email?.value;
    const message = this.message?.value;

    const isValid = !!(name && name.length >= 3 &&
                       email && this.email?.valid &&
                       message && message.length >= 3);

    this.formValid.set(isValid);
    this.cdr.detectChanges();
  }

  onTurnstileResolved(token: string | null) {
    this.captchaToken.set(token);
    this.cdr.detectChanges();
  }

  async onSubmit(): Promise<void> {
    this.contactForm.markAllAsTouched();

    const {name, email, message} = this.contactForm.value;
    const formSchema = this.getFormSchema();
    const validationResult = formSchema.safeParse({
      name: name || '',
      email: email || '',
      message: message || '',
      captcha: this.captchaToken()
    });

    if (!validationResult.success) {
      validationResult.error.errors.forEach(err => {
        toast.error(err.message);
      });
      return;
    }

    if (this.limitService.checkLimit()) {
      toast.warning(this.i18n.text().contact.form.limit);
      return;
    }

    this.loading.set(true);
    const lastToast: string | number = toast.loading(this.i18n.text().contact.form.loading || "Envoi en cours...");

    const templateParams = {
      name: name || '',
      email: email || '',
      message: message || '',
    };

    emailjs.send('service_katu34t', 'template_3rprude', templateParams, 'SsUfOyd0KywiMRRLl')
      .then(() => {
        toast.success(this.i18n.text().contact.form.success, {id: lastToast});
        this.limitService.setLimit({ hours: 0, minutes: 10 });
        this.contactForm.reset();
        this.formValid.set(false);
        this.captchaToken.set(null);
        // Reset captcha visibility
        this.showTurnstile.set(true);
      })
      .catch(() => {
        toast.error(this.i18n.text().contact.form.server, {id: lastToast});
      }).finally(() => {
      this.loading.set(false);
      this.captchaToken.set(null);
    });
  }
}

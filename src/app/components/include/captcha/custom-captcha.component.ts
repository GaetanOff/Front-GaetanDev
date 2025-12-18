import { Component, ChangeDetectionStrategy, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxTurnstileModule } from 'ngx-turnstile';

@Component({
  selector: 'app-custom-captcha',
  standalone: true,
  imports: [CommonModule, NgxTurnstileModule],
  template: `
    <div class="w-full flex justify-center">
      <ngx-turnstile
        [siteKey]="siteKey"
        [tabIndex]="0"
        theme="dark"
        (resolved)="onTurnstileResolved($event)">
      </ngx-turnstile>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCaptchaComponent {
  siteKey: string = "0x4AAAAAAAQVPyoNLB-x1-gG";
  tokenResolved = output<string | null>();

  public state = signal<'idle' | 'verified' | 'error'>('idle');

  onTurnstileResolved(token: string | null) {
    if (token) {
      this.state.set('verified');
      this.tokenResolved.emit(token);
    } else {
      this.state.set('error');
      this.tokenResolved.emit(null);
    }
  }
}
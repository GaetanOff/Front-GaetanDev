import { Component, ChangeDetectionStrategy, inject, signal, AfterViewInit, OnDestroy, ChangeDetectorRef, input, output, ElementRef, ViewChild } from '@angular/core';
import {I18nService} from "../../../services/i18n/i18n.service";
import { CommonModule } from '@angular/common';

const getTurnstileAPI = (): any => {
  return (globalThis as any).turnstile || (window as any).turnstile;
};

@Component({
  selector: 'app-custom-captcha',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-captcha.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCaptchaComponent implements AfterViewInit, OnDestroy {
  @ViewChild('turnstileContainer', { static: false }) turnstileContainer!: ElementRef<HTMLDivElement>;
  
  public i18n = inject(I18nService);
  private cdr = inject(ChangeDetectorRef);
  
  siteKey = input.required<string>();
  tokenResolved = output<string | null>();
  
  public state = signal<'idle' | 'verifying' | 'verified' | 'error'>('idle');
  public widgetId: string | null = null;
  private verifyingTimeout: any = null;
  
  get captchaTexts() {
    return this.i18n.text().contact.captcha || {
      verify: "Vérifier que vous n'êtes pas un robot",
      verifySubtext: "Cliquez pour vérifier",
      verifying: "Vérification en cours...",
      verifyingSubtext: "Veuillez patienter...",
      verified: "Vérification réussie",
      verifiedSubtext: "Vous pouvez continuer",
      error: "Erreur de vérification",
      errorSubtext: "Une erreur est survenue",
      retry: "Réessayer",
      poweredBy: "Propulsé par Cloudflare Turnstile"
    };
  }
  
  private getTurnstile(): any {
    return getTurnstileAPI();
  }
  
  private checkTurnstileLoaded(): Promise<void> {
    return new Promise((resolve) => {
      if (this.getTurnstile()) {
        resolve();
        return;
      }
      
      const checkInterval = setInterval(() => {
        if (this.getTurnstile()) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!this.getTurnstile()) {
          console.error('Turnstile failed to load');
          this.state.set('error');
          this.cdr.detectChanges();
        }
        resolve();
      }, 10000);
    });
  }
  
  ngAfterViewInit() {
    this.initTurnstile();
  }
  
  async initTurnstile() {
    await this.checkTurnstileLoaded();
    
    const turnstile = this.getTurnstile();
    if (!turnstile || !this.turnstileContainer) {
      return;
    }
    
    try {
      this.widgetId = turnstile.render(this.turnstileContainer.nativeElement, {
        sitekey: this.siteKey(),
        appearance: 'execute',
        callback: (token: string) => {
          if (this.verifyingTimeout) {
            clearTimeout(this.verifyingTimeout);
            this.verifyingTimeout = null;
          }
          this.state.set('verified');
          this.tokenResolved.emit(token);
          this.cdr.detectChanges();
        },
        'error-callback': (error?: any) => {
          console.error('Turnstile error callback:', error);
          if (this.verifyingTimeout) {
            clearTimeout(this.verifyingTimeout);
            this.verifyingTimeout = null;
          }
          this.state.set('error');
          this.tokenResolved.emit(null);
          this.cdr.detectChanges();
        },
        'expired-callback': () => {
          this.state.set('idle');
          this.tokenResolved.emit(null);
          this.cdr.detectChanges();
        },
      });
    } catch (error) {
      console.error('Error initializing Turnstile:', error);
      this.state.set('error');
      this.cdr.detectChanges();
    }
  }
  
  async verify() {
    if (this.state() === 'verifying' || this.state() === 'verified') {
      return;
    }
    
    const turnstile = this.getTurnstile();
    if (!turnstile) {
      await this.checkTurnstileLoaded();
      const turnstileAfterLoad = this.getTurnstile();
      if (!turnstileAfterLoad) {
        this.state.set('error');
        this.cdr.detectChanges();
        return;
      }
    }
    
    const finalTurnstile = this.getTurnstile();
    if (!finalTurnstile) {
      this.state.set('error');
      this.cdr.detectChanges();
      return;
    }
    
    if (this.widgetId) {
      try {
        finalTurnstile.remove(this.widgetId);
        this.widgetId = null;
      } catch (error) {
      }
    }
    
    if (this.turnstileContainer) {
      this.turnstileContainer.nativeElement.innerHTML = '';
    }
    
    this.state.set('verifying');
    this.cdr.detectChanges();
    
    this.verifyingTimeout = setTimeout(() => {
      console.warn('Turnstile verification timeout');
      if (this.verifyingTimeout) {
        clearTimeout(this.verifyingTimeout);
        this.verifyingTimeout = null;
      }
      this.state.set('error');
      this.tokenResolved.emit(null);
      this.cdr.detectChanges();
    }, 10000);
    
    try {
      this.widgetId = finalTurnstile.render(this.turnstileContainer.nativeElement, {
        sitekey: this.siteKey(),
        appearance: 'execute',
        callback: (token: string) => {
          if (this.verifyingTimeout) {
            clearTimeout(this.verifyingTimeout);
            this.verifyingTimeout = null;
          }
          this.state.set('verified');
          this.tokenResolved.emit(token);
          this.cdr.detectChanges();
        },
        'error-callback': (error?: any) => {
          console.error('Turnstile error callback:', error);
          if (this.verifyingTimeout) {
            clearTimeout(this.verifyingTimeout);
            this.verifyingTimeout = null;
          }
          this.state.set('error');
          this.tokenResolved.emit(null);
          this.cdr.detectChanges();
        },
        'expired-callback': () => {
          if (this.verifyingTimeout) {
            clearTimeout(this.verifyingTimeout);
            this.verifyingTimeout = null;
          }
          this.state.set('idle');
          this.tokenResolved.emit(null);
          this.cdr.detectChanges();
        },
      });
      
      if (finalTurnstile.execute && this.widgetId) {
        setTimeout(() => {
          try {
            finalTurnstile.execute(this.widgetId);
          } catch (executeError: any) {
            console.error('Error executing Turnstile:', executeError);
            if (this.verifyingTimeout) {
              clearTimeout(this.verifyingTimeout);
              this.verifyingTimeout = null;
            }
            this.state.set('error');
            this.tokenResolved.emit(null);
            this.cdr.detectChanges();
          }
        }, 50);
      }
    } catch (error) {
      console.error('Error creating Turnstile widget:', error);
      if (this.verifyingTimeout) {
        clearTimeout(this.verifyingTimeout);
        this.verifyingTimeout = null;
      }
      this.state.set('error');
      this.tokenResolved.emit(null);
      this.cdr.detectChanges();
    }
  }
  
  reset() {
    if (this.verifyingTimeout) {
      clearTimeout(this.verifyingTimeout);
      this.verifyingTimeout = null;
    }
    const turnstile = this.getTurnstile();
    if (this.widgetId && turnstile) {
      try {
        turnstile.reset(this.widgetId);
      } catch (error) {
        console.error('Error resetting Turnstile:', error);
      }
    }
    this.state.set('idle');
    this.tokenResolved.emit(null);
    this.cdr.detectChanges();
  }
  
  ngOnDestroy() {
    if (this.verifyingTimeout) {
      clearTimeout(this.verifyingTimeout);
      this.verifyingTimeout = null;
    }
    const turnstile = this.getTurnstile();
    if (this.widgetId && turnstile) {
      try {
        turnstile.remove(this.widgetId);
      } catch (error) {
        console.error('Error removing Turnstile:', error);
      }
    }
  }
}

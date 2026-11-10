import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WritableSignal, signal } from '@angular/core';
import { GdCaptchaApi, GdCaptchaComponent, GdCaptchaRenderOptions } from './gd-captcha.component';
import { I18nService } from '../../../services/i18n/i18n.service';

type GdCaptchaWindow = Window & { gdCaptcha?: GdCaptchaApi };

describe('GdCaptchaComponent', () => {
  let fixture: ComponentFixture<GdCaptchaComponent>;
  let component: GdCaptchaComponent;
  let api: jasmine.SpyObj<GdCaptchaApi>;
  let isEnglish: WritableSignal<boolean>;
  let emitted: (string | null)[];

  /** Options passées au dernier render(). */
  const lastOptions = (): GdCaptchaRenderOptions => api.render.calls.mostRecent().args[1];

  async function settle(): Promise<void> {
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    let seq = 0;
    api = jasmine.createSpyObj<GdCaptchaApi>('gdCaptcha', ['ready', 'render', 'reset', 'remove']);
    api.ready.and.callFake(callback => callback());
    api.render.and.callFake(() => `widget-${++seq}`);
    (window as GdCaptchaWindow).gdCaptcha = api;

    isEnglish = signal(false);
    await TestBed.configureTestingModule({
      imports: [GdCaptchaComponent],
      providers: [{ provide: I18nService, useValue: { isEnglish } }],
    }).compileComponents();

    fixture = TestBed.createComponent(GdCaptchaComponent);
    component = fixture.componentInstance;
    emitted = [];
    component.tokenResolved.subscribe(token => emitted.push(token));
    fixture.detectChanges();
    await settle();
  });

  afterEach(() => {
    delete (window as GdCaptchaWindow).gdCaptcha;
  });

  it('should render the widget in the current language without a hidden field', () => {
    expect(api.render).toHaveBeenCalledTimes(1);
    expect(lastOptions()).toEqual(jasmine.objectContaining({
      sitekey: 'gd_site_u9d-Fl_dKJwr0nBrXQhMkda8',
      theme: 'dark',
      language: 'fr',
      'response-field': false,
    }));
  });

  it('should emit the token, then null when it expires or the widget fails', () => {
    lastOptions().callback!('token-1');
    expect(component.state()).toBe('verified');

    lastOptions()['expired-callback']!();
    expect(component.state()).toBe('idle');

    lastOptions()['error-callback']!('network');
    expect(component.state()).toBe('error');

    expect(emitted).toEqual(['token-1', null, null]);
  });

  it('should reset the rendered widget', () => {
    lastOptions().callback!('token-1');

    component.reset();

    expect(api.reset).toHaveBeenCalledOnceWith('widget-1');
    expect(component.state()).toBe('idle');
  });

  it('should re-render in the new language and drop the previous token', async () => {
    lastOptions().callback!('token-1');

    isEnglish.set(true);
    await settle();

    expect(api.remove).toHaveBeenCalledOnceWith('widget-1');
    expect(api.render).toHaveBeenCalledTimes(2);
    expect(lastOptions().language).toBe('en');
    expect(emitted).toEqual(['token-1', null]);
  });

  it('should remove the widget when destroyed', () => {
    fixture.destroy();

    expect(api.remove).toHaveBeenCalledOnceWith('widget-1');
  });
});

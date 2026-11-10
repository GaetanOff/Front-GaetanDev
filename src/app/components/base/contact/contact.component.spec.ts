import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactComponent, ContactRequest } from './contact.component';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LimitService } from '../../../services/limit/limit.service';
import { By } from '@angular/platform-browser';
import { toast } from 'ngx-sonner';
import { GdCaptchaApi, GdCaptchaComponent } from '../../include/gd-captcha/gd-captcha.component';
import { environment } from '../../../../environments/environment';

type GdCaptchaWindow = Window & { gdCaptcha?: GdCaptchaApi };

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let httpMock: HttpTestingController;
  let gdCaptcha: jasmine.SpyObj<GdCaptchaApi>;
  let setLimit: jasmine.Spy;

  const apiUrl = environment.contactApiUrl;

  function fillForm(): void {
    component.contactForm.setValue({
      name: 'Gaetan',
      email: 'test@example.com',
      message: 'Hello world',
    });
    component.captchaToken.set('token');
  }

  beforeEach(async () => {
    // Faux widget : le vrai script de captcha.gaetandev.fr n'est pas chargé pendant les tests.
    gdCaptcha = jasmine.createSpyObj<GdCaptchaApi>('gdCaptcha', ['ready', 'render', 'reset', 'remove']);
    gdCaptcha.ready.and.callFake(callback => callback());
    gdCaptcha.render.and.returnValue('widget-1');
    (window as GdCaptchaWindow).gdCaptcha = gdCaptcha;

    setLimit = jasmine.createSpy('setLimit');
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
        {
          provide: LimitService,
          useValue: {
            checkLimit: () => false,
            setLimit,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    // Le captcha se rend après la résolution (asynchrone) du chargement de son script.
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    delete (window as GdCaptchaWindow).gdCaptcha;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the captcha for the contact action', () => {
    expect(gdCaptcha.render).toHaveBeenCalledTimes(1);
    expect(gdCaptcha.render.calls.mostRecent().args[1].action).toBe('contact');
  });

  it('should not call the worker when the form is invalid', async () => {
    const errorToast = spyOn(toast, 'error');
    component.contactForm.setValue({ name: '', email: '', message: '' });
    await component.onSubmit();

    httpMock.expectNone(apiUrl);
    expect(errorToast).toHaveBeenCalledOnceWith(component.i18n.text().contact.validation.nameRequired);
  });

  it('should not call the worker when captcha is missing', async () => {
    const errorToast = spyOn(toast, 'error');
    fillForm();
    component.captchaToken.set(null);

    await component.onSubmit();

    httpMock.expectNone(apiUrl);
    expect(errorToast).toHaveBeenCalledOnceWith(component.i18n.text().contact.validation.captchaInvalid);
  });

  it('should send the form and the captcha token to the worker', async () => {
    fillForm();

    const done = component.onSubmit();
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      name: 'Gaetan',
      email: 'test@example.com',
      message: 'Hello world',
      captchaToken: 'token',
    } satisfies ContactRequest);
    req.flush({ ok: true });
    await done;

    expect(setLimit).toHaveBeenCalledOnceWith({ hours: 0, minutes: 10 });
    expect(component.contactForm.value.name).toBeNull();
  });

  it('should show the captcha error when the worker refuses the token', async () => {
    const errorToast = spyOn(toast, 'error');
    fillForm();

    const done = component.onSubmit();
    httpMock.expectOne(apiUrl).flush({ error: 'captcha_failed' }, { status: 403, statusText: 'Forbidden' });
    await done;

    expect(errorToast).toHaveBeenCalledWith(component.i18n.text().contact.validation.captchaInvalid, jasmine.anything());
    expect(setLimit).not.toHaveBeenCalled();
  });

  for (const outcome of ['success', 'failure'] as const) {
    it(`should reset the captcha after a send ${outcome}`, async () => {
      const captcha = fixture.debugElement
        .query(By.directive(GdCaptchaComponent))
        .componentInstance as GdCaptchaComponent;
      const resetSpy = spyOn(captcha, 'reset');
      fillForm();

      const done = component.onSubmit();
      const req = httpMock.expectOne(apiUrl);
      if (outcome === 'success') {
        req.flush({ ok: true });
      } else {
        req.flush({ error: 'email_failed' }, { status: 502, statusText: 'Bad Gateway' });
      }
      await done;

      expect(resetSpy).toHaveBeenCalledTimes(1);
      expect(component.captchaToken()).toBeNull();
      expect(component.loading()).toBeFalse();
    });
  }
});

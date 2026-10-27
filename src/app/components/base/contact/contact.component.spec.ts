import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { LimitService } from '../../../services/limit/limit.service';
import emailjs from '@emailjs/browser';
import { By } from '@angular/platform-browser';
import { CustomCaptchaComponent } from '../../include/captcha/custom-captcha.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        provideHttpClient(withXhr()),
        {
          provide: LimitService,
          useValue: {
            checkLimit: () => false,
            setLimit: () => undefined,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call EmailJS when the form is invalid', async () => {
    const sendSpy = spyOn(emailjs, 'send').and.returnValue(Promise.resolve({} as never));

    component.contactForm.setValue({ name: '', email: '', message: '' });
    await component.onSubmit();

    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should not call EmailJS when captcha is missing', async () => {
    const sendSpy = spyOn(emailjs, 'send').and.returnValue(Promise.resolve({} as never));

    component.contactForm.setValue({
      name: 'Gaetan',
      email: 'test@example.com',
      message: 'Hello world',
    });
    component.captchaToken.set(null);

    await component.onSubmit();

    expect(sendSpy).not.toHaveBeenCalled();
  });

  for (const outcome of ['success', 'failure'] as const) {
    it(`should reset the captcha after a send ${outcome}`, async () => {
      const send = outcome === 'success'
        ? Promise.resolve({} as never)
        : Promise.reject(new Error('EmailJS down'));
      spyOn(emailjs, 'send').and.returnValue(send);
      const captcha = fixture.debugElement
        .query(By.directive(CustomCaptchaComponent))
        .componentInstance as CustomCaptchaComponent;
      const resetSpy = spyOn(captcha, 'reset');

      component.contactForm.setValue({
        name: 'Gaetan',
        email: 'test@example.com',
        message: 'Hello world',
      });
      component.captchaToken.set('token');

      await component.onSubmit();
      await send.catch(() => undefined);
      await fixture.whenStable();

      expect(resetSpy).toHaveBeenCalledTimes(1);
      expect(component.captchaToken()).toBeNull();
    });
  }
});

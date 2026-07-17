import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
import { provideHttpClient } from '@angular/common/http';
import { LimitService } from '../../../services/limit/limit.service';
import emailjs from '@emailjs/browser';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        provideHttpClient(),
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
});

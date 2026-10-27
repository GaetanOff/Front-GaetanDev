import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ChatbotComponent } from './chatbot.component';
import { environment } from '../../../../environments/environment';

describe('ChatbotComponent', () => {
  const apiUrl = environment.chatbotApiUrl;
  let component: ChatbotComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotComponent],
      providers: [provideHttpClient(withXhr()), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(ChatbotComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    spyOn(console, 'error');
  });

  afterEach(() => {
    httpMock.verify();
  });

  async function verify(captchaToken: string): Promise<void> {
    const done = component.onCaptchaResolved(captchaToken);
    httpMock.expectOne(`${apiUrl}/verify`).flush({ sessionToken: `session-${captchaToken}` });
    await done;
  }

  it('should start a fresh history after a 403 and a new verification', async () => {
    await verify('first');

    component.userInput = 'Bonjour';
    let sent = component.sendMessage();
    httpMock.expectOne(apiUrl).flush({ reply: 'Salut' });
    await sent;

    component.userInput = 'Encore là ?';
    sent = component.sendMessage();
    httpMock.expectOne(apiUrl).flush(null, { status: 403, statusText: 'Forbidden' });
    await sent;
    expect(component.isCaptchaVerified()).toBeFalse();

    await verify('second');

    component.userInput = 'Nouvelle question';
    sent = component.sendMessage();
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.body.history).toEqual([]);
    expect(req.request.body.sessionToken).toBe('session-second');
    req.flush({ reply: 'Réponse' });
    await sent;
  });
});

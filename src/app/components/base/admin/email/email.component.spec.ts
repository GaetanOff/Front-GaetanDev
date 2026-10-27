import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { EmailComponent } from './email.component';

describe('EmailComponent', () => {
  let component: EmailComponent;
  let fixture: ComponentFixture<EmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailComponent],
      providers: [
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should only generate an alias once the words are loaded', () => {
    const httpMock = TestBed.inject(HttpTestingController);

    component.generateRandomAlias();
    expect(component.emailName).toBe('');

    httpMock.expectOne(req => req.url.endsWith('/mail/getWords'))
      .flush({ firstWords: ['blue'], secondWords: ['fox'] });
    component.generateRandomAlias();

    expect(component.emailName).toMatch(/^blue[-._]/);
    expect(component.emailName).not.toContain('undefined');
  });
});

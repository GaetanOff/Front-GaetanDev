import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { ProxiesComponent } from './proxies.component';

describe('ProxiesComponent', () => {
  let component: ProxiesComponent;
  let fixture: ComponentFixture<ProxiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProxiesComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProxiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

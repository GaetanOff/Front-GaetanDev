import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { TempladminComponent } from './templadmin.component';

describe('TempladminComponent', () => {
  let component: TempladminComponent;
  let fixture: ComponentFixture<TempladminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempladminComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TempladminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

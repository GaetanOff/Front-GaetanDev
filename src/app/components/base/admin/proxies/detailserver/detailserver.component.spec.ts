import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { DetailserverComponent } from './detailserver.component';

describe('DetailserverComponent', () => {
  let component: DetailserverComponent;
  let fixture: ComponentFixture<DetailserverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailserverComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { params: of({ id: '1' }), snapshot: {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

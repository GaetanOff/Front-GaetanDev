import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { WhitelistComponent } from './whitelist.component';

describe('WhitelistComponent', () => {
  let component: WhitelistComponent;
  let fixture: ComponentFixture<WhitelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhitelistComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WhitelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowIStartedComponent } from './how-i-started.component';

describe('HowIStartedComponent', () => {
  let component: HowIStartedComponent;
  let fixture: ComponentFixture<HowIStartedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowIStartedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowIStartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

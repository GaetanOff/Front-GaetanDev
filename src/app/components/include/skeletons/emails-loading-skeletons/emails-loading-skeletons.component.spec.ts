import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailsLoadingSkeletonsComponent } from './emails-loading-skeletons.component';

describe('EmailsLoadingSkeletonsComponent', () => {
  let component: EmailsLoadingSkeletonsComponent;
  let fixture: ComponentFixture<EmailsLoadingSkeletonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailsLoadingSkeletonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailsLoadingSkeletonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

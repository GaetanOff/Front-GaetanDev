import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmailSkeletonsComponent } from './add-email-skeletons.component';

describe('AddEmailSkeletonsComponent', () => {
  let component: AddEmailSkeletonsComponent;
  let fixture: ComponentFixture<AddEmailSkeletonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEmailSkeletonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmailSkeletonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

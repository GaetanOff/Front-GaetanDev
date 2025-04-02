import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveEmailSkeletonsComponent } from './remove-email-skeletons.component';

describe('RemoveEmailSkeletonsComponent', () => {
  let component: RemoveEmailSkeletonsComponent;
  let fixture: ComponentFixture<RemoveEmailSkeletonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveEmailSkeletonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveEmailSkeletonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

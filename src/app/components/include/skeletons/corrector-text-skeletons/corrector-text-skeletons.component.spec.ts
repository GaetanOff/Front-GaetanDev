import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectorTextSkeletonsComponent } from './corrector-text-skeletons.component';

describe('CorrectorTextSkeletonsComponent', () => {
  let component: CorrectorTextSkeletonsComponent;
  let fixture: ComponentFixture<CorrectorTextSkeletonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorrectorTextSkeletonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorrectorTextSkeletonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

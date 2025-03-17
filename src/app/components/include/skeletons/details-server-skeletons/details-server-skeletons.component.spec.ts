import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsServerSkeletonsComponent } from './details-server-skeletons.component';

describe('DetailsServerSkeletonsComponent', () => {
  let component: DetailsServerSkeletonsComponent;
  let fixture: ComponentFixture<DetailsServerSkeletonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsServerSkeletonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsServerSkeletonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

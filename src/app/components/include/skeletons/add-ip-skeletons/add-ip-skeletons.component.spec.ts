import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIpSkeletonsComponent } from './add-ip-skeletons.component';

describe('AddIpSkeletonsComponent', () => {
  let component: AddIpSkeletonsComponent;
  let fixture: ComponentFixture<AddIpSkeletonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddIpSkeletonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddIpSkeletonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RemoveIpSkeletonsComponent} from './remove-ip-skeletons.component';

describe('RemoveIpSkeletonsComponent', () => {
  let component: RemoveIpSkeletonsComponent;
  let fixture: ComponentFixture<RemoveIpSkeletonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveIpSkeletonsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RemoveIpSkeletonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

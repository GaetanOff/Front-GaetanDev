import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ContactSkeletonsComponent} from './contact-skeletons.component';

describe('ContactSkeletonsComponent', () => {
  let component: ContactSkeletonsComponent;
  let fixture: ComponentFixture<ContactSkeletonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSkeletonsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ContactSkeletonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

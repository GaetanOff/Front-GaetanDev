import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CertifComponent} from './certif.component';

describe('CertifComponent', () => {
  let component: CertifComponent;
  let fixture: ComponentFixture<CertifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertifComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

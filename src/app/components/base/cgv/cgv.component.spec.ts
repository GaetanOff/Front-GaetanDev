import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CgvComponent } from './cgv.component';

describe('CgvComponent', () => {
  let component: CgvComponent;
  let fixture: ComponentFixture<CgvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CgvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CgvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TempladminComponent} from './templadmin.component';

describe('TempladminComponent', () => {
  let component: TempladminComponent;
  let fixture: ComponentFixture<TempladminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TempladminComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TempladminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

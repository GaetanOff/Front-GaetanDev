import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JavapluginsComponent } from './javaplugins.component';

describe('JavapluginsComponent', () => {
  let component: JavapluginsComponent;
  let fixture: ComponentFixture<JavapluginsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JavapluginsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JavapluginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

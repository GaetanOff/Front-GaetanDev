import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxiesComponent } from './proxies.component';

describe('ProxiesComponent', () => {
  let component: ProxiesComponent;
  let fixture: ComponentFixture<ProxiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProxiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProxiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

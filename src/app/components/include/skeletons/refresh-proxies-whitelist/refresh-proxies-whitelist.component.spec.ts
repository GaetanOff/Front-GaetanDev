import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshProxiesWhitelistComponent } from './refresh-proxies-whitelist.component';

describe('RefreshProxiesWhitelistComponent', () => {
  let component: RefreshProxiesWhitelistComponent;
  let fixture: ComponentFixture<RefreshProxiesWhitelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefreshProxiesWhitelistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefreshProxiesWhitelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

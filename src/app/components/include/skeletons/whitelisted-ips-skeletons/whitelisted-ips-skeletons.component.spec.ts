import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhitelistedIpsSkeletonsComponent } from './whitelisted-ips-skeletons.component';

describe('WhitelistedIpsSkeletonsComponent', () => {
  let component: WhitelistedIpsSkeletonsComponent;
  let fixture: ComponentFixture<WhitelistedIpsSkeletonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhitelistedIpsSkeletonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WhitelistedIpsSkeletonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

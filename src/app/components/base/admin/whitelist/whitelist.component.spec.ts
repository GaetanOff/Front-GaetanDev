import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhitelistComponent } from './whitelist.component';

describe('WhitelistComponent', () => {
  let component: WhitelistComponent;
  let fixture: ComponentFixture<WhitelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhitelistComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WhitelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

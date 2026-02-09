import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailserverComponent } from './detailserver.component';

describe('DetailserverComponent', () => {
  let component: DetailserverComponent;
  let fixture: ComponentFixture<DetailserverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailserverComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DetailserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

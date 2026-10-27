import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DetailserverComponent } from './detailserver.component';
import { AdminService } from '../../../../../services/admin/admin.service';
import { ScanningServer } from '../../../../../types';

describe('DetailserverComponent', () => {
  let component: DetailserverComponent;
  let fixture: ComponentFixture<DetailserverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailserverComponent],
      providers: [
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { params: of({ id: '1' }), snapshot: {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep showing the details while polling', fakeAsync(() => {
    // Premier appel résolu, les suivants restent en attente (tick de polling en cours).
    let calls = 0;
    spyOn(TestBed.inject(AdminService), 'getScanningProxyServersDetails').and.callFake(() =>
      calls++ === 0 ? of({} as ScanningServer) : new Subject<ScanningServer>()
    );
    // Instance hors rendu, pour ne dépendre que de l'état du composant.
    const polled = TestBed.runInInjectionContext(() => new DetailserverComponent());

    polled.ngOnInit();
    expect(polled.isLoading()).toBeFalse();

    tick(5000);
    expect(polled.isLoading()).toBeFalse();
    expect(polled.serverDetails()).not.toBeNull();

    expect(calls).toBe(2);
    polled.ngOnDestroy();
  }));
});

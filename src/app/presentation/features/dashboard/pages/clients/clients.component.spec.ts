import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientsComponent } from './clients.component';
import { ClientsStateService } from 'src/app/core/services/clients-state.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { of } from 'rxjs';

describe('ClientsComponent', () => {
  let component: ClientsComponent;
  let fixture: ComponentFixture<ClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsComponent],
      providers: [
        {
          provide: ClientsStateService,
          useValue: {
            getClientsData$: () => of({ clients: [], total: 0, metrics: { total: 0, averageAge: 0, standardDeviation: 0 } }),
            currentUiState: { pageIndex: 0, pageSize: 10, sortBy: '', isAscending: true, filters: {} },
            addClient: () => of({}),
            setFilters: jasmine.createSpy('setFilters'),
            resetState: jasmine.createSpy('resetState'),
            setPage: jasmine.createSpy('setPage'),
            setPageSize: jasmine.createSpy('setPageSize'),
            setSorting: jasmine.createSpy('setSorting'),
          },
        },
        { provide: ToastService, useValue: { show: jasmine.createSpy('show') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

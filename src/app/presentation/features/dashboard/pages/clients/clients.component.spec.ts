import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientsComponent } from './clients.component';
import { ClientsStateService } from 'src/app/core/services/clients-state.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';

describe('ClientsComponent', () => {
  let component: ClientsComponent;
  let fixture: ComponentFixture<ClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsComponent, NoopAnimationsModule, MatDialogModule, MatNativeDateModule],
      providers: [
        {
          provide: ClientsStateService,
          useValue: {
            rawClients: of([]),
            metrics$: of({ total: 0, averageAge: 0, standardDeviation: 0 }),
            addClient: () => of({}),
            updateFilteredData: jasmine.createSpy('updateFilteredData'),
            resetFilteredData: jasmine.createSpy('resetFilteredData'),
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

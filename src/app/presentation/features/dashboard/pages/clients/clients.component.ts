import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AppError } from 'src/app/core/errors';
import { ClientsStateService } from 'src/app/core/services/clients-state.service';
import { firstValueFrom, Subscription, tap } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { formatDateToISO } from 'src/app/core/helpers/date.helper';
import { MatDialog } from '@angular/material/dialog';
import { CreateClientModalComponent } from './components/create-client-modal/create-client-modal.component';
import { MetricsCardsComponent } from './components/metrics-cards/metrics-cards.component';
import { ClientsTableComponent } from './components/clients-table/clients-table.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Client } from 'src/app/domain/models/client.model';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MetricsCardsComponent,
    ClientsTableComponent,
  ],
  templateUrl: './clients.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * @description Componente principal de la vista de clientes.
 * Gestiona la interacción con la tabla, métricas, filtros y el modal de creación de clientes.
 */
export class ClientsComponent implements OnInit, OnDestroy {
  private readonly stateService = inject(ClientsStateService);
  private readonly toastService = inject(ToastService);
  private readonly loadingService = inject(LoadingService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialog = inject(MatDialog);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private breakpointSub!: Subscription;

  readonly rawClients$ = this.stateService.rawData$;
  readonly metrics$ = this.stateService.metrics$;

  @ViewChild(ClientsTableComponent) tableComponent!: ClientsTableComponent;

  private _showMetrics = true;
  /** @description Indica si el dispositivo actual es móvil */
  isMobile = false;
  /** @description Indica si los datos han sido cargados */
  dataLoaded = false;

  /**
   * @description Indica si las tarjetas de métricas deben mostrarse.
   * @returns `true` si las métricas están visibles, `false` en caso contrario
   */
  get showMetrics() {
    return this._showMetrics;
  }

  /**
   * @description Inicializa el componente y suscribe al observer de breakpoints para detectar dispositivos móviles.
   */
  ngOnInit(): void {
    this.breakpointSub = this.breakpointObserver
      .observe(['(max-width: 767px)'])
      .subscribe((result) => {
        this.isMobile = result.matches;
        if (result.matches) {
          this._showMetrics = false;
        }
      });
  }

  /**
   * @description Libera los recursos y cancela las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    if (this.breakpointSub) {
      this.breakpointSub.unsubscribe();
    }
  }

  /**
   * @description Abre el modal para crear un nuevo cliente.
   * Al cerrar el modal con datos, invoca `handleSaveClient` con la información proporcionada.
   */
  openCreateModal(): void {
    const isMobile = window.innerWidth < 600;
    const dialogRef = this.dialog.open(CreateClientModalComponent, {
      width: isMobile ? 'auto' : '500px',
      maxWidth: isMobile ? '100%' : '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.handleSaveClient(result);
      }
    });
  }

  /**
   * @description Guarda un nuevo cliente en el estado de la aplicación.
   * Muestra un indicador de carga y notifica el resultado mediante un toast.
   * @param clientData - Datos del cliente a crear
   * @returns Promesa que se resuelve al finalizar la operación
   */
  async handleSaveClient(clientData: Client): Promise<void> {
    this.loadingService.show();
    try {
      await firstValueFrom(this.stateService.addClient(clientData));
      this.toastService.show('Cliente creado con éxito', 'success');
    } catch (error) {
      if (error instanceof AppError) {
        error.markAsHandled();
      }
      this.toastService.show('Error al guardar, intenta nuevamente', 'error');
    } finally {
      this.loadingService.hide();
      this.cdr.markForCheck();
    }
  }

  /**
   * @description Alterna la visibilidad de las tarjetas de métricas.
   */
  toggleMetrics(): void {
    this._showMetrics = !this._showMetrics;
  }

  /**
   * @description Recibe los clientes filtrados de la tabla y actualiza el estado para las métricas.
   * @param filteredClients - Array de clientes filtrados
   */
  handleFilteredClientsChange(filteredClients: Client[]): void {
    this.stateService.updateFilteredData(filteredClients);
  }

  /**
   * @description Limpia todos los filtros de la tabla y restablece los datos filtrados.
   */
  clearAllFilters(): void {
    if (this.tableComponent) {
      this.tableComponent.onClearAllFilters();
    }
  }
}

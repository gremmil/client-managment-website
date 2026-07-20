import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import {
  HeroEye,
  HeroEyeSlash,
  HeroPlus,
  HeroArrowPath,
  HeroXMark,
} from '@ng-icons/heroicons/outline';
import { AppError } from 'src/app/core/errors';
import { ClientsStateService } from 'src/app/core/services/clients-state.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { formatDateToISO } from 'src/app/core/helpers/date.helper';
import { MatDialog } from '@angular/material/dialog';
import { CreateClientModalComponent } from './components/create-client-modal/create-client-modal.component';
import { MetricsCardsComponent } from './components/metrics-cards/metrics-cards.component';
import { ClientsTableComponent } from './components/clients-table/clients-table.component';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    NgIconsModule,
    MetricsCardsComponent,
    ClientsTableComponent,
  ],
  providers: [provideIcons({ HeroEye, HeroEyeSlash, HeroPlus, HeroArrowPath, HeroXMark })],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
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
  readonly viewData$ = this.stateService.getClientsData$();
  readonly ageRange$ = this.stateService.ageRange$;
  readonly pageIndex$ = this.stateService.pageIndex$;
  readonly pageSize$ = this.stateService.pageSize$;

  @ViewChild(ClientsTableComponent) tableComponent!: ClientsTableComponent;

  /** @description Opciones de tamaño de página disponibles para el paginador */
  pageSizeOptions = [10, 20, 50, 100];
  private _showMetrics = true;
  /** @description Indica si el dispositivo actual es móvil */
  isMobile = false;

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
      width: isMobile ? '95vw' : '500px',
      maxWidth: isMobile ? '95vw' : '500px',
      disableClose: false,
      panelClass: 'create-client-modal',
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
  async handleSaveClient(clientData: { name: string; lastname: string; age: number; birthDate: Date | string }): Promise<void> {
    this.loadingService.show();
    try {
      const birthDateStr = clientData.birthDate instanceof Date
        ? formatDateToISO(clientData.birthDate)
        : clientData.birthDate;
      const payload = { ...clientData, birthDate: birthDateStr };
      await firstValueFrom(this.stateService.addClient(payload));
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
    * @description Maneja el evento de cambio de página del paginador y actualiza el estado.
    * @param event - Evento de paginación con el índice y tamaño de página
    */
  handlePageChange(event: any): void {
    console.log('handlePageChange called with:', event);
    this.stateService.setPage(event.pageIndex);
    this.stateService.setPageSize(event.pageSize);
    console.log('State updated:', this.stateService.currentUiState);
  }

  /**
   * @description Maneja el evento de ordenamiento de la tabla y actualiza el estado.
   * @param event - Evento de ordenamiento con la columna activa y la dirección
   */
  handleSort(event: any): void {
    if (event.direction) {
      this.stateService.setSorting(event.active, event.direction === 'asc');
    } else {
      this.stateService.resetSorting();
    }
  }

  /**
   * @description Maneja el evento de cambio de filtros y actualiza el estado.
   * @param filters - Objeto con los filtros aplicados
   */
  handleFilterChange(filters: any): void {
    this.stateService.setFilters(filters);
  }

  /**
   * @description Maneja el evento de limpieza de todos los filtros restableciendo el estado.
   */
  handleClearAllFilters(): void {
    this.stateService.resetState();
  }

  /**
   * @description Restablece el estado y limpia los filtros en la tabla de clientes.
   */
  clearAllFilters(): void {
    this.stateService.resetState();
    if (this.tableComponent) {
      this.tableComponent.clearFilters();
    }
  }
}

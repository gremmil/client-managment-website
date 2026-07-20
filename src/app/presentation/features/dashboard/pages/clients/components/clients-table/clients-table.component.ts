import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import {
  MatPaginatorModule,
  MatPaginator,
  PageEvent,
} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { Client } from 'src/app/domain/models/client.model';
import { TableFilters } from 'src/app/core/interfaces/client-table.interface';
import { formatDateToISO } from 'src/app/core/helpers/date.helper';
import { MatNativeDateModule } from '@angular/material/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import {
  HeroFunnel,
  HeroChevronDown,
  HeroXMark,
} from '@ng-icons/heroicons/outline';
import { MatDialog } from '@angular/material/dialog';
import { FilterModalComponent, FilterModalData, FilterModalResult } from '../filter-modal/filter-modal.component';

/**
 * @description Representa una fila de la tabla de clientes.
 */
export interface ClientRow {
  /** @description Identificador único del cliente */
  id: string;
  /** @description Nombre del cliente */
  name: string;
  /** @description Apellido del cliente */
  lastname: string;
  /** @description Edad del cliente */
  age: number;
  /** @description Fecha de nacimiento del cliente en formato de cadena */
  birthDate: string;
}

@Component({
  selector: 'app-clients-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    NgIconsModule,
  ],
  providers: [provideIcons({ HeroFunnel, HeroChevronDown, HeroXMark })],
  templateUrl: './clients-table.component.html',
  styleUrls: ['./clients-table.component.scss'],
})
/**
 * @description Componente de tabla para mostrar, filtrar, ordenar y paginar la lista de clientes.
 */
export class ClientsTableComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** @description Lista de clientes a mostrar en la tabla */
  @Input() clients: Client[] = [];
  /** @description Cantidad total de clientes disponibles para la paginación */
  @Input() total: number = 0;
  /** @description Índice de la página actual */
  @Input() 
  set pageIndex(value: number) {
    this._pageIndex = value;
    if (this.paginator && this.paginator.pageIndex !== value) {
      this.paginator.pageIndex = value;
    }
  }
  get pageIndex(): number {
    return this._pageIndex;
  }
  private _pageIndex: number = 0;
  
  /** @description Cantidad de elementos por página */
  @Input() 
  set pageSize(value: number) {
    this._pageSize = value;
    if (this.paginator && this.paginator.pageSize !== value) {
      this.paginator.pageSize = value;
    }
  }
  get pageSize(): number {
    return this._pageSize;
  }
  private _pageSize: number = 10;
  
  /** @description Campo por el cual se está ordenando */
  @Input()
  set sortBy(value: string) {
    this._sortBy = value;
    this.syncSortUI();
  }
  get sortBy(): string {
    return this._sortBy;
  }
  private _sortBy: string = '';
  
  /** @description Indica si el ordenamiento es ascendente */
  @Input()
  set isAscending(value: boolean) {
    this._isAscending = value;
    this.syncSortUI();
  }
  get isAscending(): boolean {
    return this._isAscending;
  }
  private _isAscending: boolean = false;
  
  /** @description Rango de edades permitido para los filtros de edad */
  @Input() ageRange: { min: number; max: number } = { min: 18, max: 100 };

  /** @description Emite un evento cuando cambia el ordenamiento de la tabla */
  @Output() sortChange = new EventEmitter<Sort>();
  /** @description Emite un evento cuando cambia la página del paginador */
  @Output() pageChange = new EventEmitter<PageEvent>();
  /** @description Emite un evento cuando cambian los filtros aplicados */
  @Output() filterChange = new EventEmitter<TableFilters>();
  /** @description Emite un evento cuando se solicita limpiar todos los filtros */
  @Output() clearAllFilters = new EventEmitter<void>();

  /** @description Columnas visibles en la tabla */
  displayedColumns: string[] = ['name', 'lastname', 'age', 'birthDate'];
  /** @description Datos transformados que alimentan la tabla */
  dataSource: ClientRow[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly dialog = inject(MatDialog);
  private breakpointSub!: Subscription;
  private sortSub!: Subscription;

  /** @description Indica si el dispositivo actual es móvil */
  isMobile = false;

  /** @description Bandera para evitar emisiones del sort durante actualizaciones programáticas */
  private isUpdatingSort = false;

  /** @description Filtro por nombre del cliente */
  nameFilter = '';
  /** @description Filtro por apellido del cliente */
  lastnameFilter = '';
  /** @description Filtro de edad mínima */
  ageMinFilter: number | null = null;
  /** @description Filtro de edad máxima */
  ageMaxFilter: number | null = null;
  /** @description Filtro de fecha de nacimiento inicial */
  birthDateStartFilter: Date | null = null;
  /** @description Filtro de fecha de nacimiento final */
  birthDateEndFilter: Date | null = null;

  /**
   * @description Conecta los eventos de ordenamiento y paginación después de inicializar la vista.
   * También suscribe al observer de breakpoints para detectar cambios de tamaño de pantalla.
   */
  ngAfterViewInit(): void {
    this.connectViewChildren();

    this.breakpointSub = this.breakpointObserver
      .observe(['(max-width: 767px)'])
      .subscribe((result) => {
        this.isMobile = result.matches;
        setTimeout(() => {
          this.connectViewChildren();
        });
      });
  }

  private connectViewChildren(): void {
    if (this.sort) {
      if (this.sortSub) {
        this.sortSub.unsubscribe();
      }
      this.sortSub = this.sort.sortChange.subscribe((sort: Sort) => {
        if (!this.isUpdatingSort) {
          this.sortChange.emit(sort);
        }
      });
    }
  }

  /**
    * @description Libera los recursos y cancela las suscripciones al destruir el componente.
    */
  ngOnDestroy(): void {
    if (this.breakpointSub) {
      this.breakpointSub.unsubscribe();
    }
    if (this.sortSub) {
      this.sortSub.unsubscribe();
    }
  }

  /**
    * @description Detecta cambios en las entradas y actualiza el dataSource cuando cambia la lista de clientes.
    * @param changes - Objeto con los cambios detectados en las propiedades de entrada
    */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clients']) {
      this.dataSource = this.clients.map((client) => ({
        id: client.id || '',
        name: client.name,
        lastname: client.lastname,
        age: client.age,
        birthDate: client.birthDate,
      }));
    }
  }

  /**
   * @description Emite los filtros actuales al componente padre para aplicar el filtrado de datos.
   */
  applyFilters(): void {
    this.filterChange.emit({
      name: this.nameFilter,
      lastname: this.lastnameFilter,
      ageMin: this.ageMinFilter,
      ageMax: this.ageMaxFilter,
      birthDateStart: this.birthDateStartFilter
        ? formatDateToISO(this.birthDateStartFilter)
        : '',
      birthDateEnd: this.birthDateEndFilter
        ? formatDateToISO(this.birthDateEndFilter)
        : '',
    });
  }

  /**
   * @description Restablece todos los filtros locales y emite los filtros vacíos.
   */
  clearFilters(): void {
    this.nameFilter = '';
    this.lastnameFilter = '';
    this.ageMinFilter = null;
    this.ageMaxFilter = null;
    this.birthDateStartFilter = null;
    this.birthDateEndFilter = null;
    this.applyFilters();
  }

  /**
   * @description Limpia el filtro de nombre y reaplica los filtros.
   */
  clearNameFilter(): void {
    this.nameFilter = '';
    this.applyFilters();
  }

  /**
   * @description Limpia el filtro de apellido y reaplica los filtros.
   */
  clearLastnameFilter(): void {
    this.lastnameFilter = '';
    this.applyFilters();
  }

  /**
   * @description Limpia los filtros de edad mínima y máxima y reaplica los filtros.
   */
  clearAgeFilter(): void {
    this.ageMinFilter = null;
    this.ageMaxFilter = null;
    this.applyFilters();
  }

  /**
   * @description Limpia los filtros de fecha de nacimiento y reaplica los filtros.
   */
  clearBirthDateFilter(): void {
    this.birthDateStartFilter = null;
    this.birthDateEndFilter = null;
    this.applyFilters();
  }

  /**
   * @description Limpia todos los filtros locales y notifica al componente padre.
   */
  onClearAllFilters(): void {
    this.clearFilters();
    this.clearAllFilters.emit();
  }

  /**
   * @description Calcula la cantidad de filtros activos actualmente.
   * @returns Número de filtros que tienen un valor asignado
   */
  get activeFiltersCount(): number {
    let count = 0;
    if (this.nameFilter) count++;
    if (this.lastnameFilter) count++;
    if (this.ageMinFilter !== null || this.ageMaxFilter !== null) count++;
    if (this.birthDateStartFilter || this.birthDateEndFilter) count++;
    return count;
  }

  /**
    * @description Sincroniza la UI del MatSort con el estado actual del ordenamiento.
    */
  private syncSortUI(): void {
    if (this.sort && this._sortBy) {
      const direction = this._isAscending ? 'asc' : 'desc';
      if (this.sort.active !== this._sortBy || this.sort.direction !== direction) {
        this.isUpdatingSort = true;
        this.sort.sort({
          id: this._sortBy,
          start: direction,
          disableClear: false,
        });
        setTimeout(() => {
          this.isUpdatingSort = false;
        });
      }
    }
  }

  /**
    * @description Maneja el evento de cambio de página directamente desde el template.
    * @param event - Evento de paginación con el índice y tamaño de página
    */
  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  /**
    * @description Abre el modal de filtros con los valores actuales y actualiza los filtros al cerrar el modal con resultado.
    */
  openFilterModal(): void {
    const isMobile = window.innerWidth < 600;
    
    const dialogData: FilterModalData = {
      name: this.nameFilter,
      lastname: this.lastnameFilter,
      ageMin: this.ageMinFilter,
      ageMax: this.ageMaxFilter,
      birthDateStart: this.birthDateStartFilter,
      birthDateEnd: this.birthDateEndFilter,
      ageRange: this.ageRange,
    };

    const dialogRef = this.dialog.open(FilterModalComponent, {
      width: isMobile ? '95vw' : '500px',
      maxWidth: isMobile ? '95vw' : '500px',
      disableClose: false,
      panelClass: 'filter-modal',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result: FilterModalResult | undefined) => {
      if (result) {
        this.nameFilter = result.name;
        this.lastnameFilter = result.lastname;
        this.ageMinFilter = result.ageMin;
        this.ageMaxFilter = result.ageMax;
        this.birthDateStartFilter = result.birthDateStart ? new Date(result.birthDateStart) : null;
        this.birthDateEndFilter = result.birthDateEnd ? new Date(result.birthDateEnd) : null;
        this.applyFilters();
      }
    });
  }
}

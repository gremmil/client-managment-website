import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import {
  MatPaginatorModule,
  MatPaginator,
  MatPaginatorIntl,
} from '@angular/material/paginator';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { Client } from 'src/app/domain/models/client.model';
import { TableFilters } from 'src/app/core/interfaces/client-table.interface';
import { BehaviorSubject, combineLatest, map, startWith } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { AutoUnsubscribe } from 'src/app/core/decorators/auto-unsubscribe.decorator';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MyCustomPaginatorIntl } from './my-custom-paginator-intl.service';
import { BreakpointService } from 'src/app/core/services/breakpoint.service';
import { MatCardModule } from '@angular/material/card';

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
    MatButtonModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './clients-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],
})
/**
 * @description Componente de tabla para mostrar, filtrar, ordenar y paginar la lista de clientes.
 * Recibe la lista completa de clientes, aplica filtros internamente de forma reactiva
 * y emite los datos filtrados hacia el componente padre.
 */
@AutoUnsubscribe()
export class ClientsTableComponent implements AfterViewInit {
  /** @description Lista completa de clientes sin filtrar */
  @Input() set clients(data: Client[]) {
    this._clients$.next(data);
  }

  /** @description Emite la lista de clientes filtrados cada vez que cambian los datos o filtros */
  @Output() filteredClientsChange = new EventEmitter<Client[]>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly _clients$ = new BehaviorSubject<Client[]>([]);
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly breakpointService = inject(BreakpointService);

  /** @description Observable para gestionar los cambio de los clientes */
  clients$ = this._clients$.asObservable();

  /** @description Formulario Reactivo para gestionar los filtros de la tabla */
  filterForm = this.formBuilder.group({
    name: [''],
    lastname: [''],
    ageMin: [null as number | null],
    ageMax: [null as number | null],
    birthDateStart: [null as Date | null],
    birthDateEnd: [null as Date | null],
  });

  /** @description Columnas visibles en la tabla */
  displayedColumns: string[] = ['name', 'lastname', 'age', 'birthDate'];

  /** @description Fuente de datos para Material Table */
  dataSource = new MatTableDataSource<Client>();

  /** @description Indica si el dispositivo actual es de tipo móvil */
  isMobile$ = this.breakpointService.isMobile$;

  /**
   * @description Calcula la cantidad de filtros activos actualmente.
   * Se utiliza para mostrar el badge en el botón de filtros en móvil.
   * @returns Número de filtros que tienen un valor asignado.
   */
  get activeFiltersCount(): number {
    const filters = this.filterForm.value;
    return Object.values(filters).filter((v) => v !== null && v !== '').length;
  }

  /**
   * @description Conecta el sort y paginator al dataSource e inicializa el flujo reactivo de filtrado.
   */
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    // Flujo Reactivo: Combina los datos de entrada con los cambios del formulario
    combineLatest([
      this.clients$,
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
    ])
      .pipe(
        map(([clients, filters]) =>
          this.applyCustomFilters(clients, filters as TableFilters),
        ),
      )
      .subscribe((filteredData) => {
        this.dataSource.data = filteredData;
        this.filteredClientsChange.emit(filteredData);
      });
  }

  /**
   * @description Aplica la lógica de filtrado personalizada sobre el array de clientes.
   * @param clients - Lista de clientes a filtrar
   * @param filters - Objeto con los criterios de filtrado
   * @returns Lista de clientes que cumplen con todos los filtros
   * @private
   */
  private applyCustomFilters(
    clients: Client[],
    filters: TableFilters,
  ): Client[] {
    return clients.filter((c) => {
      const matchName =
        !filters.name ||
        c.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchLastname =
        !filters.lastname ||
        c.lastname.toLowerCase().includes(filters.lastname.toLowerCase());
      const matchAgeMin = filters.ageMin === null || c.age >= filters.ageMin;
      const matchAgeMax = filters.ageMax === null || c.age <= filters.ageMax;
      const matchDateStart =
        !filters.birthDateStart || c.birthDate >= filters.birthDateStart;
      const matchDateEnd =
        !filters.birthDateEnd || c.birthDate <= filters.birthDateEnd;

      return (
        matchName &&
        matchLastname &&
        matchAgeMin &&
        matchAgeMax &&
        matchDateStart &&
        matchDateEnd
      );
    });
  }

  /**
   * @description Restablece un control específico del formulario a su valor inicial (null o string vacío).
   * @param key - La clave del filtro a limpiar definida en TableFilters.
   */
  clearFilter(key: keyof TableFilters): void {
    const control = this.filterForm.get(key);
    if (control) {
      // Si es de tipo texto, limpiamos a '', si es tipo date/number, limpiamos a null
      const initialValue = typeof control.value === 'string' ? '' : null;
      control.setValue(initialValue);
    }
  }

  /**
   * @description Restablece todos los valores del formulario de filtros a su estado inicial.
   */
  onClearAllFilters(): void {
    this.filterForm.reset();
  }

  /**
   * @description Abre el modal de filtros y actualiza el formulario con el resultado obtenido.
   */
  openFilterModal(): void {
    const dialogRef = this.dialog.open(FilterModalComponent, {
      data: this.filterForm.value,
      width: '100%',
      maxWidth: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.filterForm.patchValue(result);
    });
  }

  /**
   * Verifica si uno o varios campos del formulario de filtros tienen un valor activo.
   *
   * @param keys - El nombre de un control del formulario (string) o un arreglo de nombres de controles (string[]).
   * @returns `true` si al menos uno de los controles especificados tiene un valor truthy (diferente de null, undefined o vacío); de lo contrario, `false`.
   */
  isFiltered(keys: string | string[]): boolean {
    if (Array.isArray(keys)) {
      return keys.some((key) => !!this.filterForm.get(key)?.value);
    }
    return !!this.filterForm.get(keys)?.value;
  }

  /**
   * @description Obtiene únicamente los elementos correspondientes a la página actual para la vista móvil.
   */
  get paginatedMobileData(): Client[] {
    if (!this.paginator) {
      return this.dataSource.filteredData;
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return this.dataSource.filteredData.slice(
      startIndex,
      startIndex + this.paginator.pageSize,
    );
  }
}

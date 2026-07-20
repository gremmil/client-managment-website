import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay, tap, take } from 'rxjs/operators';
import { Client, CreateClientPayload } from 'src/app/domain/models/client.model';
import { GetClientsUseCase } from 'src/app/domain/use-cases/get-clients.use-case';
import { CreateClientUseCase } from 'src/app/domain/use-cases/create-client.use-case';
import {
  calculateAverage,
  calculateStandardDeviation,
} from 'src/app/core/helpers/math.helper';
import {
  filterClients,
  sortClients,
} from 'src/app/core/helpers/client-table.helper';
import { TableFilters, Metrics } from 'src/app/core/interfaces/client-table.interface';

/**
 * @description Representa el estado de la interfaz de usuario para la tabla de clientes,
 * incluyendo paginación, ordenamiento y filtros activos.
 */
export interface ClientsState {
  /** @description Índice de la página actual (basado en 0) */
  pageIndex: number;
  /** @description Cantidad de elementos mostrados por página */
  pageSize: number;
  /** @description Campo por el cual se ordena la tabla, o cadena vacía si no hay ordenamiento */
  sortBy: keyof Client | '';
  /** @description Indica si el ordenamiento es ascendente (true) o descendente (false) */
  isAscending: boolean;
  /** @description Objeto con los filtros activos para la tabla de clientes */
  filters: TableFilters;
}

/**
 * @description Servicio encargado de gestionar el estado global de la tabla de clientes.
 * Centraliza la carga de datos, filtros, ordenamiento, paginación y métricas,
 * exponiendo observables reactivos para los componentes de la interfaz.
 *
 * @example
 * ```ts
 * const state = inject(ClientsStateService);
 * state.preloadData().subscribe();
 * state.getClientsData$().subscribe(data => console.log(data));
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ClientsStateService {
  private readonly getClientsUseCase = inject(GetClientsUseCase);
  private readonly createClientUseCase = inject(CreateClientUseCase);
  private readonly rawClients$ = new BehaviorSubject<Client[]>([]);
  private readonly uiState$ = new BehaviorSubject<ClientsState>({
    pageIndex: 0,
    pageSize: 10,
    sortBy: 'createdAt',
    isAscending: false,
    filters: {
      name: '',
      lastname: '',
      ageMin: null,
      ageMax: null,
      birthDateStart: null,
      birthDateEnd: null,
    },
  });

  /**
   * @description Obtiene el estado actual de la interfaz de usuario de forma síncrona.
   * @returns El valor actual de ClientsState
   */
  get currentUiState() {
    return this.uiState$.value;
  }

  /**
   * @description Precarga la lista de clientes desde el repositorio y actualiza el estado interno.
   * @returns Observable que emite el array de clientes obtenidos
   */
  preloadData(): Observable<Client[]> {
    return this.getClientsUseCase.execute().pipe(
      take(1),
      tap((clients) => this.rawClients$.next(clients)),
    );
  }

  /**
   * @description Verifica si los datos de clientes ya han sido cargados.
   * @returns true si existen clientes en el estado interno
   */
  hasDataLoaded(): boolean {
    return this.rawClients$.value.length > 0;
  }

  /**
   * @description Crea un nuevo cliente y lo agrega al inicio de la lista interna.
   * @param payload - Datos necesarios para crear el cliente
   * @returns Observable que emite el cliente recién creado
   */
  addClient(payload: CreateClientPayload): Observable<Client> {
    return this.createClientUseCase.execute(payload).pipe(
      take(1),
      tap((newClient) => {
        const currentClients = this.rawClients$.value;
        this.rawClients$.next([newClient, ...currentClients]);
      }),
    );
  }

  /**
   * @description Devuelve un observable reactivo que combina los clientes crudos con el estado
   * de la interfaz (filtros, ordenamiento y paginación), emitiendo los datos procesados
   * junto con el total y las métricas calculadas.
   * @returns Observable con los clientes paginados, el total filtrado y las métricas
   */
  getClientsData$(): Observable<{
    clients: Client[];
    total: number;
    metrics: Metrics;
  }> {
    return combineLatest([
      this.rawClients$.asObservable(),
      this.uiState$.asObservable(),
    ]).pipe(
      map(([rawClients, uiState]) => {
        const filtered = filterClients(rawClients, uiState.filters);
        const ages = filtered.map((c) => c.age).filter((age) => !isNaN(age));
        const averageAge = calculateAverage(ages);
        const standardDeviation = calculateStandardDeviation(ages, averageAge);
        const metrics: Metrics = {
          total: filtered.length,
          averageAge,
          standardDeviation,
        };
        const sorted = sortClients(
          filtered,
          uiState.sortBy,
          uiState.isAscending,
        );
        const start = uiState.pageIndex * uiState.pageSize;
        const paginated = sorted.slice(start, start + uiState.pageSize);

        return {
          clients: paginated,
          total: filtered.length,
          metrics,
        };
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  /**
   * @description Calcula el rango de edades (mínimo y máximo) de los clientes cargados.
   * Si no hay edades válidas, devuelve un rango por defecto de 18 a 100.
   * @returns Observable con el objeto { min, max } del rango de edades
   */
  get ageRange$(): Observable<{ min: number; max: number }> {
    return this.rawClients$.asObservable().pipe(
      map((clients) => {
        const ages = clients.map((c) => c.age).filter((age) => !isNaN(age));
        if (ages.length === 0) {
          return { min: 18, max: 100 };
        }
        return {
          min: Math.min(...ages),
          max: Math.max(...ages),
        };
      }),
    );
  }

  /**
   * @description Actualiza los filtros activos y reinicia la paginación a la primera página.
   * @param filters - Objeto con los nuevos filtros a aplicar
   */
  setFilters(filters: TableFilters): void {
    this.uiState$.next({ ...this.currentUiState, pageIndex: 0, filters });
  }

  /**
   * @description Actualiza el criterio de ordenamiento. Si ya se estaba ordenando por la misma
   * columna, invierte la dirección; de lo contrario, ordena de forma ascendente.
   * Reinicia la paginación a la primera página.
   * @param column - Campo del modelo Client por el cual ordenar
   */
  setSorting(column: keyof Client): void {
    const isSameColumn = this.currentUiState.sortBy === column;
    this.uiState$.next({
      ...this.currentUiState,
      pageIndex: 0,
      sortBy: column,
      isAscending: isSameColumn ? !this.currentUiState.isAscending : true,
    });
  }

  /**
   * @description Actualiza el índice de la página actual.
   * @param index - Índice de la página a mostrar (basado en 0)
   */
  setPage(index: number): void {
    this.uiState$.next({ ...this.currentUiState, pageIndex: index });
  }

  /**
   * @description Actualiza la cantidad de elementos por página, limitando el valor entre 10 y 100.
   * Reinicia la paginación a la primera página.
   * @param size - Nueva cantidad de elementos por página
   */
  setPageSize(size: number): void {
    const newSize = Math.max(10, Math.min(100, size));
    this.uiState$.next({
      ...this.currentUiState,
      pageIndex: 0,
      pageSize: newSize,
    });
  }

  /**
   * @description Restablece el estado de la interfaz a sus valores por defecto,
   * conservando únicamente el tamaño de página actual.
   */
  resetState(): void {
    const currentPageSize = this.currentUiState.pageSize;
    this.uiState$.next({
      pageIndex: 0,
      pageSize: currentPageSize,
      sortBy: 'createdAt',
      isAscending: false,
      filters: {
        name: '',
        lastname: '',
        ageMin: null,
        ageMax: null,
        birthDateStart: null,
        birthDateEnd: null,
      },
    });
  }
}

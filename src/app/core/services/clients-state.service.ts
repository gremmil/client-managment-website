import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, tap, take } from 'rxjs/operators';
import {
  Client,
  CreateClientPayload,
} from 'src/app/domain/models/client.model';
import { GetClientsUseCase } from 'src/app/domain/use-cases/get-clients.use-case';
import { CreateClientUseCase } from 'src/app/domain/use-cases/create-client.use-case';
import {
  calculateAverage,
  calculateStandardDeviation,
} from 'src/app/core/helpers/math.helper';
import { Metrics } from 'src/app/core/interfaces/client-table.interface';
import { formatDateToISO } from 'src/app/core/helpers/date.helper';

/**
 * @description Servicio de estado centralizado para la gestión de clientes.
 * Mantiene la fuente de verdad (raw y filtered) y deriva las métricas automáticamente
 * mediante operadores reactivos.
 */
@Injectable({
  providedIn: 'root',
})
export class ClientsStateService {
  private readonly _getClientsUseCase = inject(GetClientsUseCase);
  private readonly _createClientUseCase = inject(CreateClientUseCase);

  // Subjects privados para el estado interno
  private readonly _rawData$ = new BehaviorSubject<Client[]>([]);
  private readonly _filteredData$ = new BehaviorSubject<Client[]>([]);

  // Observables públicos
  public readonly rawData$: Observable<Client[]> =
    this._rawData$.asObservable();
  public readonly filteredData$: Observable<Client[]> =
    this._filteredData$.asObservable();

  /**
   * @description Observable de métricas. Se recalcula automáticamente cada vez
   * que _filteredData$ emite un nuevo valor.
   */
  public readonly metrics$: Observable<Metrics> = this._filteredData$.pipe(
    map((clients) => this._calculateMetrics(clients)),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  /**
   * @description Precarga los clientes desde el repositorio y normaliza las fechas a objetos Date.
   */
  public preloadData(): Observable<Client[]> {
    return this._getClientsUseCase.execute().pipe(
      take(1),
      map((clients) =>
        clients.map((client) => ({
          ...client,
          birthDate: client.birthDate
            ? new Date(client.birthDate)
            : client.birthDate,
        })),
      ),
      tap((clients) => {
        this._rawData$.next(clients);
        this._filteredData$.next(clients);
      }),
    );
  }

  /**
   * @description Verifica si existen datos cargados.
   */
  public hasDataLoaded(): boolean {
    return this._rawData$.value.length > 0;
  }

  /**
   * @description Crea un cliente, convierte la fecha a formato ISO para la API,
   * y luego normaliza la respuesta para mantener la consistencia del estado.
   */
  public addClient(payload: CreateClientPayload): Observable<Client> {
    return this._createClientUseCase.execute(payload).pipe(
      take(1),
      // Normalizamos la respuesta de la API a Date antes de guardarla en el estado
      map((newClient) => ({
        ...newClient,
        birthDate: new Date(newClient.birthDate),
      })),
      tap((newClient) => {
        this._rawData$.next([newClient, ...this._rawData$.value]);
        this._filteredData$.next([newClient, ...this._filteredData$.value]);
      }),
    );
  }

  /**
   * @description Actualiza el estado filtrado (ej. desde el componente de tabla).
   */
  public updateFilteredData(clients: Client[]): void {
    this._filteredData$.next(clients);
  }

  /**
   * @description Restablece los filtros a la lista original.
   */
  public resetFilteredData(): void {
    this._filteredData$.next(this._rawData$.value);
  }

  /**
   * @description Función pura que abstrae la lógica matemática de las métricas.
   * @private
   */
  private _calculateMetrics(clients: Client[]): Metrics {
    const ages = clients.map((c) => c.age).filter((age) => !isNaN(age));
    const averageAge = calculateAverage(ages);
    const standardDeviation = calculateStandardDeviation(ages, averageAge);

    return {
      total: clients.length,
      averageAge,
      standardDeviation,
    };
  }
}

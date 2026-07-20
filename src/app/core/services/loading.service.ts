import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * @description Servicio de estado de carga global. Controla la visibilidad
 * del overlay de carga mediante un BehaviorSubject.
 *
 * @example
 * ```ts
 * const loading = inject(LoadingService);
 * loading.show();
 * // ... operación asíncrona
 * loading.hide();
 * ```
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  /** @description Observable del estado de carga */
  loading$ = this.loadingSubject.asObservable();

  /**
   * @description Muestra el overlay de carga.
   */
  show(): void {
    this.loadingSubject.next(true);
  }

  /**
   * @description Oculta el overlay de carga.
   */
  hide(): void {
    this.loadingSubject.next(false);
  }

  /**
   * @description Obtiene el estado actual de carga de forma síncrona.
   * @returns true si el overlay está visible
   */
  get isLoading(): boolean {
    return this.loadingSubject.value;
  }
}

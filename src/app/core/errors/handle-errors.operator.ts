import { Observable, OperatorFunction, pipe, throwError, timeout } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { mapFirebaseError } from './firebase-error.mapper';

/**
 * @description Operador RxJS que aplica timeout y mapea errores a AppError.
 * Útil para estandarizar el manejo de errores en peticiones HTTP u operaciones
 * asíncronas dentro de un pipe.
 * @param requestTimeout - Tiempo máximo de espera en milisegundos (por defecto 10000)
 * @returns OperatorFunction que aplica timeout y captura de errores
 */
export function handleErrors<T>(requestTimeout = 10000): OperatorFunction<T, T> {
  return pipe(
    timeout(requestTimeout),
    catchError((error) => throwError(() => mapFirebaseError(error))),
  );
}

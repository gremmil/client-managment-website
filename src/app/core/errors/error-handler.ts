import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ToastService } from 'src/app/core/services/toast.service';
import { AppError } from './app-error';
import { mapFirebaseError } from './firebase-error.mapper';

/**
 * @description Manejador global de errores de la aplicación. Intercepta
 * cualquier error no capturado, lo mapea a AppError y muestra un toast
 * al usuario.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly toastService = inject(ToastService);

  /**
   * @description Procesa un error: lo mapea si es necesario, registra en
   * consola y muestra notificación al usuario. Ignora errores ya manejados.
   * @param error - Error capturado por Angular
   */
  handleError(error: unknown): void {
    const appError = error instanceof AppError ? error : mapFirebaseError(error);

    if (appError.handled) {
      return;
    }

    console.error(`[${appError.name}]`, appError.code, appError.cause ?? appError);
    this.toastService.show(appError.message, 'error');
  }
}

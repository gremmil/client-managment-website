import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * @description Servicio encargado de mostrar notificaciones tipo toast
 * utilizando el componente MatSnackBar de Angular Material.
 *
 * @example
 * ```ts
 * const toast = inject(ToastService);
 * toast.show('Cliente creado', 'success');
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly snackBar = inject(MatSnackBar);

  /**
   * @description Muestra un mensaje toast con el tipo indicado.
   * @param message - Texto a mostrar en la notificación
   * @param type - Tipo de notificación: 'success' o 'error'
   */
  show(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass:
        type === 'success' ? ['success-snackbar'] : ['error-snackbar'],
    });
  }
}

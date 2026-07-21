import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { SignOutUseCase } from 'src/app/domain/use-cases/sign-out.use-case';
import { AppError } from 'src/app/core/errors';

/**
 * @description Componente que muestra una página de error al usuario,
 * ofreciendo opciones para reintentar la carga o cerrar sesión y volver al inicio.
 */
@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  private readonly router = inject(Router);
  private readonly signOutUseCase = inject(SignOutUseCase);

  /**
   * @description Navega a la página de carga de datos para reintentar la operación.
   * @returns void
   */
  retry(): void {
    this.router.navigate(['/loading-data']);
  }

  /**
   * @description Cierra la sesión del usuario y lo redirige a la página de autenticación.
   * Si ocurre un error durante el cierre de sesión, igualmente redirige al usuario.
   * @returns Promesa que se resuelve al completar el cierre de sesión y la navegación
   */
  async goHome(): Promise<void> {
    try {
      await firstValueFrom(this.signOutUseCase.execute());
      this.router.navigate(['/auth']);
    } catch (err) {
      console.error('Error signing out:', err);
      if (err instanceof AppError) {
        err.markAsHandled();
      }
      this.router.navigate(['/auth']);
    }
  }
}

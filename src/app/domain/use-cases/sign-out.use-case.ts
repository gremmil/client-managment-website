import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from 'src/app/domain/repositories/auth.repository';
import { AUTH_REPOSITORY } from 'src/app/core/tokens/repository.tokens';

/**
 * @description Caso de uso encargado de cerrar la sesión del usuario autenticado.
 */
@Injectable({ providedIn: 'root' })
export class SignOutUseCase {
  private readonly authRepository = inject<AuthRepository>(AUTH_REPOSITORY);

  /**
   * @description Ejecuta el cierre de sesión del usuario.
   * @returns Observable que se completa cuando el cierre de sesión finaliza
   */
  execute(): Observable<void> {
    return this.authRepository.signOut();
  }
}

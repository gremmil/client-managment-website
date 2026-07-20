import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository, AuthUser } from 'src/app/domain/repositories/auth.repository';
import { AUTH_REPOSITORY } from 'src/app/core/tokens/repository.tokens';

/**
 * @description Caso de uso encargado de iniciar sesión en el sistema
 * utilizando correo electrónico y contraseña.
 */
@Injectable({ providedIn: 'root' })
export class SignInUseCase {
  private readonly authRepository = inject<AuthRepository>(AUTH_REPOSITORY);

  /**
   * @description Ejecuta el inicio de sesión del usuario.
   * @param email - Correo electrónico del usuario
   * @param password - Contraseña del usuario
   * @returns Observable con el usuario autenticado
   */
  execute(email: string, password: string): Observable<AuthUser> {
    return this.authRepository.signIn(email, password);
  }
}

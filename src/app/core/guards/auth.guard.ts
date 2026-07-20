import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthRepository } from 'src/app/domain/repositories/auth.repository';
import { AUTH_REPOSITORY } from 'src/app/core/tokens/repository.tokens';
import { map, take } from 'rxjs/operators';

/**
 * @description Guardia de autenticación que verifica si el usuario ha iniciado sesión.
 * Si no hay un usuario autenticado, redirige a la ruta `/auth`.
 * @param route - Ruta activada que se intenta acceder
 * @param state - Estado actual de la navegación
 * @returns `true` si el usuario está autenticado, o `false` y redirige a `/auth`
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authRepository = inject<AuthRepository>(AUTH_REPOSITORY);
  const router = inject(Router);

  return authRepository.currentUser$.pipe(
    take(1),
    map((user) => {
      if (user) {
        return true;
      }
      router.navigate(['/auth']);
      return false;
    }),
  );
};

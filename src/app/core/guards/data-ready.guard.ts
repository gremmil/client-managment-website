import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ClientsStateService } from 'src/app/core/services/clients-state.service';

/**
 * @description Guardia que verifica si los datos de clientes ya fueron cargados.
 * Si los datos no están disponibles, redirige a la ruta `/loading-data`.
 * @returns `true` si los datos ya fueron cargados, o `false` y redirige a `/loading-data`
 */
export const dataReadyGuard: CanActivateFn = () => {
  const stateService = inject(ClientsStateService);
  const router = inject(Router);

  if (stateService.hasDataLoaded()) {
    return true;
  }

  router.navigate(['/loading-data']);
  return false;
};

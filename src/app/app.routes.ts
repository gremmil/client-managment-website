import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { dataReadyGuard } from './core/guards/data-ready.guard';

/**
 * @description Definición de las rutas principales de la aplicación.
 * Incluye las rutas de autenticación, carga de datos, error y el
 * módulo del dashboard protegido por los guards de autenticación
 * y datos listos. Las rutas desconocidas redirigen a autenticación.
 *
 * @returns Array de rutas de la aplicación.
 */
export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadComponent: () =>
      import('./presentation/features/auth/pages/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'loading-data',
    loadComponent: () =>
      import(
        './presentation/features/loading-data/pages/loading-data/loading-data.component'
      ).then((m) => m.LoadingDataComponent),
  },
  {
    path: 'error',
    loadComponent: () =>
      import(
        './presentation/features/error/pages/error/error.component'
      ).then((m) => m.ErrorComponent),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./presentation/features/dashboard/routes').then((m) => m.DASHBOARD_ROUTES),
    canActivate: [authGuard, dataReadyGuard],
  },
  { path: '**', redirectTo: 'auth' },
];

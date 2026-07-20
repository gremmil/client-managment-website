import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

/**
 * @description Rutas hijas del módulo de dashboard.
 * Define la navegación interna del panel de control, incluyendo la página de clientes.
 */
export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'clients',
        loadComponent: () =>
          import('./pages/clients/clients.component').then(
            (m) => m.ClientsComponent,
          ),
      },
      { path: '', redirectTo: 'clients', pathMatch: 'full' },
    ],
  },
];

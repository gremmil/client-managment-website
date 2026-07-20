import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingOverlayComponent } from './core/components/loading-overlay/loading-overlay.component';

/**
 * @description Componente raíz de la aplicación.
 * Renderiza la barra de carga global y el contenedor principal
 * donde se cargan las vistas mediante el enrutador.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingOverlayComponent],
  template: `
    <app-loading-overlay></app-loading-overlay>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}

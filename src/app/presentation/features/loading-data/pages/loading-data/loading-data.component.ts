import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ClientsStateService } from 'src/app/core/services/clients-state.service';
import { AppError } from 'src/app/core/errors';
import { LoadingService } from 'src/app/core/services/loading.service';

/**
 * @description Componente que muestra una pantalla de carga mientras se precarga
 * el estado de los clientes. Una vez completada la carga, redirige al dashboard.
 */
@Component({
  selector: 'app-loading-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-data.component.html',
  styleUrls: ['./loading-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingDataComponent {
  private readonly stateService = inject(ClientsStateService);
  private readonly router = inject(Router);
  private readonly loadingService = inject(LoadingService);

  /** @description Mensaje informativo que se muestra al usuario durante el proceso de carga */
  loadingMessage = 'Conectando a la base de datos...';

  /**
   * @description Inicializa el componente actualizando el mensaje de carga,
   * ejecutando la precarga de datos del estado de clientes y navegando al dashboard
   * o a la página de error según el resultado.
   * @returns Promesa que se resuelve al completar la precarga de datos
   */
  async ngOnInit(): Promise<void> {
    this.loadingMessage = 'Obteniendo y analizando directorio de clientes...';

    try {
      await firstValueFrom(this.stateService.preloadData());
      this.loadingMessage = '¡App lista! Redirigiendo...';
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 500);
    } catch (err) {
      console.error(err);
      if (err instanceof AppError) {
        err.markAsHandled();
      }
      this.router.navigate(['/error']);
    }
  }
}

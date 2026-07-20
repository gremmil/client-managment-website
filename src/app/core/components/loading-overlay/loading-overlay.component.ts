import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="loadingService.loading$ | async"
      class="fixed inset-0 z-[9998] flex items-center justify-center bg-t-overlay backdrop-blur-sm"
    >
      <div class="flex flex-col items-center gap-4 bg-t-surface border border-t-border rounded-2xl px-8 py-6 shadow-lg">
        <div class="relative w-12 h-12">
          <div class="absolute inset-0 rounded-full border-4 border-t-border"></div>
          <div class="absolute inset-0 rounded-full border-4 border-t-t-primary border-t-transparent animate-spin"></div>
        </div>
        <span class="text-sm font-medium text-t-text-secondary">Procesando...</span>
      </div>
    </div>
  `,
})
/**
 * @description Componente que muestra una superposición de carga a pantalla completa.
 * Se activa cuando el servicio de carga indica una operación en progreso.
 */
export class LoadingOverlayComponent {
  /** @description Servicio de carga utilizado para observar el estado de operaciones en curso */
  readonly loadingService = inject(LoadingService);
}

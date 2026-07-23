import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { firstValueFrom, Subscription } from 'rxjs';
import { SignOutUseCase } from 'src/app/domain/use-cases/sign-out.use-case';
import { AppError } from 'src/app/core/errors';
import { BreakpointService } from 'src/app/core/services/breakpoint.service';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AutoUnsubscribe } from 'src/app/core/decorators/auto-unsubscribe.decorator';

/**
 * @description Componente principal del panel de control (dashboard).
 * Gestiona la barra lateral con MatSidenav, el menú móvil y la sesión del usuario.
 * En desktop el sidebar empuja el contenido (mode side), en mobile/tablet se superpone con backdrop (mode over).
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatIconModule,
    MatSidenavModule,
    SidebarComponent,
  ],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@AutoUnsubscribe()
export class DashboardComponent implements OnInit {
  private readonly signOutUseCase = inject(SignOutUseCase);
  private readonly router = inject(Router);
  private readonly breakpointService = inject(BreakpointService);

  private desktopSub?: Subscription;

  /** @description Referencia al MatSidenav para controlar apertura/cierre */
  @ViewChild('sidenav') sidenav!: MatSidenav;

  /** @description Modo del sidenav: 'side' en desktop, 'over' en mobile/tablet */
  sidenavMode: 'over' | 'side' = 'side';

  /**
   * @description Inicializa el componente y observa los cambios de tamaño de pantalla.
   * En desktop (>=1024px) usa mode side con el sidebar abierto.
   * En mobile/tablet (<1024px) usa mode over con el sidebar cerrado y backdrop.
   */
  ngOnInit(): void {
    this.desktopSub = this.breakpointService.isDesktop$.subscribe(
      (isDesktop) => {
        this.sidenavMode = isDesktop ? 'side' : 'over';
        if (isDesktop) {
          this.sidenav?.open();
        } else {
          this.sidenav?.close();
        }
      },
    );
  }

  /**
   * @description Alterna la visibilidad del sidebar.
   */
  toggleSidenav(): void {
    this.sidenav?.toggle();
  }

  /**
   * @description Cierra la sesión del usuario y redirige a la pantalla de autenticación.
   * @returns Promesa que se resuelve al finalizar el proceso de cierre de sesión.
   */
  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.signOutUseCase.execute());
      this.router.navigate(['/auth']);
    } catch (err) {
      if (err instanceof AppError) {
        err.markAsHandled();
      }
    }
  }
}

import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import {
  HeroBars3,
  HeroXMark,
  HeroUserGroup,
} from '@ng-icons/heroicons/outline';
import { firstValueFrom, Subscription } from 'rxjs';
import { SignOutUseCase } from 'src/app/domain/use-cases/sign-out.use-case';
import { AppError } from 'src/app/core/errors';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BreakpointObserver } from '@angular/cdk/layout';

/**
 * @description Componente principal del panel de control (dashboard).
 * Gestiona la barra lateral, el menú móvil y la sesión del usuario.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgIconsModule, SidebarComponent],
  providers: [provideIcons({ HeroBars3, HeroXMark, HeroUserGroup })],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly signOutUseCase = inject(SignOutUseCase);
  private readonly router = inject(Router);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private breakpointSub!: Subscription;

  /** @description Indica si el menú móvil está abierto */
  isMobileMenuOpen: boolean = false;
  /** @description Indica si la barra lateral está oculta */
  isSidebarHidden: boolean = false;

  /**
   * @description Inicializa el componente y observa los cambios de tamaño de pantalla
   * para ocultar la barra lateral en resoluciones tablet.
   */
  ngOnInit(): void {
    this.breakpointSub = this.breakpointObserver
      .observe(['(min-width: 768px) and (max-width: 1023px)'])
      .subscribe((result) => {
        this.isSidebarHidden = result.matches;
      });
  }

  /**
   * @description Limpia las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    if (this.breakpointSub) {
      this.breakpointSub.unsubscribe();
    }
  }

  /**
   * @description Alterna la visibilidad de la barra lateral.
   */
  toggleSidebar(): void {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  /**
   * @description Alterna la visibilidad del menú móvil.
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
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
      console.error('Error signing out:', err);
      if (err instanceof AppError) {
        err.markAsHandled();
      }
    }
  }
}

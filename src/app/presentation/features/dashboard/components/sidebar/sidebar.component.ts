import {
  Component,
  Output,
  EventEmitter,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from 'src/app/core/services/theme.service';
import { ThemeId } from 'src/app/core/interfaces/theme.interface';

/**
 * @description Componente de barra lateral del dashboard.
 * Muestra la navegación principal, el selector de temas y el botón de cierre de sesión.
 * Se renderiza dentro de un MatSidenav que controla su visibilidad.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  /** @description Evento emitido cuando el usuario solicita cerrar sesión */
  @Output() logout = new EventEmitter<void>();
  /** @description Evento emitido cuando se solicita cerrar el menú móvil */
  @Output() closeMobileMenu = new EventEmitter<void>();

  readonly themeService = inject(ThemeService);

  /** @description Indica si el menú desplegable de temas está visible */
  showThemeDropdown = false;

  /**
   * @description Emite el evento de cierre de sesión.
   */
  onLogout(): void {
    this.logout.emit();
  }

  /**
   * @description Emite el evento para cerrar el menú móvil.
   */
  onCloseMobile(): void {
    this.closeMobileMenu.emit();
  }

  /**
   * @description Cambia el tema de la aplicación y cierra el menú desplegable de temas.
   * @param themeId - Identificador del tema a aplicar
   */
  onThemeChange(themeId: ThemeId): void {
    this.themeService.setTheme(themeId);
    this.showThemeDropdown = false;
  }

  /**
   * @description Alterna la visibilidad del menú desplegable de temas.
   */
  toggleThemeDropdown(): void {
    this.showThemeDropdown = !this.showThemeDropdown;
  }

  /**
   * @description Obtiene el tema activo actual.
   * @returns El tema activo actual
   */
  get activeTheme(): ThemeId {
    return this.themeService.currentTheme;
  }

  /**
   * @description Obtiene la lista de temas disponibles.
   * @returns Array de opciones de tema
   */
  get themes() {
    return this.themeService.themes;
  }
}

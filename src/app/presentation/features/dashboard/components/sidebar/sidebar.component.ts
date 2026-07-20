import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import {
  HeroUsers,
  HeroArrowRightOnRectangle,
  HeroSun,
  HeroMoon,
  HeroStar,
  HeroChevronDown,
} from '@ng-icons/heroicons/outline';
import { ThemeService } from 'src/app/core/services/theme.service';
import { ThemeId } from 'src/app/core/interfaces/theme.interface';

/**
 * @description Componente de barra lateral del dashboard.
 * Muestra la navegación principal, el selector de temas y el botón de cierre de sesión.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgIconsModule],
  providers: [
    provideIcons({
      HeroUsers,
      HeroArrowRightOnRectangle,
      HeroSun,
      HeroMoon,
      HeroStar,
      HeroChevronDown,
    }),
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  /** @description Indica si el menú móvil está abierto */
  @Input() isMobileMenuOpen = false;
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
   * @description Obtiene el nombre del ícono correspondiente al tema activo.
   * @returns Nombre del ícono de Heroicons asociado al tema actual.
   */
  getThemeIcon(): string {
    const theme = this.themeService.currentTheme;
    switch (theme) {
      case 'light': return 'heroSun';
      case 'dark': return 'heroMoon';
      case 'midnight': return 'heroStar';
      default: return 'heroSun';
    }
  }
}

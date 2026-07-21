import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ThemeId, ThemeOption } from '../interfaces/theme.interface';

/**
 * @description Servicio encargado de gestionar el tema visual de la aplicación.
 * Los 4 temas corresponden a los predefinidos de Angular Material:
 * - deeppurple-amber (Light)
 * - indigo-pink (Light)
 * - pink-bluegrey (Dark)
 * - purple-green (Dark)
 *
 * Persiste la preferencia del usuario en localStorage y aplica:
 * 1. La clase CSS del tema Material al <body> (para los colores de Material)
 * 2. La clase CSS de variables específica del tema al <body> (para los colores de Tailwind)
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private static readonly STORAGE_KEY = 'app-theme';

  /** @description Lista de temas disponibles basados en los 4 temas predefinidos de Angular Material */
  readonly themes: ThemeOption[] = [
    {
      id: 'deeppurple-amber',
      label: 'Deep Purple / Amber',
      cssClass: '',
      icon: 'heroPaintBrush',
      varsClass: 'theme-deeppurple-amber-vars',
    },
    {
      id: 'indigo-pink',
      label: 'Indigo / Pink',
      cssClass: 'theme-indigo-pink',
      icon: 'heroPaintBrush',
      varsClass: 'theme-indigo-pink-vars',
    },
    {
      id: 'pink-bluegrey',
      label: 'Pink / Blue-Grey',
      cssClass: 'theme-pink-bluegrey',
      icon: 'heroPaintBrush',
      varsClass: 'theme-pink-bluegrey-vars',
    },
    {
      id: 'purple-green',
      label: 'Purple / Green',
      cssClass: 'theme-purple-green',
      icon: 'heroPaintBrush',
      varsClass: 'theme-purple-green-vars',
    },
  ];

  private readonly document = inject(DOCUMENT);
  private readonly currentThemeSubject = new BehaviorSubject<ThemeId>(
    this.loadSavedTheme(),
  );

  /** @description Observable del tema activo */
  readonly currentTheme$ = this.currentThemeSubject.asObservable();

  /** @description Valor actual del tema activo */
  get currentTheme(): ThemeId {
    return this.currentThemeSubject.value;
  }

  constructor() {
    const savedTheme = this.loadSavedTheme();
    this.applyTheme(savedTheme);
  }

  /**
   * @description Cambia el tema activo y persiste la preferencia.
   * @param themeId - Identificador del tema a aplicar
   */
  setTheme(themeId: ThemeId): void {
    this.applyTheme(themeId);
    this.currentThemeSubject.next(themeId);
    this.saveTheme(themeId);
  }

  /**
   * @description Obtiene la lista de temas disponibles.
   * @returns Array de opciones de tema
   */
  getThemes(): ThemeOption[] {
    return this.themes;
  }

  /**
   * @description Limpia todas las clases de tema del body y aplica las clases del tema seleccionado.
   * @param themeId - Identificador del tema a aplicar
   */
  private applyTheme(themeId: ThemeId): void {
    const body = this.document.body;

    // Remover TODAS las clases de tema Material
    const allMaterialClasses = [
      'theme-indigo-pink',
      'theme-pink-bluegrey',
      'theme-purple-green',
    ];
    body.classList.remove(...allMaterialClasses);

    // Remover TODAS las clases de variables CSS
    const allVarsClasses = [
      'theme-deeppurple-amber-vars',
      'theme-indigo-pink-vars',
      'theme-pink-bluegrey-vars',
      'theme-purple-green-vars',
    ];
    body.classList.remove(...allVarsClasses);

    const option = this.themes.find((t) => t.id === themeId);
    if (option) {
      // Aplicar clase del tema Material
      if (option.cssClass) {
        body.classList.add(option.cssClass);
      }
      // Aplicar clase de variables CSS para Tailwind
      body.classList.add(option.varsClass);
    }
  }

  private loadSavedTheme(): ThemeId {
    const saved = localStorage.getItem(ThemeService.STORAGE_KEY);
    if (saved && this.themes.some((t) => t.id === saved)) {
      return saved as ThemeId;
    }
    return 'deeppurple-amber';
  }

  private saveTheme(themeId: ThemeId): void {
    localStorage.setItem(ThemeService.STORAGE_KEY, themeId);
  }
}

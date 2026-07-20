import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ThemeId, ThemeOption } from '../interfaces/theme.interface';

/**
 * @description Servicio encargado de gestionar el tema visual de la aplicación.
 * Persiste la preferencia del usuario en localStorage y aplica el atributo
 * `data-theme` al elemento raíz del documento.
 *
 * @example
 * ```ts
 * const themeService = inject(ThemeService);
 * themeService.setTheme('dark');
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private static readonly STORAGE_KEY = 'app-theme';

  /** @description Lista de temas disponibles */
  readonly themes: ThemeOption[] = [
    { id: 'light', labelKey: 'theme.light', dataTheme: 'light' },
    { id: 'dark', labelKey: 'theme.dark', dataTheme: 'dark' },
    { id: 'midnight', labelKey: 'theme.midnight', dataTheme: 'midnight' },
  ];

  private readonly document = inject(DOCUMENT);
  private readonly currentThemeSubject = new BehaviorSubject<ThemeId>(
    this.loadSavedTheme()
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

  private applyTheme(themeId: ThemeId): void {
    const option = this.themes.find((t) => t.id === themeId);
    if (option) {
      this.document.documentElement.setAttribute('data-theme', option.dataTheme);
    }
  }

  private loadSavedTheme(): ThemeId {
    const saved = localStorage.getItem(ThemeService.STORAGE_KEY);
    if (saved && this.themes.some((t) => t.id === saved)) {
      return saved as ThemeId;
    }
    return 'light';
  }

  private saveTheme(themeId: ThemeId): void {
    localStorage.setItem(ThemeService.STORAGE_KEY, themeId);
  }
}

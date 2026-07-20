/**
 * @description Identificadores de temas disponibles en la aplicación.
 */
export type ThemeId = 'light' | 'dark' | 'midnight';

/**
 * @description Metadatos de un tema para mostrar en la UI.
 */
export interface ThemeOption {
  /** Identificador único del tema */
  id: ThemeId;
  /** Etiqueta traducible del tema */
  labelKey: string;
  /** Valor del atributo data-theme aplicado al DOM */
  dataTheme: string;
}

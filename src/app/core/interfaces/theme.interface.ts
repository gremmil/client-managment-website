/**
 * @description Identificadores de temas disponibles en la aplicación.
 * Corresponde a los 4 temas predefinidos de Angular Material.
 */
export type ThemeId =
  | 'deeppurple-amber'
  | 'indigo-pink'
  | 'pink-bluegrey'
  | 'purple-green';

/**
 * @description Metadatos de un tema para mostrar en la UI.
 */
export interface ThemeOption {
  /** Identificador único del tema */
  id: ThemeId;
  /** Nombre visible del tema */
  label: string;
  /** Clase CSS que se aplica al contenedor raíz para activar el tema Material */
  cssClass: string;
  /** Icono representativo del tema */
  icon: string;
  /** Clase CSS para las variables de Tailwind (theme-vars-light o theme-vars-dark) */
  varsClass: string;
}

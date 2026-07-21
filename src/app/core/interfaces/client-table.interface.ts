/**
 * @description Filtros aplicables a la tabla de clientes.
 */
export interface TableFilters {
  /** Filtro de texto para el nombre */
  name: string;
  /** Filtro de texto para el apellido */
  lastname: string;
  /** Edad mínima del rango */
  ageMin: number | null;
  /** Edad máxima del rango */
  ageMax: number | null;
  /** Fecha de inicio del rango de nacimiento */
  birthDateStart: Date | null;
  /** Fecha de fin del rango de nacimiento */
  birthDateEnd: Date | null;
}

/**
 * @description Métricas calculadas sobre el conjunto de clientes.
 */
export interface Metrics {
  /** Total de clientes (filtrados o totales) */
  total: number;
  /** Edad promedio */
  averageAge: number;
  /** Desviación estándar de las edades */
  standardDeviation: number;
}

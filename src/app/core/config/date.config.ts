import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter } from '../adapters/custom-date.adapter';

/**
 * @description Configuración de formatos de fecha para los componentes de Angular Material.
 * Define el formato de entrada y visualización como DD/MM/YYYY.
 */
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

/**
 * @description Array de providers para configurar el adaptador de fechas, los formatos
 * y la localización regional (es-ES) en los componentes de Angular Material.
 */
export const DATE_PROVIDERS = [
  { provide: DateAdapter, useClass: CustomDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
];

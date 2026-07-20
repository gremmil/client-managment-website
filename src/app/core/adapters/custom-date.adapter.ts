import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

/**
 * @description Adaptador personalizado de fechas para Angular Material.
 * Formatea y parsea fechas en formato `DD/MM/YYYY`.
 */
@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  /**
   * @description Formatea una fecha al formato `DD/MM/YYYY`.
   * @param date - Fecha a formatear
   * @param displayFormat - Formato de visualización (no utilizado, se usa formato fijo)
   * @returns Cadena con la fecha formateada en `DD/MM/YYYY`
   */
  override format(date: Date, displayFormat: Object): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${this._padZero(day)}/${this._padZero(month)}/${year}`;
  }

  /**
   * @description Convierte un valor en un objeto `Date`.
   * Si el valor es una cadena con formato `DD/MM/YYYY`, la parsea correctamente.
   * @param value - Valor a convertir (cadena, número o fecha)
   * @returns Objeto `Date` resultante, o `null` si el valor no es válido
   */
  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.indexOf('/') > -1) {
      const str = value.split('/');
      if (str.length === 3) {
        const date = Number(str[0]);
        const month = Number(str[1]) - 1;
        const year = Number(str[2]);
        return new Date(year, month, date);
      }
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  private _padZero(n: number): string {
    const s = String(n);
    return s.length < 2 ? '0' + s : s;
  }
}

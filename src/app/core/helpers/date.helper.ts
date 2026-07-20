/**
 * @description Formatea un objeto Date a una cadena en formato ISO (YYYY-MM-DD).
 * @param date - El objeto Date que se desea formatear.
 * @returns Una cadena con la fecha en formato ISO (YYYY-MM-DD).
 */
export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

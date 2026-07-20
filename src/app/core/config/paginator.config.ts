import { MatPaginatorIntl } from '@angular/material/paginator';

const spanishRangeLabel = (page: number, pageSize: number, length: number): string => {
  if (length === 0 || pageSize === 0) {
    return `0 de ${length}`;
  }
  length = Math.max(length, 0);
  const startIndex = page * pageSize;
  const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
  return `${startIndex + 1} - ${endIndex} de ${length}`;
};

/**
 * @description Crea y devuelve una instancia de MatPaginatorIntl con todas las etiquetas
 * traducidas al español, incluyendo el formato de rango personalizado.
 * @returns Instancia configurada de MatPaginatorIntl en español
 */
export function getSpanishPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Elementos por página:';
  paginatorIntl.nextPageLabel = 'Página siguiente';
  paginatorIntl.previousPageLabel = 'Página anterior';
  paginatorIntl.firstPageLabel = 'Primera página';
  paginatorIntl.lastPageLabel = 'Última página';
  paginatorIntl.getRangeLabel = spanishRangeLabel;

  return paginatorIntl;
}

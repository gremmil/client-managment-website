import { Client } from 'src/app/domain/models/client.model';
import { TableFilters } from 'src/app/core/interfaces/client-table.interface';

/**
 * @description Filtra una lista de clientes según los criterios especificados en los filtros de tabla.
 * @param clients - Array de clientes a filtrar.
 * @param filters - Objeto con los criterios de filtrado (nombre, apellido, edad mínima/máxima, rango de fechas de nacimiento).
 * @returns Un nuevo array de clientes que cumplen con los filtros aplicados.
 */
export function filterClients(
  clients: Client[],
  filters: TableFilters,
): Client[] {
  let result = [...clients];

  if (filters.name.trim()) {
    const search = filters.name.toLowerCase();
    result = result.filter((client) =>
      client.name?.toLowerCase().includes(search),
    );
  }

  if (filters.lastname.trim()) {
    const search = filters.lastname.toLowerCase();
    result = result.filter((client) =>
      client.lastname?.toLowerCase().includes(search),
    );
  }

  if (filters.ageMin !== null) {
    result = result.filter((client) => client.age >= filters.ageMin!);
  }

  if (filters.ageMax !== null) {
    result = result.filter((client) => client.age <= filters.ageMax!);
  }

  if (filters.birthDateStart && filters.birthDateStart.trim()) {
    result = result.filter(
      (client) =>
        client.birthDate && client.birthDate >= filters.birthDateStart!,
    );
  }

  if (filters.birthDateEnd && filters.birthDateEnd.trim()) {
    result = result.filter(
      (client) => client.birthDate && client.birthDate <= filters.birthDateEnd!,
    );
  }

  return result;
}

/**
 * @description Ordena una lista de clientes por una propiedad específica en orden ascendente o descendente.
 * @param clients - Array de clientes a ordenar.
 * @param sortBy - Propiedad del cliente por la cual ordenar. Si es una cadena vacía, se retorna la lista sin cambios.
 * @param isAscending - Indica si el ordenamiento es ascendente (true) o descendente (false).
 * @returns Un nuevo array de clientes ordenado según la propiedad y dirección indicadas.
 */
export function sortClients(
  clients: Client[],
  sortBy: keyof Client | '',
  isAscending: boolean,
): Client[] {
  if (!sortBy) return clients;

  const normalizeValue = (value: unknown): string | number | Date | null => {
    if (value === undefined || value === null) return null;
    if (typeof value === 'number') return value;
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      const numberValue = Number(trimmed);
      if (!Number.isNaN(numberValue) && trimmed !== '') return numberValue;

      const dateValue = new Date(trimmed);
      if (!Number.isNaN(dateValue.valueOf())) return dateValue;

      return trimmed.toLowerCase();
    }

    return String(value).toLowerCase();
  };

  const compareValues = (
    a: string | number | Date | null,
    b: string | number | Date | null,
  ): number => {
    if (a === null && b === null) return 0;
    if (a === null) return 1;
    if (b === null) return -1;

    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }

    if (a instanceof Date && b instanceof Date) {
      return a.valueOf() - b.valueOf();
    }

    const normalizedA = String(a).toLowerCase();
    const normalizedB = String(b).toLowerCase();

    if (normalizedA < normalizedB) return -1;
    if (normalizedA > normalizedB) return 1;
    return 0;
  };

  return [...clients].sort((a, b) => {
    const valA = normalizeValue(a[sortBy]);
    const valB = normalizeValue(b[sortBy]);
    const comparison = compareValues(valA, valB);
    return isAscending ? comparison : -comparison;
  });
}

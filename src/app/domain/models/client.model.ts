import { ValidationError } from 'src/app/core/errors/app-error';

/**
 * @description Representa un cliente en el sistema.
 */
export interface Client {
  /** @description Identificador único del cliente */
  id?: string;
  /** @description Nombre del cliente */
  name: string;
  /** @description Apellido del cliente */
  lastname: string;
  /** @description Edad del cliente */
  age: number;
  /** @description Fecha de nacimiento del cliente en formato de cadena */
  birthDate: string;
  /** @description Fecha de creación del registro */
  createdAt?: string;
  /** @description Fecha de última actualización del registro */
  updatedAt?: string;
}

/**
 * @description Payload necesario para crear un nuevo cliente.
 */
export interface CreateClientPayload {
  /** @description Nombre del cliente */
  name: string;
  /** @description Apellido del cliente */
  lastname: string;
  /** @description Edad del cliente */
  age: number;
  /** @description Fecha de nacimiento del cliente en formato de cadena */
  birthDate: string;
}

/**
 * @description Valida los datos de un payload de creación de cliente.
 * Lanza un error ValidationError si algún campo no cumple con las reglas de negocio.
 * @param payload - Datos del cliente a validar
 * @returns void si la validación es exitosa
 * @throws ValidationError si algún campo es inválido
 */
export function validateClient(payload: CreateClientPayload): void {
  if (!payload.name || !payload.name.trim()) {
    throw new ValidationError('name', 'First name is required.');
  }

  if (!payload.lastname || !payload.lastname.trim()) {
    throw new ValidationError('lastname', 'Last name is required.');
  }

  if (typeof payload.age !== 'number' || isNaN(payload.age)) {
    throw new ValidationError('age', 'Age must be a valid number.');
  }

  if (payload.age < 18) {
    throw new ValidationError('age', 'Client must be at least 18 years old.');
  }

  if (payload.age > 150) {
    throw new ValidationError('age', 'Age is not realistic.');
  }

  if (!payload.birthDate || !payload.birthDate.trim()) {
    throw new ValidationError('birthDate', 'Birth date is required.');
  }

  const birthDate = new Date(payload.birthDate);
  if (isNaN(birthDate.getTime())) {
    throw new ValidationError('birthDate', 'Birth date is not a valid date.');
  }

  const today = new Date();
  let calculatedAge = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    calculatedAge--;
  }

  if (calculatedAge !== payload.age) {
    throw new ValidationError('birthDate', 'Age does not match the birth date.');
  }

  if (birthDate > today) {
    throw new ValidationError('birthDate', 'Birth date cannot be in the future.');
  }
}

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
  birthDate: Date;
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
  birthDate: Date;
}

/**
 * @description Objeto de transferencia de datos (DTO) que representa un cliente
 * en la capa de datos. Se utiliza para la comunicación con Firestore.
 */
export interface ClientDTO {
  /** @description Identificador único del cliente (generado por Firestore) */
  id?: string;
  /** @description Nombre del cliente */
  name: string;
  /** @description Apellido del cliente */
  lastname: string;
  /** @description Edad del cliente */
  age: number;
  /** @description Fecha de nacimiento del cliente en formato ISO */
  birthDate: string;
  /** @description Fecha de creación del registro en formato ISO */
  createdAt?: string;
  /** @description Fecha de última actualización del registro en formato ISO */
  updatedAt?: string;
}

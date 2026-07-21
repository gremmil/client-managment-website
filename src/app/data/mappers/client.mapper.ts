import {
  Client,
  CreateClientPayload,
} from 'src/app/domain/models/client.model';
import { ClientDTO } from 'src/app/data/dtos/client.dto';
import { formatDateToISO } from 'src/app/core/helpers';

/**
 * @description Convierte un DTO de cliente proveniente de Firestore a una entidad
 * de dominio {@link Client}.
 * @param dto - Objeto de transferencia de datos del cliente
 * @returns Entidad de dominio del cliente mapeada
 */
export function clientDTOToDomain(dto: ClientDTO): Client {
  return {
    id: dto.id,
    name: dto.name,
    lastname: dto.lastname,
    age: dto.age,
    birthDate: new Date(dto.birthDate),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

/**
 * @description Convierte una entidad de dominio {@link Client} a un DTO de cliente
 * para su persistencia en Firestore.
 * @param client - Entidad de dominio del cliente
 * @returns Objeto de transferencia de datos del cliente mapeado
 */
export function clientDomainToDTO(client: Client): ClientDTO {
  return {
    id: client.id,
    name: client.name,
    lastname: client.lastname,
    age: client.age,
    birthDate: formatDateToISO(client.birthDate),
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
  };
}

/**
 * @description Convierte un payload de creación de cliente en un DTO parcial,
 * excluyendo los campos `id`, `createdAt` y `updatedAt` que se generan automáticamente.
 * @param payload - Datos del nuevo cliente a crear
 * @returns DTO parcial sin los campos generados por el sistema
 */
export function createPayloadToDTO(
  payload: CreateClientPayload,
): Omit<ClientDTO, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name: payload.name.trim(),
    lastname: payload.lastname.trim(),
    age: payload.age,
    birthDate: formatDateToISO(payload.birthDate),
  };
}

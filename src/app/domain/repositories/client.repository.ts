import { Observable } from 'rxjs';
import { Client, CreateClientPayload } from 'src/app/domain/models/client.model';

/**
 * @description Repositorio abstracto que define las operaciones de persistencia
 * para la entidad Client. Las implementaciones concretas deben proporcionar
 * la lógica de acceso a datos.
 */
export abstract class ClientRepository {
  /**
   * @description Obtiene todos los clientes registrados.
   * @returns Observable con un array de clientes
   */
  abstract getAll(): Observable<Client[]>;

  /**
   * @description Crea un nuevo cliente en el sistema.
   * @param payload - Datos necesarios para crear el cliente
   * @returns Observable con el cliente creado
   */
  abstract create(payload: CreateClientPayload): Observable<Client>;

  /**
   * @description Actualiza un cliente existente.
   * @param id - Identificador único del cliente a actualizar
   * @param changes - Objeto con los campos a modificar
   * @returns Observable que se completa cuando la actualización finaliza
   */
  abstract update(id: string, changes: Partial<Client>): Observable<void>;
}

import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  CollectionReference,
  query,
  orderBy,
  doc,
  updateDoc,
  DocumentReference,
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { ClientRepository } from 'src/app/domain/repositories/client.repository';
import {
  Client,
  CreateClientPayload,
} from 'src/app/domain/models/client.model';
import { ClientDTO } from 'src/app/data/dtos/client.dto';
import {
  clientDTOToDomain,
  createPayloadToDTO,
} from 'src/app/data/mappers/client.mapper';
import { handleErrors } from 'src/app/core/errors';

/**
 * @description Implementación del repositorio de clientes basada en Firestore.
 * Gestiona las operaciones CRUD de la colección `clients` en la base de datos.
 */
@Injectable()
export class FirestoreClientRepository extends ClientRepository {
  private readonly firestore = inject(Firestore);

  private readonly clientsCollection = collection(
    this.firestore,
    'clients',
  ) as CollectionReference<ClientDTO>;

  /**
   * @description Obtiene todos los clientes ordenados por fecha de creación descendente.
   * @returns Observable que emite un array de entidades de dominio {@link Client}
   */
  getAll(): Observable<Client[]> {
    const q = query(this.clientsCollection, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }).pipe(
      handleErrors(),
      map((dtos: ClientDTO[]) => dtos.map(clientDTOToDomain)),
    );
  }

  /**
   * @description Crea un nuevo cliente en Firestore con la marca de tiempo de creación.
   * @param payload - Datos del nuevo cliente a crear
   * @returns Observable que emite la entidad de dominio del cliente creado con su ID asignado
   */
  create(payload: CreateClientPayload): Observable<Client> {
    const dto = createPayloadToDTO(payload);
    const clientWithTimestamp = {
      ...dto,
      createdAt: new Date().toISOString(),
    };
    return from(
      addDoc(this.clientsCollection, clientWithTimestamp) as Promise<
        DocumentReference<ClientDTO>
      >,
    ).pipe(
      handleErrors(),
      map((docRef) => {
        const newClient: Client = clientDTOToDomain({
          ...dto,
          id: docRef.id,
          createdAt: clientWithTimestamp.createdAt,
        });
        return newClient;
      }),
    );
  }

  /**
   * @description Actualiza parcialmente un cliente existente en Firestore y registra
   * la fecha de última modificación.
   * @param id - Identificador único del cliente a actualizar
   * @param changes - Objeto con los campos del cliente que se desean modificar
   * @returns Observable que se completa cuando la actualización finaliza
   */
  update(id: string, changes: Partial<Client>): Observable<void> {
    const ref = doc(this.clientsCollection, id);
    const payload: Partial<ClientDTO> = {
      ...changes,
      birthDate:
        changes.birthDate instanceof Date
          ? changes.birthDate.toISOString()
          : changes.birthDate,
      updatedAt: new Date().toISOString(),
    };
    return from(updateDoc(ref, payload) as Promise<void>).pipe(handleErrors());
  }
}

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientRepository } from 'src/app/domain/repositories/client.repository';
import { Client, CreateClientPayload, validateClient } from 'src/app/domain/models/client.model';
import { CLIENT_REPOSITORY } from 'src/app/core/tokens/repository.tokens';

/**
 * @description Caso de uso encargado de crear un nuevo cliente.
 * Valida los datos del payload antes de delegar la persistencia al repositorio.
 */
@Injectable({ providedIn: 'root' })
export class CreateClientUseCase {
  private readonly clientRepository = inject<ClientRepository>(CLIENT_REPOSITORY);

  /**
   * @description Ejecuta la creación de un nuevo cliente.
   * @param payload - Datos del cliente a crear
   * @returns Observable con el cliente creado
   * @throws ValidationError si los datos del payload no son válidos
   */
  execute(payload: CreateClientPayload): Observable<Client> {
    validateClient(payload);
    return this.clientRepository.create(payload);
  }
}

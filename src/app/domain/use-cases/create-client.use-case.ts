import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientRepository } from 'src/app/domain/repositories/client.repository';
import { Client, CreateClientPayload } from 'src/app/domain/models/client.model';
import { CLIENT_REPOSITORY } from 'src/app/core/tokens/repository.tokens';

/**
 * @description Caso de uso encargado de crear un nuevo cliente.
 * Delega la persistencia al repositorio.
 */
@Injectable({ providedIn: 'root' })
export class CreateClientUseCase {
  private readonly clientRepository = inject<ClientRepository>(CLIENT_REPOSITORY);

  /**
   * @description Ejecuta la creación de un nuevo cliente.
   * @param payload - Datos del cliente a crear
   * @returns Observable con el cliente creado
   */
  execute(payload: CreateClientPayload): Observable<Client> {
    return this.clientRepository.create(payload);
  }
}

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientRepository } from 'src/app/domain/repositories/client.repository';
import { Client } from 'src/app/domain/models/client.model';
import { CLIENT_REPOSITORY } from 'src/app/core/tokens/repository.tokens';

/**
 * @description Caso de uso encargado de obtener la lista completa de clientes registrados.
 */
@Injectable({ providedIn: 'root' })
export class GetClientsUseCase {
  private readonly clientRepository = inject<ClientRepository>(CLIENT_REPOSITORY);

  /**
   * @description Ejecuta la obtención de todos los clientes.
   * @returns Observable con un array de clientes
   */
  execute(): Observable<Client[]> {
    return this.clientRepository.getAll();
  }
}

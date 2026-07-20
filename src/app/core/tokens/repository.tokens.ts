import { InjectionToken } from '@angular/core';
import { ClientRepository } from 'src/app/domain/repositories/client.repository';
import { AuthRepository } from 'src/app/domain/repositories/auth.repository';

/** @description Token de inyección para el repositorio de clientes */
export const CLIENT_REPOSITORY = new InjectionToken<ClientRepository>('ClientRepository');

/** @description Token de inyección para el repositorio de autenticación */
export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AuthRepository');

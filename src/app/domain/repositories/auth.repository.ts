import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

/**
 * @description Representa un usuario autenticado en el sistema.
 */
export interface AuthUser {
  /** @description Identificador único del usuario */
  uid: string;
  /** @description Correo electrónico del usuario, o null si no está disponible */
  email: string | null;
}

/**
 * @description Repositorio abstracto que define las operaciones de autenticación.
 * Las implementaciones concretas deben proporcionar la lógica de autenticación
 * contra el proveedor correspondiente.
 */
export abstract class AuthRepository {
  /**
   * @description Observable que emite el usuario autenticado actual, o null si no hay sesión activa.
   */
  abstract get currentUser$(): Observable<User | null>;

  /**
   * @description Inicia sesión con correo electrónico y contraseña.
   * @param email - Correo electrónico del usuario
   * @param password - Contraseña del usuario
   * @returns Observable con el usuario autenticado
   */
  abstract signIn(email: string, password: string): Observable<AuthUser>;

  /**
   * @description Registra un nuevo usuario con correo electrónico y contraseña.
   * @param email - Correo electrónico del nuevo usuario
   * @param password - Contraseña del nuevo usuario
   * @returns Observable con el usuario registrado
   */
  abstract signUp(email: string, password: string): Observable<AuthUser>;

  /**
   * @description Cierra la sesión del usuario autenticado.
   * @returns Observable que se completa cuando el cierre de sesión finaliza
   */
  abstract signOut(): Observable<void>;
}

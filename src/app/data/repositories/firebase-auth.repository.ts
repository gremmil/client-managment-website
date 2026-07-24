import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  user,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { Observable, from, map } from 'rxjs';
import { AuthRepository, AuthUser } from 'src/app/domain/repositories/auth.repository';
import { handleErrors } from 'src/app/core/errors';

/**
 * @description Implementación del repositorio de autenticación basada en Firebase Auth.
 * Gestiona el inicio de sesión, registro, cierre de sesión y el estado del usuario actual.
 */
@Injectable()
export class FirebaseAuthRepository extends AuthRepository {
  private readonly auth = inject(Auth);

  /**
   * @description Observable que emite el usuario autenticado actual o `null` si no hay sesión activa.
   * @returns Observable del usuario de Firebase o null
   */
  get currentUser$(): Observable<User | null> {
    return user(this.auth);
  }

  /**
   * @description Inicia sesión con correo electrónico y contraseña.
   * @param email - Correo electrónico del usuario
   * @param password - Contraseña del usuario
   * @returns Observable que emite el usuario autenticado mapeado a {@link AuthUser}
   */
  signIn(email: string, password: string): Observable<AuthUser> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      handleErrors(5000),
      map((credential: UserCredential) => this.mapToAuthUser(credential.user)),
    );
  }

  /**
   * @description Registra un nuevo usuario con correo electrónico y contraseña.
   * @param email - Correo electrónico del nuevo usuario
   * @param password - Contraseña del nuevo usuario
   * @returns Observable que emite el usuario registrado mapeado a {@link AuthUser}
   */
  signUp(email: string, password: string): Observable<AuthUser> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      handleErrors(5000),
      map((credential: UserCredential) => this.mapToAuthUser(credential.user)),
    );
  }

  /**
   * @description Cierra la sesión del usuario autenticado actual.
   * @returns Observable que se completa cuando el cierre de sesión finaliza
   */
  signOut(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      handleErrors(5000),
    );
  }

  private mapToAuthUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
    };
  }
}

import { mapFirebaseError } from './firebase-error.mapper';
import { AppError, AuthError, FirestoreError, NetworkError } from './app-error';

describe('mapFirebaseError', () => {
  it('should map auth/invalid-credential to AuthError with user-friendly message', () => {
    const error = { code: 'auth/invalid-credential', message: 'raw message' };
    const result = mapFirebaseError(error);

    expect(result).toBeInstanceOf(AuthError);
    expect(result.code).toBe('auth/invalid-credential');
    expect(result.message).toBe('Correo o contraseña incorrectos.');
  });

  it('should map auth/user-not-found to AuthError with generic message', () => {
    const error = { code: 'auth/user-not-found', message: 'raw' };
    const result = mapFirebaseError(error);

    expect(result).toBeInstanceOf(AuthError);
    expect(result.message).toBe('Correo o contraseña incorrectos.');
  });

  it('should map auth/too-many-requests to AuthError', () => {
    const error = { code: 'auth/too-many-requests' };
    const result = mapFirebaseError(error);

    expect(result).toBeInstanceOf(AuthError);
    expect(result.message).toBe('Demasiados intentos. Intenta de nuevo más tarde.');
  });

  it('should map auth/network-request-failed to AuthError', () => {
    const error = { code: 'auth/network-request-failed' };
    const result = mapFirebaseError(error);

    expect(result).toBeInstanceOf(AuthError);
    expect(result.message).toBe('Error de red. Verifica tu conexión.');
  });

  it('should map unknown auth codes to AuthError with raw message', () => {
    const error = { code: 'auth/some-unknown-code', message: 'Some auth error' };
    const result = mapFirebaseError(error);

    expect(result).toBeInstanceOf(AuthError);
    expect(result.message).toBe('Some auth error');
  });

  it('should map firestore/permission-denied to FirestoreError', () => {
    const error = { code: 'firestore/permission-denied' };
    const result = mapFirebaseError(error);

    expect(result).toBeInstanceOf(FirestoreError);
    expect(result.message).toBe('No tienes permiso para acceder a estos datos.');
  });

  it('should map firestore/unavailable to FirestoreError', () => {
    const error = { code: 'firestore/unavailable' };
    const result = mapFirebaseError(error);

    expect(result).toBeInstanceOf(FirestoreError);
    expect(result.message).toBe('El servicio de base de datos no está disponible temporalmente.');
  });

  it('should map TimeoutError to NetworkError', () => {
    const error = new Error('timeout');
    error.name = 'TimeoutError';
    const result = mapFirebaseError(error);

    expect(result).toBeInstanceOf(NetworkError);
    expect(result.code).toBe('network/timeout');
  });

  it('should map unknown errors to AppError', () => {
    const error = new Error('something weird');
    const result = mapFirebaseError(error);

    expect(result).toBeInstanceOf(AppError);
    expect(result.code).toBe('unknown');
    expect(result.message).toBe('Ocurrió un error inesperado.');
  });

  it('should handle null/undefined errors', () => {
    const result = mapFirebaseError(null);

    expect(result).toBeInstanceOf(AppError);
    expect(result.code).toBe('unknown');
  });
});

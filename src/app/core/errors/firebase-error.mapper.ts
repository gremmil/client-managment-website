import { AppError, AuthError, FirestoreError, NetworkError } from './app-error';

/**
 * @description Mapea un error desconocido (típicamente de Firebase) a una
 * instancia de AppError con código y mensaje legibles.
 * @param error - Error original a mapear
 * @returns Instancia de AppError (AuthError, FirestoreError, NetworkError o AppError genérico)
 */
export function mapFirebaseError(error: unknown): AppError {
  const fbError = error as { code?: unknown; message?: string };

  if (typeof fbError.code === 'string' && fbError.code.startsWith('auth/')) {
    return mapAuthError(fbError as { code: string; message?: string });
  }

  if (typeof fbError.code === 'string' && fbError.code.startsWith('firestore/')) {
    return mapFirestoreError(fbError as { code: string; message?: string });
  }

  if (error instanceof Error && error.name === 'TimeoutError') {
    return new NetworkError(error);
  }

  return new AppError('unknown', 'Ocurrió un error inesperado.', error);
}

function mapAuthError(error: { code: string; message?: string }): AuthError {
  const messages: Record<string, string> = {
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/invalid-login-credentials': 'Correo o contraseña incorrectos.',
    'auth/user-not-found': 'Correo o contraseña incorrectos.',
    'auth/wrong-password': 'Correo o contraseña incorrectos.',
    'auth/too-many-requests': 'Demasiados intentos. Intenta de nuevo más tarde.',
    'auth/network-request-failed': 'Error de red. Verifica tu conexión.',
    'auth/timeout':
      'El servidor tardó demasiado en responder. Verifica tu conexión a internet.',
  };
  return new AuthError(
    error.code,
    messages[error.code] ?? error.message ?? 'Error de autenticación.',
    error,
  );
}

function mapFirestoreError(error: {
  code: string;
  message?: string;
}): FirestoreError {
  const messages: Record<string, string> = {
    'firestore/permission-denied':
      'No tienes permiso para acceder a estos datos.',
    'firestore/unavailable': 'El servicio de base de datos no está disponible temporalmente.',
    'firestore/not-found': 'Los datos solicitados no se encontraron.',
  };
  return new FirestoreError(
    error.code,
    messages[error.code] ?? error.message ?? 'Error de base de datos.',
    error,
  );
}

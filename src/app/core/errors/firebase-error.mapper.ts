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

  return new AppError('unknown', 'An unexpected error occurred.', error);
}

function mapAuthError(error: { code: string; message?: string }): AuthError {
  const messages: Record<string, string> = {
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/invalid-login-credentials': 'Invalid email or password.',
    'auth/user-not-found': 'Invalid email or password.',
    'auth/wrong-password': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/timeout':
      'The server took too long to respond. Please check your internet connection.',
  };
  return new AuthError(
    error.code,
    messages[error.code] ?? error.message ?? 'Auth error.',
    error,
  );
}

function mapFirestoreError(error: {
  code: string;
  message?: string;
}): FirestoreError {
  const messages: Record<string, string> = {
    'firestore/permission-denied':
      'You do not have permission to access this data.',
    'firestore/unavailable': 'Firestore service is temporarily unavailable.',
    'firestore/not-found': 'The requested data was not found.',
  };
  return new FirestoreError(
    error.code,
    messages[error.code] ?? error.message ?? 'Firestore error.',
    error,
  );
}

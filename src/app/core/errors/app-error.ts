/**
 * @description Clase base de errores de la aplicación. Extiende Error nativo
 * con un código identificativo y soporte de rastreo de manejo.
 */
export class AppError extends Error {
  /** @description Causa original del error, si existe */
  public override readonly cause?: unknown;
  private _handled = false;

  /**
   * @param code - Código único que identifica el tipo de error
   * @param message - Mensaje descriptivo del error
   * @param cause - Causa original del error, si existe
   */
  constructor(
    public readonly code: string,
    message: string,
    cause?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
    this.cause = cause;
  }

  /**
   * @description Indica si el error ya fue gestionado por algún handler.
   * @returns true si el error fue marcado como manejado
   */
  get handled(): boolean {
    return this._handled;
  }

  /**
   * @description Marca el error como ya gestionado para evitar manejo duplicado.
   * @returns La propia instancia del error para encadenamiento
   */
  markAsHandled(): this {
    this._handled = true;
    return this;
  }
}

/**
 * @description Error específico de autenticación (Firebase Auth).
 */
export class AuthError extends AppError {
  constructor(code: string, message: string, cause?: unknown) {
    super(code, message, cause);
    this.name = 'AuthError';
  }
}

/**
 * @description Error de red o timeout de conexión.
 */
export class NetworkError extends AppError {
  constructor(cause?: unknown) {
    super('network/timeout', 'Connection timeout. Check your internet.', cause);
    this.name = 'NetworkError';
  }
}

/**
 * @description Error específico de operaciones con Firestore.
 */
export class FirestoreError extends AppError {
  constructor(code: string, message: string, cause?: unknown) {
    super(code, message, cause);
    this.name = 'FirestoreError';
  }
}

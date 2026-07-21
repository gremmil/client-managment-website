import {
  EnvironmentProviders,
  ErrorHandler,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { routes } from './app.routes';
import { firebaseProviders } from './core/config/firebase.config';
import { GlobalErrorHandler } from './core/errors';
import {
  CLIENT_REPOSITORY,
  AUTH_REPOSITORY,
} from './core/tokens/repository.tokens';
import { FirestoreClientRepository } from './data/repositories/firestore-client.repository';
import { FirebaseAuthRepository } from './data/repositories/firebase-auth.repository';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { DATE_PROVIDERS } from './core/config/date.config';

/**
 * @description Configuración global de la aplicación.
 * Registra el enrutador, las animaciones, los proveedores de Firebase,
 * los módulos de Angular Material, el manejador global de errores,
 * los repositorios de datos y la configuración de fechas y paginación.
 *
 * @returns Objeto de configuración con los proveedores de la aplicación.
 */
export const appConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(...firebaseProviders),
    importProvidersFrom(
      MatSnackBarModule,
      MatDialogModule,
      MatNativeDateModule,
    ),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: CLIENT_REPOSITORY, useClass: FirestoreClientRepository },
    { provide: AUTH_REPOSITORY, useClass: FirebaseAuthRepository },
    ...DATE_PROVIDERS,
  ],
};

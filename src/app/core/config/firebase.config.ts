import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

/**
 * @description Array de providers de Angular para la inicialización de Firebase.
 * Configura la aplicación Firebase, el servicio de autenticación y Firestore
 * utilizando las variables de entorno definidas en `environment`.
 */
export const firebaseProviders = [
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideAuth(() => getAuth()),
  provideFirestore(() => getFirestore()),
];

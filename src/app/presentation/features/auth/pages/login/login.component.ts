import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SignInUseCase } from 'src/app/domain/use-cases/sign-in.use-case';
import { AppError } from 'src/app/core/errors';
import { LoadingService } from 'src/app/core/services/loading.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * @description Componente encargado de gestionar el inicio de sesión del usuario.
 * Presenta un formulario de autenticación y maneja los errores de credenciales.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly signInUseCase = inject(SignInUseCase);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly loadingService = inject(LoadingService);
  private readonly fb = inject(FormBuilder);

  /** @description Formulario reactivo de inicio de sesión con validaciones de email y contraseña */
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  /** @description Mensaje de error que se muestra al usuario cuando falla la autenticación */
  errorMessage: string | null = null;
  /** @description Año actual utilizado en el pie de página del formulario */
  currentYear: number = new Date().getFullYear();

  /**
   * @description Obtiene el control de formulario correspondiente al campo email.
   * @returns El control `email` del formulario de inicio de sesión
   */
  get email() {
    return this.loginForm.get('email');
  }

  /**
   * @description Obtiene el control de formulario correspondiente al campo contraseña.
   * @returns El control `password` del formulario de inicio de sesión
   */
  get password() {
    return this.loginForm.get('password');
  }

  /**
   * @description Ejecuta el proceso de inicio de sesión validando el formulario,
   * invocando el caso de uso de autenticación y navegando al dashboard en caso de éxito.
   * @returns Promesa que se resuelve al completar el proceso de login
   */
  async onLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos.';
      return;
    }

    this.errorMessage = null;
    this.loadingService.show();

    try {
      await firstValueFrom(
        this.signInUseCase.execute(this.email!.value, this.password!.value),
      );
      this.router.navigate(['/loading-data']);
    } catch (error: unknown) {
      console.error('Login error detailed:', error);

      if (error instanceof AppError) {
        error.markAsHandled();
        this.errorMessage = error.message;
      } else {
        this.errorMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
      }
    } finally {
      this.loadingService.hide();
      this.cdr.markForCheck();
    }
  }
}

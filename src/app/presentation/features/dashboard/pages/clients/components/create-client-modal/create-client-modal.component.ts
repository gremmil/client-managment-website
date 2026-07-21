import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ageAndBirthDateValidator } from 'src/app/core/validators/age-birthdate.validator';

@Component({
  selector: 'app-create-client-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-client-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * @description Componente modal para la creación de un nuevo cliente.
 * Contiene un formulario reactivo con validaciones de edad y fecha de nacimiento.
 */
export class CreateClientModalComponent {
  /** @description Formulario reactivo para los datos del nuevo cliente */
  form: FormGroup;
  /** @description Fecha máxima permitida para el campo de fecha de nacimiento (hace 18 años) */
  maxDate: string;

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreateClientModalComponent>);
  readonly loadingService = inject(LoadingService);

  constructor() {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate(),
    );
    this.maxDate = eighteenYearsAgo.toISOString().split('T')[0];

    this.form = this.fb.group(
      {
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        age: [null, [Validators.required, Validators.min(18)]],
        birthDate: ['', Validators.required],
      },
      { validators: ageAndBirthDateValidator() },
    );
  }

  /**
   * @description Reinicia el formulario al inicializar el componente.
   */
  ngOnInit() {
    this.form.reset();
  }

  /**
   * @description Envía los datos del formulario si es válido y cierra el modal con los valores ingresados.
   */
  onSubmit() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  /**
   * @description Cancela la operación y cierra el modal sin devolver datos.
   */
  onCancel() {
    this.dialogRef.close();
  }
}

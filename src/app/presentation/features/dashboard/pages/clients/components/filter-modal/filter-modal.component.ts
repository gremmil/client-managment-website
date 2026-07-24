import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { ClientFilters } from 'src/app/core/interfaces/client-table.interface';

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule,
  ],
  templateUrl: './filter-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * @description Componente modal para gestionar los filtros avanzados de la tabla de clientes.
 */
export class FilterModalComponent {
  private readonly dialogRef = inject(MatDialogRef<FilterModalComponent>);
  readonly data: ClientFilters = inject(MAT_DIALOG_DATA);

  /** @description Filtro por nombre del cliente */
  name = this.data.name || '';
  /** @description Filtro por apellido del cliente */
  lastname = this.data.lastname || '';
  /** @description Filtro de edad mínima */
  ageMin: number | null = this.data.ageMin;
  /** @description Filtro de edad máxima */
  ageMax: number | null = this.data.ageMax;
  /** @description Filtro de fecha de nacimiento inicial */
  birthDateStart: Date | null = this.data.birthDateStart;
  /** @description Filtro de fecha de nacimiento final */
  birthDateEnd: Date | null = this.data.birthDateEnd;

  /**
   * @description Aplica los filtros configurados y cierra el modal devolviendo los valores en formato ISO.
   */
  applyFilters(): void {
    this.dialogRef.close({
      name: this.name,
      lastname: this.lastname,
      ageMin: this.ageMin,
      ageMax: this.ageMax,
      birthDateStart: this.birthDateStart,
      birthDateEnd: this.birthDateEnd,
    });
  }

  /**
   * @description Cancela la operación y cierra el modal sin devolver resultado.
   */
  onCancel(): void {
    this.dialogRef.close();
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { HeroFunnel, HeroXMark } from '@ng-icons/heroicons/outline';
import { formatDateToISO } from 'src/app/core/helpers/date.helper';

/**
 * @description Datos de entrada que recibe el modal de filtros al abrirse.
 */
export interface FilterModalData {
  /** @description Valor actual del filtro de nombre */
  name: string;
  /** @description Valor actual del filtro de apellido */
  lastname: string;
  /** @description Valor actual del filtro de edad mínima */
  ageMin: number | null;
  /** @description Valor actual del filtro de edad máxima */
  ageMax: number | null;
  /** @description Valor actual del filtro de fecha de nacimiento inicial */
  birthDateStart: Date | null;
  /** @description Valor actual del filtro de fecha de nacimiento final */
  birthDateEnd: Date | null;
  /** @description Rango de edades permitido para los filtros */
  ageRange: { min: number; max: number };
}

/**
 * @description Resultado devuelto por el modal de filtros al cerrarse con datos aplicados.
 */
export interface FilterModalResult {
  /** @description Nombre filtrado */
  name: string;
  /** @description Apellido filtrado */
  lastname: string;
  /** @description Edad mínima filtrada */
  ageMin: number | null;
  /** @description Edad máxima filtrada */
  ageMax: number | null;
  /** @description Fecha de nacimiento inicial filtrada en formato ISO */
  birthDateStart: string;
  /** @description Fecha de nacimiento final filtrada en formato ISO */
  birthDateEnd: string;
}

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
    NgIconsModule,
  ],
  providers: [provideIcons({ HeroFunnel, HeroXMark })],
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
/**
 * @description Componente modal para gestionar los filtros avanzados de la tabla de clientes.
 */
export class FilterModalComponent {
  private readonly dialogRef = inject(MatDialogRef<FilterModalComponent>);
  readonly data: FilterModalData = inject(MAT_DIALOG_DATA);

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
      birthDateStart: this.birthDateStart ? formatDateToISO(this.birthDateStart) : '',
      birthDateEnd: this.birthDateEnd ? formatDateToISO(this.birthDateEnd) : '',
    });
  }

  /**
   * @description Cancela la operación y cierra el modal sin devolver resultado.
   */
  onCancel(): void {
    this.dialogRef.close();
  }
}

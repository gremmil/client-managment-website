import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * @description Validador de grupo que verifica la coherencia entre la edad y la fecha de nacimiento.
 * Valida que el usuario sea mayor de edad (18 años) y que la edad ingresada coincida
 * con la edad calculada a partir de la fecha de nacimiento.
 * @returns Función validadora que retorna `underAge` si es menor de edad o `ageMismatch` si la edad no coincide
 */
export function ageAndBirthDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const age = control.get('age')?.value;
    const birthDateStr = control.get('birthDate')?.value;
    if (!age || !birthDateStr) return null;

    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let realAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      realAge--;
    }

    if (age < 18) return { underAge: true };
    if (Number(age) !== realAge) return { ageMismatch: true };
    return null;
  };
}

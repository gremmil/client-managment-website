import { FormGroup } from '@angular/forms';

const FIELD_ERRORS: Record<string, Record<string, string>> = {
  name: { required: 'El nombre es obligatorio.' },
  lastname: { required: 'El apellido es obligatorio.' },
  age: {
    required: 'Edad obligatoria (mín. 18).',
    min: 'Debe ser mayor de 18 años.',
  },
  birthDate: { required: 'Fecha obligatoria.' },
  email: {
    required: 'El correo es obligatorio.',
    email: 'Formato de email inválido.',
  },
  password: {
    required: 'La contraseña es obligatoria.',
    minlength: 'Mínimo 6 caracteres.',
  },
};

const GROUP_ERRORS: Record<string, string> = {
  underAge: 'Debe ser mayor de 18 años.',
  ageMismatch: 'La edad no coincide con la fecha de nacimiento.',
};

export function getFieldError(form: FormGroup, field: string): string | null {
  const control = form.get(field);
  if (!control || !control.errors || !(control.touched || control.dirty)) {
    return null;
  }

  for (const [errorKey, message] of Object.entries(FIELD_ERRORS[field] ?? {})) {
    if (control.hasError(errorKey)) return message;
  }
  return null;
}

export function getFormGroupErrors(form: FormGroup): string[] {
  if (!form.errors || !(form.touched || form.dirty)) return [];

  return Object.entries(GROUP_ERRORS)
    .filter(([key]) => form.hasError(key))
    .map(([, msg]) => msg);
}
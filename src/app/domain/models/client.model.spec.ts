import { validateClient, CreateClientPayload } from './client.model';
import { ValidationError } from 'src/app/core/errors/app-error';

describe('validateClient', () => {
  const validPayload: CreateClientPayload = {
    name: 'John',
    lastname: 'Doe',
    age: 25,
    birthDate: '2001-01-01',
  };

  it('should not throw for a valid payload', () => {
    expect(() => validateClient(validPayload)).not.toThrow();
  });

  it('should throw ValidationError when name is empty', () => {
    expect(() => validateClient({ ...validPayload, name: '' })).toThrowError(ValidationError);
  });

  it('should throw ValidationError when name is only whitespace', () => {
    expect(() => validateClient({ ...validPayload, name: '   ' })).toThrowError(ValidationError);
  });

  it('should throw ValidationError when lastname is empty', () => {
    expect(() => validateClient({ ...validPayload, lastname: '' })).toThrowError(ValidationError);
  });

  it('should throw ValidationError when age is not a number', () => {
    expect(() => validateClient({ ...validPayload, age: NaN })).toThrowError(ValidationError);
  });

  it('should throw ValidationError when age is under 18', () => {
    expect(() => validateClient({ ...validPayload, age: 17 })).toThrowError(ValidationError);
  });

  it('should throw ValidationError when age is unrealistic (>150)', () => {
    expect(() => validateClient({ ...validPayload, age: 200 })).toThrowError(ValidationError);
  });

  it('should throw ValidationError when birthDate is empty', () => {
    expect(() => validateClient({ ...validPayload, birthDate: '' })).toThrowError(ValidationError);
  });

  it('should throw ValidationError when birthDate is invalid', () => {
    expect(() => validateClient({ ...validPayload, birthDate: 'not-a-date' })).toThrowError(ValidationError);
  });

  it('should throw ValidationError when birthDate is in the future', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    expect(() => validateClient({ ...validPayload, birthDate: futureDate.toISOString() })).toThrowError(ValidationError);
  });
});

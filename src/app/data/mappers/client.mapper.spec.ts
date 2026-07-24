import { clientDTOToDomain, clientDomainToDTO, createPayloadToDTO } from './client.mapper';
import { ClientDTO } from 'src/app/data/dtos/client.dto';
import { Client, CreateClientPayload } from 'src/app/domain/models/client.model';

describe('clientMapper', () => {
  describe('clientDTOToDomain', () => {
    it('should map a ClientDTO to a Client domain model', () => {
      const dto: ClientDTO = {
        id: '1',
        name: 'John',
        lastname: 'Doe',
        age: 25,
        birthDate: '2001-01-01',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      };

      const result = clientDTOToDomain(dto);

      expect(result).toEqual({
        id: '1',
        name: 'John',
        lastname: 'Doe',
        age: 25,
        birthDate: new Date('2001-01-01'),
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
    });

    it('should handle DTO without optional fields', () => {
      const dto: ClientDTO = {
        name: 'Jane',
        lastname: 'Smith',
        age: 30,
        birthDate: '1996-05-15',
      };

      const result = clientDTOToDomain(dto);

      expect(result.id).toBeUndefined();
      expect(result.createdAt).toBeUndefined();
      expect(result.updatedAt).toBeUndefined();
    });
  });

  describe('clientDomainToDTO', () => {
    it('should map a Client domain model to a ClientDTO', () => {
      const birthDate = new Date(2001, 0, 1);
      const client: Client = {
        id: '1',
        name: 'John',
        lastname: 'Doe',
        age: 25,
        birthDate,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const result = clientDomainToDTO(client);

      expect(result).toEqual({
        id: '1',
        name: 'John',
        lastname: 'Doe',
        age: 25,
        birthDate: '2001-01-01',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: undefined,
      });
    });
  });

  describe('createPayloadToDTO', () => {
    it('should map a CreateClientPayload to a DTO without id/timestamps and trim strings', () => {
      const birthDate = new Date(2001, 0, 1);
      const payload: CreateClientPayload = {
        name: '  John  ',
        lastname: '  Doe  ',
        age: 25,
        birthDate,
      };

      const result = createPayloadToDTO(payload);

      expect(result).toEqual({
        name: 'John',
        lastname: 'Doe',
        age: 25,
        birthDate: '2001-01-01',
      });
      expect((result as any).id).toBeUndefined();
      expect((result as any).createdAt).toBeUndefined();
      expect((result as any).updatedAt).toBeUndefined();
    });
  });
});

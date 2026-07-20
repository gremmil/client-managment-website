import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CreateClientUseCase } from './create-client.use-case';
import { ClientRepository } from '../repositories/client.repository';
import { CLIENT_REPOSITORY } from 'src/app/core/tokens/repository.tokens';
import { Client, CreateClientPayload } from '../models/client.model';
import { ValidationError } from 'src/app/core/errors/app-error';

describe('CreateClientUseCase', () => {
  let useCase: CreateClientUseCase;
  let mockRepository: jasmine.SpyObj<ClientRepository>;

  beforeEach(() => {
    mockRepository = jasmine.createSpyObj('ClientRepository', ['create']);

    TestBed.configureTestingModule({
      providers: [
        CreateClientUseCase,
        { provide: CLIENT_REPOSITORY, useValue: mockRepository },
      ],
    });

    useCase = TestBed.inject(CreateClientUseCase);
  });

    useCase = TestBed.inject(CreateClientUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should validate payload and call repository.create', (done) => {
    const payload: CreateClientPayload = {
      name: 'John',
      lastname: 'Doe',
      age: 25,
      birthDate: '2001-01-01',
    };
    const mockClient: Client = { ...payload, id: '1', createdAt: '2024-01-01' };
    mockRepository.create.and.returnValue(of(mockClient));

    useCase.execute(payload).subscribe((client) => {
      expect(client).toEqual(mockClient);
      expect(mockRepository.create).toHaveBeenCalledWith(payload);
      done();
    });
  });

  it('should throw ValidationError for invalid payload without calling repository', () => {
    const invalidPayload: CreateClientPayload = {
      name: '',
      lastname: 'Doe',
      age: 25,
      birthDate: '2001-01-01',
    };

    expect(() => useCase.execute(invalidPayload)).toThrowError(ValidationError);
    expect(mockRepository.create).not.toHaveBeenCalled();
  });
});

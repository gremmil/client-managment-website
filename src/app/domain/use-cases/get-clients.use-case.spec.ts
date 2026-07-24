import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GetClientsUseCase } from './get-clients.use-case';
import { ClientRepository } from '../repositories/client.repository';
import { CLIENT_REPOSITORY } from 'src/app/core/tokens/repository.tokens';
import { Client } from '../models/client.model';

describe('GetClientsUseCase', () => {
  let useCase: GetClientsUseCase;
  let mockRepository: jasmine.SpyObj<ClientRepository>;

  beforeEach(() => {
    mockRepository = jasmine.createSpyObj('ClientRepository', ['getAll']);

    TestBed.configureTestingModule({
      providers: [
        GetClientsUseCase,
        { provide: CLIENT_REPOSITORY, useValue: mockRepository },
      ],
    });

    useCase = TestBed.inject(GetClientsUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call repository.getAll and return clients', (done) => {
    const mockClients: Client[] = [
      { id: '1', name: 'John', lastname: 'Doe', age: 25, birthDate: new Date('2001-01-01') },
      { id: '2', name: 'Jane', lastname: 'Smith', age: 30, birthDate: new Date('1996-05-15') },
    ];
    mockRepository.getAll.and.returnValue(of(mockClients));

    useCase.execute().subscribe((clients) => {
      expect(clients).toEqual(mockClients);
      expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should propagate errors from repository', (done) => {
    mockRepository.getAll.and.returnValue(throwError(() => new Error('Firestore error')));

    useCase.execute().subscribe({
      next: () => fail('Should have errored'),
      error: (err) => {
        expect(err.message).toBe('Firestore error');
        done();
      },
    });
  });
});

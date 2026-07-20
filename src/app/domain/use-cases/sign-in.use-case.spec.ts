import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SignInUseCase } from './sign-in.use-case';
import { AuthRepository, AuthUser } from 'src/app/domain/repositories/auth.repository';
import { AUTH_REPOSITORY } from 'src/app/core/tokens/repository.tokens';

describe('SignInUseCase', () => {
  let useCase: SignInUseCase;
  let mockRepository: jasmine.SpyObj<AuthRepository>;

  beforeEach(() => {
    mockRepository = jasmine.createSpyObj('AuthRepository', ['signIn'], {
      currentUser$: of(null),
    });

    TestBed.configureTestingModule({
      providers: [
        SignInUseCase,
        { provide: AUTH_REPOSITORY, useValue: mockRepository },
      ],
    });

    useCase = TestBed.inject(SignInUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call repository.signIn with email and password', (done) => {
    const mockUser: AuthUser = { uid: '123', email: 'test@test.com' };
    mockRepository.signIn.and.returnValue(of(mockUser));

    useCase.execute('test@test.com', 'password').subscribe((user) => {
      expect(user).toEqual(mockUser);
      expect(mockRepository.signIn).toHaveBeenCalledWith('test@test.com', 'password');
      done();
    });
  });
});

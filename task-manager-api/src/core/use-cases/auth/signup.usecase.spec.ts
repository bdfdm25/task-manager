// signup.usecase.spec.ts
import { SignupUseCase } from './signup.usecase';
import { SignupDto } from '@dtos/auth/signup.dto';

describe('SignupUseCase', () => {
  let signupUseCase: SignupUseCase;
  let mockService;

  beforeEach(() => {
    mockService = { create: jest.fn() };
    signupUseCase = new SignupUseCase(mockService);
  });

  it('should call the service create method with the provided dto', async () => {
    const dto: SignupDto = {
      email: 'john.doe@example.com',
      password: 'password',
      fullname: 'John Doe',
    };

    await signupUseCase.execute(dto);

    expect(mockService.create).toHaveBeenCalledWith(dto);
  });
});

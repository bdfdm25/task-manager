import { SigninDto } from '@dtos/auth/signin.dto';
import { MOCK_USER_ENTITY } from '@usecases/mocks/user.mock';
import { SigninUseCase } from './signin.usecase';

describe('SigninUseCase', () => {
  let signinUseCase: SigninUseCase;
  let mockService;

  beforeEach(() => {
    mockService = { findOne: jest.fn() };
    signinUseCase = new SigninUseCase(mockService);
  });

  it('should return a UserEntity', async () => {
    const dto: SigninDto = { email: 'test@test.com', password: 'password' };

    mockService.findOne.mockResolvedValue(MOCK_USER_ENTITY);
    const result = await signinUseCase.execute(dto);

    expect(result).toEqual(MOCK_USER_ENTITY);
    expect(mockService.findOne).toHaveBeenCalledWith(dto);
  });
});

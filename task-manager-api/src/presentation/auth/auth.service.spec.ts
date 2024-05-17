// auth.service.spec.ts
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let mockJwtService;
  let mockSigninUseCase;
  let mockSignupUseCase;

  beforeEach(() => {
    mockJwtService = { sign: jest.fn() };
    mockSigninUseCase = { execute: jest.fn() };
    mockSignupUseCase = { execute: jest.fn() };

    authService = new AuthService(
      mockJwtService,
      mockSigninUseCase,
      mockSignupUseCase,
    );
  });

  it('should sign up a user', async () => {
    const signupDto: SignupDto = {
      fullname: 'Test User',
      email: 'test@test.com',
      password: 'password',
    };

    await authService.signup(signupDto);

    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(signupDto);
  });

  it('should sign in a user and return an access token', async () => {
    const signinDto: SigninDto = {
      email: 'test@test.com',
      password: 'password',
    };
    const user = {
      id: '1',
      fullname: 'Test User',
      email: 'test@test.com',
      password: 'hashedpassword',
    };
    const payload = { id: user.id, fullname: user.fullname, email: user.email };
    const accessToken = 'access_token';

    jest.spyOn(mockSigninUseCase, 'execute').mockResolvedValue(user);
    jest.spyOn(mockJwtService, 'sign').mockReturnValue(accessToken);
    const bcryptCompare = jest.fn().mockResolvedValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const result = await authService.signin(signinDto);

    expect(result).toEqual({ accessToken });
    expect(mockSigninUseCase.execute).toHaveBeenCalledWith(signinDto);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      signinDto.password,
      user.password,
    );
    expect(mockJwtService.sign).toHaveBeenCalledWith(payload);
  });

  it('should throw UnauthorizedException if invalid credentials are provided', async () => {
    const signinDto: SigninDto = {
      email: 'test@test.com',
      password: 'password',
    };
    const user = {
      id: '1',
      fullname: 'Test User',
      email: 'test@test.com',
      password: 'hashedpassword',
    };

    jest.spyOn(mockSigninUseCase, 'execute').mockResolvedValue(user);
    const bcryptCompare = jest.fn().mockResolvedValue(false);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    await expect(authService.signin(signinDto)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockSigninUseCase.execute).toHaveBeenCalledWith(signinDto);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      signinDto.password,
      user.password,
    );
  });
});

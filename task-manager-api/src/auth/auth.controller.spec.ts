import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            signin: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      const signupDto: SignupDto = {
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        password: 'johnsPassword123',
      };
      await controller.signup(signupDto);
      expect(authService.signup).toHaveBeenCalledWith(signupDto);
    });
  });

  describe('signin', () => {
    it('should return an access token', async () => {
      const signinDto: SigninDto = {
        email: 'john.doe@example.com',
        password: 'johnsPassword123',
      };
      const accessToken = 'exampleAccessToken';

      jest.spyOn(authService, 'signin').mockResolvedValue({ accessToken });

      await expect(controller.signin(signinDto)).resolves.toEqual({
        accessToken,
      });
      expect(authService.signin).toHaveBeenCalledWith(signinDto);
      // Add any additional assertions if needed
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

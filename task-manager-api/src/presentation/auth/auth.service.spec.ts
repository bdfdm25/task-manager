import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      const signupDto: SignupDto = {
        fullname: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      };

      await service.signup(signupDto);

      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fullname: signupDto.fullname,
          email: signupDto.email,
          password: expect.any(String),
        }),
      );
    });

    it('should throw ConflictException if email is already in use', async () => {
      const signupDto: SignupDto = {
        fullname: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      };

      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValueOnce({ code: '23505' });

      await expect(service.signup(signupDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw InternalServerErrorException if an error occurs during user creation', async () => {
      const signupDto: SignupDto = {
        fullname: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      };

      jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error());

      await expect(service.signup(signupDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('signin', () => {
    it('should return an access token if credentials are valid', async () => {
      const signinDto: SigninDto = {
        email: 'john@example.com',
        password: 'password',
      };

      const user: User = {
        id: '6193e7a4-29d8-4876-b31a-2d598e2d1545',
        fullname: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password', await bcrypt.genSalt()),
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('access_token');

      const result = await service.signin(signinDto);

      expect(result).toEqual({ accessToken: 'access_token' });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const signinDto: SigninDto = {
        email: 'john@example.com',
        password: 'password',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.signin(signinDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});

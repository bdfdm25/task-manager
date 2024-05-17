import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '@shared/interfaces/jwt-payload.interface';
import { SigninUseCase } from '@usecases/auth/signin.usecase';
import { SignupUseCase } from '@usecases/auth/signup.usecase';
import * as bcrypt from 'bcrypt';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly signinUseCase: SigninUseCase,
    private readonly signupUseCase: SignupUseCase,
  ) {}

  async signup(signupDto: SignupDto): Promise<void> {
    this.signupUseCase.execute(signupDto);
  }

  async signin(signinDto: SigninDto): Promise<{ accessToken: string }> {
    const { password } = signinDto;
    const user = await this.signinUseCase.execute(signinDto);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: IJwtPayload = {
        id: user.id as string,
        fullname: user.fullname,
        email: user.email,
      };

      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Check your credentials!');
    }
  }
}

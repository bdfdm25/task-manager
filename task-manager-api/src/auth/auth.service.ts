import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { POSTGRES_ERROR } from '@utils/typeorm-errors.enum';
import { IJwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService', { timestamp: true });
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashedPwd = await bcrypt.hash(signupDto.password, salt);

    const user = this.userRepository.create({
      ...signupDto,
      password: hashedPwd,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(error);
      if (error.code === POSTGRES_ERROR.DUPLICATE) {
        throw new ConflictException('Email already in use!');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signin(signinDto: SigninDto): Promise<{ accessToken: string }> {
    const { email, password } = signinDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: IJwtPayload = {
        id: user.id,
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

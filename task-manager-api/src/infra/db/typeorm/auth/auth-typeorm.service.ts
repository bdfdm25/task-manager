import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { SigninDto } from '@dtos/auth/signin.dto';
import { SignupDto } from '@dtos/auth/signup.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthBaseService } from '@services/auth/auth.service';
import { POSTGRES_ERROR } from '@utils/typeorm-errors.enum';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class AuthTypeOrmService implements AuthBaseService {
  private logger = new Logger('AuthTypeOrmService', { timestamp: true });
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(signinDto: SigninDto): Promise<UserEntity> {
    const { email } = signinDto;
    return await this.userRepository.findOne({ where: { email } });
  }

  async create(signupDto: SignupDto): Promise<void> {
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
}

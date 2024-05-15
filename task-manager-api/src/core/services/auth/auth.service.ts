import { BaseService } from '@base/base.service';
import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { SigninDto } from '@dtos/auth/signin.dto';
import { SignupDto } from '@dtos/auth/signup.dto';

export interface AuthBaseService extends BaseService<UserEntity> {
  findOne(signinDto: SigninDto): Promise<UserEntity>;
  create(signupDto: SignupDto): Promise<void>;
}

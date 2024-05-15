import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { SigninDto } from '@dtos/auth/signin.dto';
import { AuthBaseService } from '@services/auth/auth.service';

export class SigninUseCase {
  constructor(private readonly service: AuthBaseService) {}

  async execute(signinDto: SigninDto): Promise<UserEntity> {
    return this.service.findOne(signinDto);
  }
}

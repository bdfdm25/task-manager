import { SignupDto } from '@dtos/auth/signup.dto';
import { AuthBaseService } from '@services/auth/auth.service';

export class SignupUseCase {
  constructor(private readonly service: AuthBaseService) {}

  async execute(signupDto: SignupDto): Promise<void> {
    return this.service.create(signupDto);
  }
}

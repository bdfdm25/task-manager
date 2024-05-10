import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiCreatedResponse({
    description: 'New user created',
    type: SignupDto,
  })
  @ApiBody({
    description: 'New user information',
    type: SignupDto,
  })
  signup(@Body() signupDto: SignupDto): Promise<void> {
    return this.authService.signup(signupDto);
  }

  @Post('/signin')
  @ApiOkResponse({
    description: 'User sucessfully logged in',
    type: String,
  })
  @ApiBody({
    description: 'Login information',
    type: SigninDto,
  })
  signin(@Body() signinDto: SigninDto): Promise<{ accessToken: string }> {
    return this.authService.signin(signinDto);
  }
}

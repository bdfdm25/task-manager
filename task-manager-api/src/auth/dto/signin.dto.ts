import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SigninDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  /**
   * - Passwords will contain at least 1 upper case letter
   * - Passwords will contain at least 1 lower case letter
   * - Passwords will contain at least 1 number or special character
   * - There is no length validation (min, max) in this regex!
   */
  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}

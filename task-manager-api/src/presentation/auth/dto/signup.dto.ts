import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum RoleEnum {
  CLIENT = 'CLIENT',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
}

export class SignupDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  fullname: string;

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
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;
}

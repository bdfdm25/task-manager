import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { AuthTypeOrmService } from '@infra/db/typeorm/auth/auth-typeorm.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { AuthBaseService } from '@services/auth/auth.service';
import { SigninUseCase } from '@usecases/auth/signin.usecase';
import { SignupUseCase } from '@usecases/auth/signup.usecase';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '2h',
        },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: AuthTypeOrmService,
      useFactory: (dataSource: DataSource) => {
        return new AuthTypeOrmService(dataSource.getRepository(UserEntity));
      },
      inject: [getDataSourceToken(), JwtService],
    },
    {
      provide: SigninUseCase,
      useFactory: (service: AuthBaseService) => {
        return new SigninUseCase(service);
      },
      inject: [AuthTypeOrmService, JwtService],
    },
    {
      provide: SignupUseCase,
      useFactory: (service: AuthBaseService) => {
        return new SignupUseCase(service);
      },
      inject: [AuthTypeOrmService, JwtStrategy],
    },
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}

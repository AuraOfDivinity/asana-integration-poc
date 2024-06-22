import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { GoogleStrategy } from './google.strategy';
import { GoogleTokenValidationService } from './google-token-valcation.service';
import { GoogleAuthGuard } from './google-auth.guard';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    UserModule,
    HttpModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    GoogleTokenValidationService,
    GoogleAuthGuard,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

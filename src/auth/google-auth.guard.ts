import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GoogleTokenValidationService } from './google-token-valcation.service';
import { Request } from 'express';

@Injectable()
export class GoogleAuthGuard implements CanActivate {
  constructor(
    private readonly googleTokenValidationService: GoogleTokenValidationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    const userData =
      await this.googleTokenValidationService.validateToken(token);
    request.user = userData;
    console.log({ userData });

    return true;
  }
}

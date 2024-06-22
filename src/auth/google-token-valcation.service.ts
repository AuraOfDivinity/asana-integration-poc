import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class GoogleTokenValidationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async validateToken(token: string): Promise<any> {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const response = await lastValueFrom(
      this.httpService.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`,
      ),
    );

    if (response.data.aud !== clientId) {
      throw new UnauthorizedException('Invalid token');
    }

    return response.data;
  }
}

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
    console.log('Client ID used for validation:', clientId);

    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
        ),
      );

      console.log('Token validation response:', response.data);

      if (!response.data || response.data.aud !== clientId) {
        throw new UnauthorizedException('Invalid token');
      }

      return response.data;
    } catch (error) {
      console.error(
        'Error validating token:',
        error.response?.data || error.message,
      );
      throw new UnauthorizedException('Invalid token');
    }
  }
}

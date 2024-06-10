import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateAccessToken(accessToken: string): Promise<boolean> {
    // Here you should validate the access token with the Google API
    // For simplicity, let's assume it's valid if not empty
    return !!accessToken;
  }
}

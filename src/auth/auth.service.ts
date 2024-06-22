import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private authorizationCodes = new Map<string, any>();

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

  generateAuthorizationCode(user: any): string {
    const authorizationCode = Math.random().toString(36).substring(2, 15);
    this.authorizationCodes.set(authorizationCode, user);
    return authorizationCode;
  }

  validateAuthorizationCode(code: string): any {
    const user = this.authorizationCodes.get(code);
    if (user) {
      this.authorizationCodes.delete(code);
    }
    return user;
  }
}

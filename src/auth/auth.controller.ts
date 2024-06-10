import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      throw new Error('User not found');
    }
    return this.authService.generateToken(user);
  }

  @Post('register')
  async register(@Body() body: { email: string; fullName: string }) {
    const { email, fullName } = body;

    // Check if the user already exists
    let user = await this.userService.findByEmail(email);
    if (!user) {
      // Create a new user if they don't exist
      user = await this.userService.create({ email, fullName });
    }
    return user;
  }

  @Post('exchange')
  async exchangeToken(@Body() body: { accessToken: string }) {
    const { accessToken } = body;

    // Validate the access token (this should include verification with Google API)
    const isValid = await this.authService.validateAccessToken(accessToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid access token');
    }

    // Create a JWT token
    const jwtPayload = { accessToken };
    const jwtToken = this.jwtService.sign(jwtPayload);

    return { jwtToken };
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      throw new Error('User not found');
    }
    return this.authService.generateToken(user);
  }
}

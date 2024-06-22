import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import axios from 'axios';
import { UserDto } from 'src/user/dto/user.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return this.authService.generateToken(req.user);
  }

  @Get('zapier/google/redirect')
  @UseGuards(AuthGuard('google'))
  async zapierGoogleAuthRedirect(@Req() req) {
    const user = req.user;
    const authorizationCode = this.authService.generateAuthorizationCode(user);
    return { code: authorizationCode };
  }

  @Post('token')
  async exchangeToken(@Body() body) {
    const {
      client_id,
      client_secret,
      code,
      redirect_uri,
      grant_type,
      refresh_token,
    } = body;

    if (grant_type === 'authorization_code') {
      try {
        const response = await axios.post(
          'https://oauth2.googleapis.com/token',
          {
            client_id,
            client_secret,
            code,
            redirect_uri:
              'https://zapier.com/dashboard/auth/oauth/return/App207060CLIAPI/',
            grant_type: 'authorization_code',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const { access_token, refresh_token, expires_in } = response.data;
        return {
          access_token,
          token_type: 'Bearer',
          expires_in,
          refresh_token,
        };
      } catch (error) {
        console.error('Error exchanging token:', error.response.data);
        throw new HttpException(
          'Invalid authorization code',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (grant_type === 'refresh_token') {
      try {
        const response = await axios.post(
          'https://oauth2.googleapis.com/token',
          {
            client_id,
            client_secret,
            refresh_token,
            grant_type: 'refresh_token',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const { access_token, expires_in } = response.data;
        return {
          access_token,
          token_type: 'Bearer',
          expires_in,
        };
      } catch (error) {
        console.error('Error refreshing token:', error.response.data);
        throw new HttpException(
          'Invalid token refresh',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException('Unsupported grant type', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('zapier/token')
  async zapierExchangeToken(@Body() body) {
    const {
      client_id,
      client_secret,
      code,
      redirect_uri,
      grant_type,
      refresh_token,
    } = body;

    if (grant_type === 'authorization_code') {
      try {
        const response = await axios.post(
          'https://oauth2.googleapis.com/token',
          {
            client_id,
            client_secret,
            code,
            redirect_uri:
              'https://zapier.com/dashboard/auth/oauth/return/App207060CLIAPI/',
            grant_type: 'authorization_code',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const { access_token, refresh_token, expires_in } = response.data;
        return {
          access_token,
          token_type: 'Bearer',
          expires_in,
          refresh_token,
        };
      } catch (error) {
        console.error('Error exchanging token:', error.response.data);
        throw new HttpException(
          'Invalid authorization code',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (grant_type === 'refresh_token') {
      try {
        const response = await axios.post(
          'https://oauth2.googleapis.com/token',
          {
            client_id,
            client_secret,
            refresh_token,
            grant_type: 'refresh_token',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const { access_token, expires_in } = response.data;
        return {
          access_token,
          token_type: 'Bearer',
          expires_in,
        };
      } catch (error) {
        console.error('Error refreshing token:', error.response.data);
        throw new HttpException(
          'Invalid token refresh',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException('Unsupported grant type', HttpStatus.BAD_REQUEST);
    }
  }

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
  async exchange(@Body() body: { accessToken: string }) {
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

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req: Request): UserDto {
    console.log({ req });
    const user = req.user as any;
    return { userId: user.userId, username: user.username };
  }
}

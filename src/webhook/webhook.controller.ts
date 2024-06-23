import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { WebhooksService } from './webhook.service';
import { GoogleAuthGuard } from '../auth/google-auth.guard';
import { Request } from 'express';
import { Webhook } from './entity/webhook.entity';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @UseGuards(GoogleAuthGuard)
  @Post('subscribe')
  async subscribe(@Body('url') url: string, @Req() req: Request) {
    console.log(`subscribe called for user ${req.user.email}`);

    await this.webhooksService.create({ url, user: req.user.email });
    return { message: 'Subscription successful' };
  }

  @UseGuards(GoogleAuthGuard)
  @Post('unsubscribe')
  async unsubscribe(@Body('url') url: string, @Req() req: Request) {
    await this.webhooksService.delete({ url, user: req.user.email });
    return { message: 'Unsubscription successful' };
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhooksService } from './webhook.service';
import { WebhooksController } from './webhook.controller';
import { Webhook } from './entity/webhook.entity';
import { GoogleTokenValidationService } from 'src/auth/google-token-valcation.service';
import { GoogleAuthGuard } from 'src/auth/google-auth.guard';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Webhook]), HttpModule],
  providers: [WebhooksService, GoogleTokenValidationService, GoogleAuthGuard],
  controllers: [WebhooksController],
})
export class WebhooksModule {}

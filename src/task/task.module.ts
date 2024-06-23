import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './task.service';
import { TasksController } from './task.controller';
import { Task } from './task.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { GoogleAuthGuard } from 'src/auth/google-auth.guard';
import { GoogleTokenValidationService } from 'src/auth/google-token-valcation.service';
import { WebhooksService } from 'src/webhook/webhook.service';
import { WebhooksModule } from 'src/webhook/webhook.module';
import { Webhook } from 'src/webhook/entity/webhook.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Webhook]),
    HttpModule,
    ConfigModule,
    WebhooksModule,
  ],
  providers: [
    TasksService,
    GoogleTokenValidationService,
    GoogleAuthGuard,
    WebhooksService,
  ],
  controllers: [TasksController],
})
export class TasksModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './task.service';
import { TasksController } from './task.controller';
import { Task } from './task.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { GoogleAuthGuard } from 'src/auth/google-auth.guard';
import { GoogleTokenValidationService } from 'src/auth/google-token-valcation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), HttpModule, ConfigModule],
  providers: [TasksService, GoogleTokenValidationService, GoogleAuthGuard],
  controllers: [TasksController],
})
export class TasksModule {}

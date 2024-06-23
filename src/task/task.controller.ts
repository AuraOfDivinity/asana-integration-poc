import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TasksService } from './task.service';
import { Task } from './task.entity';
import { Request } from 'express';
import { CreateTaskDto } from './dto/create-task-dto';
import { GoogleAuthGuard } from 'src/auth/google-auth.guard';
import { WebhooksService } from 'src/webhook/webhook.service';
import axios from 'axios';

@Controller('tasks')
@UseGuards(GoogleAuthGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly webhooksService: WebhooksService,
  ) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request,
  ): Promise<Task> {
    console.log(req);
    const task: Partial<Task> = {
      ...createTaskDto,
      taskOwner: req.user.email, // Adjust based on your user info
    };
    const newTask = await this.tasksService.create(task);

    // Notify all subscribed webhooks for the task owner
    await this.notifyZapier(newTask);

    return newTask;
  }

  @Get()
  async findAll(@Query('email') email?: string): Promise<Task[]> {
    if (email) {
      return this.tasksService.findTasksByEmail(email);
    } else {
      return this.tasksService.findAll();
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() task: Partial<Task>,
  ): Promise<void> {
    await this.tasksService.update(id, task);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.tasksService.remove(id);
  }

  @Get()
  async getTasksByEmail(@Query('email') email: string): Promise<Task[]> {
    return this.tasksService.findTasksByEmail(email);
  }

  private async notifyZapier(task: Task) {
    const userWebhooks = await this.webhooksService.findByUser(task.taskOwner);
    for (const webhook of userWebhooks) {
      await axios.post(webhook.url, task);
    }
  }
}

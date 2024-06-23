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
} from '@nestjs/common';
import { TasksService } from './task.service';
import { Task } from './task.entity';
import { Request } from 'express';
import { CreateTaskDto } from './dto/create-task-dto';
import { GoogleAuthGuard } from 'src/auth/google-auth.guard';

@Controller('tasks')
@UseGuards(GoogleAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

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
    return this.tasksService.create(task);
  }

  @Get()
  async findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
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
}

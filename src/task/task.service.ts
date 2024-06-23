import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(task: Partial<Task>): Promise<Task> {
    const newTask = this.tasksRepository.create(task);
    return this.tasksRepository.save(newTask);
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  async findOne(taskId: number): Promise<Task> {
    return this.tasksRepository.findOne({});
  }

  async update(taskId: number, task: Partial<Task>): Promise<void> {
    await this.tasksRepository.update(taskId, task);
  }

  async remove(taskId: number): Promise<void> {
    await this.tasksRepository.delete(taskId);
  }

  async findTasksByEmail(email: string): Promise<Task[]> {
    return this.tasksRepository.find({ where: { taskOwner: email } });
  }
}

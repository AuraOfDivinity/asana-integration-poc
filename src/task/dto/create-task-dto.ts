import { IsString, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  taskTitle: string;

  @IsString()
  @IsOptional()
  taskDescription?: string;
}

// task.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  taskId: number;

  @Column()
  taskTitle: string;

  @Column({ nullable: true })
  taskDescription: string;

  @Column()
  taskOwner: string;
}

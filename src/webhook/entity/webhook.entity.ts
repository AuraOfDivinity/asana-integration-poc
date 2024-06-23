import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Webhook {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  user: string;
}

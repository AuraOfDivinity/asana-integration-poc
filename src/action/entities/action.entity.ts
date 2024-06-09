import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  asanaToken?: string;
}

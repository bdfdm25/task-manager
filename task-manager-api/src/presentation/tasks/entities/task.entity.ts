import { User } from '@auth/entities/user.entity';
import { TaskEntity } from '@core/domain/entities/tasks/task.entity';
import { Exclude } from 'class-transformer';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../../../shared/enums/task-status.enum';

export class Task extends TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne(() => User, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user?: User;
}

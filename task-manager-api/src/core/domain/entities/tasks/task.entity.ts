import { TaskStatus } from 'src/shared/enums/task-status.enum';
import { BaseEntity } from 'typeorm';
import { UserEntity } from '../auth/user.entity';

export class TaskEntity extends BaseEntity {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  user?: UserEntity;
}

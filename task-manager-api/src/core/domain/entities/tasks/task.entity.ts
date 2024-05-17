import { TaskStatus } from 'src/shared/enums/task-status.enum';
import { UserEntity } from '../auth/user.entity';
import { BaseEntity } from '@base/base.entity';

export class TaskEntity extends BaseEntity {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  user?: UserEntity;
}

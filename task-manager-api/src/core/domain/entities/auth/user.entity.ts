import { BaseEntity } from '@base/base.entity';
import { TaskEntity } from '../tasks/task.entity';

export class UserEntity extends BaseEntity {
  fullname: string;
  email: string;
  password: string;
  tasks?: TaskEntity[];
}

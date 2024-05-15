import { BaseEntity } from 'typeorm';
import { TaskEntity } from '../tasks/task.entity';

export class UserEntity extends BaseEntity {
  id: string;
  fullname: string;
  email: string;
  password: string;
  tasks?: TaskEntity[];
}

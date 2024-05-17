import { TaskEntity } from '@core/domain/entities/tasks/task.entity';
import { TaskStatus } from '@shared/enums/task-status.enum';
import { EntitySchema } from 'typeorm';

export const TaskSchema = new EntitySchema<TaskEntity>({
  name: 'task',
  target: TaskEntity,
  tableName: 'tasks',
  columns: {
    id: {
      type: String,
      primary: true,
      generated: 'uuid',
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: 'enum',
      enum: TaskStatus,
      nullable: true,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'UserEntity',
      inverseSide: 'tasks',
      eager: false,
    },
  },
});

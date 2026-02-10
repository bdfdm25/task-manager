import { TaskEntity } from '@core/domain/entities/tasks/task.entity';
import { TaskStatus } from '@shared/enums/task-status.enum';
import { TaskPriority } from '@shared/enums/task-priority.enum';
import { TaskCategory } from '@shared/enums/task-category.enum';
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
    taskCode: {
      type: String,
      unique: true,
      nullable: true,
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
    priority: {
      type: 'enum',
      enum: TaskPriority,
      nullable: true,
    },
    category: {
      type: 'enum',
      enum: TaskCategory,
      nullable: true,
    },
    assignedTo: {
      type: String,
      nullable: true,
    },
    estimatedHours: {
      type: 'float',
      nullable: true,
    },
    deadline: {
      type: 'timestamp',
      nullable: true,
    },
    tags: {
      type: String,
      nullable: true,
    },
    notifyOnCompletion: {
      type: Boolean,
      nullable: true,
      default: false,
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

import { TaskStatus } from 'src/shared/enums/task-status.enum';
import { TaskPriority } from 'src/shared/enums/task-priority.enum';
import { TaskCategory } from 'src/shared/enums/task-category.enum';

export class TaskDto {
  taskCode: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority?: TaskPriority;
  category?: TaskCategory;
  assignedTo?: string;
  estimatedHours?: number;
  deadline?: Date;
  tags?: string;
  notifyOnCompletion?: boolean;
}

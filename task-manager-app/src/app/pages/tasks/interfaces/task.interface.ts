import { TaskPriority } from '../enum/task-priority.enum';
import { TaskStatus } from '../enum/task-status.enum';

export interface ITask {
  id: string;
  taskCode?: string;
  title: string;
  status: TaskStatus;
  description: string;
  priority?: TaskPriority;
  category?: string;
  assignedTo?: string;
  estimatedHours?: number;
  deadline?: Date | string | null;
  tags?: string;
  notifyOnCompletion?: boolean;
}

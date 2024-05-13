import { TaskStatus } from '../enum/task-status.enum';

export interface ITask {
  id: string;
  title: string;
  status: TaskStatus;
  description: string;
}

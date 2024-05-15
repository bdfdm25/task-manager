import { TaskStatus } from 'src/shared/enums/task-status.enum';

export class TaskDto {
  title: string;
  description: string;
  status: TaskStatus;
}

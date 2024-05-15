import { TaskStatus } from 'src/shared/enums/task-status.enum';

export class TasksFilterDto {
  status: TaskStatus;
  search: string;
}

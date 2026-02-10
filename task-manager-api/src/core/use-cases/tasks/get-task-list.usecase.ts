import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { TaskEntity } from '@core/domain/entities/tasks/task.entity';
import { TasksFilterDto } from '@dtos/tasks/tasks-filter.dto';
import { TasksBaseService } from '@services/tasks/tasks.service';

export class GetTaskListUseCase {
  constructor(private readonly service: TasksBaseService) {}

  async execute(
    tasksFilterDto: TasksFilterDto,
    user: UserEntity,
  ): Promise<TaskEntity[]> {
    return this.service.findAll(tasksFilterDto, user);
  }

  async checkTaskCodeExists(
    taskCode: string,
    user: UserEntity,
  ): Promise<boolean> {
    return this.service.checkTaskCodeExists(taskCode, user);
  }
}

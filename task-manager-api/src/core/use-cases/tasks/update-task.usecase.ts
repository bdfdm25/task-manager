import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { TaskEntity } from '@core/domain/entities/tasks/task.entity';
import { TasksBaseService } from '@services/tasks/tasks.service';
import { TaskStatus } from '@shared/enums/task-status.enum';

export class UpdateTaskUseCase {
  constructor(private readonly service: TasksBaseService) {}

  async execute(
    id: string,
    status: TaskStatus,
    user: UserEntity,
  ): Promise<TaskEntity> {
    return this.service.update(id, status, user);
  }
}

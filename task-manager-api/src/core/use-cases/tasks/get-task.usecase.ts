import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { TaskEntity } from '@core/domain/entities/tasks/task.entity';
import { TasksBaseService } from '@services/tasks/tasks.service';

export class GetTaskUseCase {
  constructor(private readonly service: TasksBaseService) {}

  async execute(id: string, user: UserEntity): Promise<TaskEntity> {
    return this.service.findOne(id, user);
  }
}

import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { TaskEntity } from '@core/domain/entities/tasks/task.entity';
import { TaskDto } from '@dtos/tasks/task.dto';
import { TasksBaseService } from '@services/tasks/tasks.service';

export class CreateTaskUseCase {
  constructor(private readonly service: TasksBaseService) {}

  async execute(createTaskDto: TaskDto, user: UserEntity): Promise<TaskEntity> {
    return this.service.create(createTaskDto, user);
  }
}

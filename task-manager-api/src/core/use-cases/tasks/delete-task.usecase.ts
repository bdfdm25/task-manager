import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { TasksBaseService } from '@services/tasks/tasks.service';

export class DeleteTaskUseCase {
  constructor(private readonly service: TasksBaseService) {}

  async execute(id: string, user: UserEntity): Promise<void> {
    return this.service.remove(id, user);
  }
}

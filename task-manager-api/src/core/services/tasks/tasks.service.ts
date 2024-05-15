import { BaseService } from '@base/base.service';
import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { TaskEntity } from '@core/domain/entities/tasks/task.entity';
import { TaskDto } from '@dtos/tasks/task.dto';
import { TasksFilterDto } from '@dtos/tasks/tasks-filter.dto';
import { TaskStatus } from '@shared/enums/task-status.enum';

export interface TasksBaseService extends BaseService<TaskEntity> {
  findAll(
    tasksFilterDto: TasksFilterDto,
    user: UserEntity,
  ): Promise<TaskEntity[]>;
  findOne(id: string, user: UserEntity): Promise<TaskEntity>;
  create(createTaskDto: TaskDto, user: UserEntity): Promise<TaskEntity>;
  update(id: string, status: TaskStatus, user: UserEntity): Promise<TaskEntity>;
  remove(id: string, user: UserEntity): Promise<void>;
}

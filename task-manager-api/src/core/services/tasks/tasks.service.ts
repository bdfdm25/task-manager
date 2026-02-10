import { BaseService } from '@base/base.service';
import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { TaskEntity } from '@core/domain/entities/tasks/task.entity';
import { TaskDto } from '@dtos/tasks/task.dto';
import { TasksFilterDto } from '@dtos/tasks/tasks-filter.dto';

export interface TasksBaseService extends BaseService<TaskEntity> {
  findAll(
    tasksFilterDto: TasksFilterDto,
    user: UserEntity,
  ): Promise<TaskEntity[]>;
  findOne(id: string, user: UserEntity): Promise<TaskEntity>;
  create(createTaskDto: TaskDto, user: UserEntity): Promise<TaskEntity>;
  update(
    id: string,
    updateTaskDto: Partial<TaskDto>,
    user: UserEntity,
  ): Promise<TaskEntity>;
  checkTaskCodeExists(taskCode: string, user: UserEntity): Promise<boolean>;
  remove(id: string, user: UserEntity): Promise<void>;
}

import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { TaskEntity } from '@core/domain/entities/tasks/task.entity';
import { Injectable, Logger } from '@nestjs/common';
import { CreateTaskUseCase } from '@usecases/tasks/create-task.usecase';
import { DeleteTaskUseCase } from '@usecases/tasks/delete-task.usecase';
import { GetTaskListUseCase } from '@usecases/tasks/get-task-list.usecase';
import { GetTaskUseCase } from '@usecases/tasks/get-task.usecase';
import { UpdateTaskUseCase } from '@usecases/tasks/update-task.usecase';
import { TaskStatus } from '../../shared/enums/task-status.enum';
import { TaskDto } from './dto/task.dto';
import { TasksFilterDto } from './dto/tasks-filter.dto';

@Injectable()
export class TasksService {
  private logger = new Logger('TaskService', { timestamp: true });

  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly getTaskListUseCase: GetTaskListUseCase,
    private readonly getTaskUseCase: GetTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
  ) {}

  async create(createTaskDto: TaskDto, user: UserEntity): Promise<TaskEntity> {
    return await this.createTaskUseCase.execute(createTaskDto, user);
  }

  async findAll(
    tasksFilterDto: TasksFilterDto,
    user: UserEntity,
  ): Promise<TaskEntity[]> {
    return await this.getTaskListUseCase.execute(tasksFilterDto, user);
  }

  async findOne(id: string, user: UserEntity): Promise<TaskEntity> {
    return await this.getTaskUseCase.execute(id, user);
  }

  async update(
    id: string,
    status: TaskStatus,
    user: UserEntity,
  ): Promise<TaskEntity> {
    return await this.updateTaskUseCase.execute(id, status, user);
  }

  async remove(id: string, user: UserEntity): Promise<void> {
    return await this.deleteTaskUseCase.execute(id, user);
  }
}

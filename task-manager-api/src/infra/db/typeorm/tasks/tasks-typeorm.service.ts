import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { TaskEntity } from '@core/domain/entities/tasks/task.entity';
import { TasksFilterDto } from '@dtos/tasks/tasks-filter.dto';
import { CustomException } from '@exceptions/custom.exception';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksBaseService } from '@services/tasks/tasks.service';
import { TaskStatus } from '@shared/enums/task-status.enum';
import { TaskDto } from '@tasks/dto/task.dto';

import { Equal, Repository } from 'typeorm';

export class TasksTypeOrmService implements TasksBaseService {
  private logger = new Logger('TasksTypeOrmService', { timestamp: true });
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async create(createTaskDto: TaskDto, user: UserEntity): Promise<TaskEntity> {
    const task = this.taskRepository.create({ ...createTaskDto, user });

    try {
      await this.taskRepository.save(task);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }

    return task;
  }

  async findAll(
    tasksFilterDto: TasksFilterDto,
    user: UserEntity,
  ): Promise<TaskEntity[]> {
    const { status, search } = tasksFilterDto;
    const query = this.taskRepository.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 seconds delay

    return await query.getMany();
  }

  async findOne(id: string, user: UserEntity): Promise<TaskEntity> {
    try {
      const task = await this.taskRepository.findOneBy({
        id: Equal(id),
        user: Equal(user.id),
      });

      if (!task) {
        throw new NotFoundException('Task not found!');
      } else {
        return task;
      }
    } catch (error) {
      this.logger.error(error);
      throw new CustomException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  async update(
    id: string,
    status: TaskStatus,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const task = await this.findOne(id, user);
    task.status = status;
    this.taskRepository.save(task);
    return task;
  }

  async remove(id: string, user: UserEntity): Promise<void> {
    try {
      const result = await this.taskRepository.delete({ id, user });

      if (result.affected === 0) {
        throw new NotFoundException('Task not found!');
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}

import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { TaskDto } from './dto/task.dto';
import { Task } from './entities/task.entity';
import { CustomException } from '@exceptions/custom.exception';
import { TaskStatus } from './task-status.enum';
import { TasksFilterDto } from './dto/tasks-filter.dto';
import { User } from '@auth/entities/user.entity';

@Injectable()
export class TasksService {
  private logger = new Logger('TaskService', { timestamp: true });

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: TaskDto, user: User): Promise<Task> {
    const task = this.taskRepository.create({ ...createTaskDto, user });

    try {
      await this.taskRepository.save(task);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }

    return task;
  }

  async findAll(tasksFilterDto: TasksFilterDto, user: User): Promise<Task[]> {
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

  async findOne(id: string, user: User): Promise<Task> {
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

  async update(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.findOne(id, user);
    task.status = status;
    this.taskRepository.save(task);
    return task;
  }

  async remove(id: string, user: User): Promise<void> {
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

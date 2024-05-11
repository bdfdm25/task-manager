import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskDto } from './dto/task.dto';
import { Task } from './entities/task.entity';
import { TasksFilterDto } from './dto/tasks-filter.dto';
import { NotFoundException } from '@nestjs/common';
import { Equal, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskStatus } from './task-status.enum';
import { User } from '@auth/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const task: Task = {
        id: 'task-id',
        title: 'Task 1',
        description: 'Description 1',
        status: TaskStatus.OPEN,
      };

      const createTaskDto: TaskDto = {
        title: 'Task 1',
        description: 'Description 1',
        status: TaskStatus.OPEN,
      };

      const user: User = {
        id: '6193e7a4-29d8-4876-b31a-2d598e2d1545',
        fullname: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password', await bcrypt.genSalt()),
      };

      const createSpy = jest
        .spyOn(taskRepository, 'create')
        .mockReturnValue(task);

      const saveSpy = jest
        .spyOn(taskRepository, 'save')
        .mockResolvedValueOnce(undefined);

      const result = await service.create(createTaskDto, user);

      expect(createSpy).toHaveBeenCalledWith({
        ...createTaskDto,
        user,
      });
      expect(saveSpy).toHaveBeenCalledWith(task);
      expect(result).toEqual(createTaskDto);
    });

    it('should throw an error if task creation fails', async () => {
      const task: Task = {
        id: 'task-id',
        title: 'Task 1',
        description: 'Description 1',
        status: TaskStatus.OPEN,
      };

      const createTaskDto: TaskDto = {
        title: 'Task 1',
        description: 'Description 1',
        status: TaskStatus.OPEN,
      };

      const user: User = {
        id: '6193e7a4-29d8-4876-b31a-2d598e2d1545',
        fullname: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password', await bcrypt.genSalt()),
      };

      jest.spyOn(taskRepository, 'create').mockReturnValue(task);

      jest.spyOn(taskRepository, 'save').mockRejectedValueOnce(new Error());

      await expect(service.create(createTaskDto, user)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const tasksFilterDto: TasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Task',
      };

      const user: User = {
        id: '6193e7a4-29d8-4876-b31a-2d598e2d1545',
        fullname: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password', await bcrypt.genSalt()),
      };

      const tasks: Task[] = [
        {
          id: 'task-id',
          title: 'Task 1',
          description: 'Description 1',
          status: TaskStatus.IN_PROGRESS,
          user,
        },
      ];

      const result = await service.findAll(tasksFilterDto, user);

      expect(taskRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(tasks);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const id = 'task-id';
      const task: Task = {
        id: 'task-id',
        title: 'Task 1',
        description: 'Description 1',
        status: TaskStatus.OPEN,
      };

      const user: User = {
        id: '6193e7a4-29d8-4876-b31a-2d598e2d1545',
        fullname: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password', await bcrypt.genSalt()),
      };

      jest.spyOn(taskRepository, 'findOneBy').mockResolvedValue(task);

      const result = await service.findOne(id, user);

      expect(taskRepository.findOneBy).toHaveBeenCalledWith({
        id: Equal(id),
        user: Equal(user.id),
      });
      expect(result).toEqual(task);
    });

    it('should throw a NotFoundException if task is not found', async () => {
      const id = 'task-id';
      const user: User = {
        id: '6193e7a4-29d8-4876-b31a-2d598e2d1545',
        fullname: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password', await bcrypt.genSalt()),
      };

      jest.spyOn(taskRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne(id, user)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a task status', async () => {
      const id = 'task-id';
      const status = TaskStatus.DONE;
      const user: User = {
        id: 'user-id',
        fullname: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password', await bcrypt.genSalt()),
      };
      const task: Task = {
        id,
        title: 'Task 1',
        description: 'Description 1',
        status: TaskStatus.IN_PROGRESS,
        user,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(task);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(undefined);

      const result = await service.update(id, status, user);

      expect(service.findOne).toHaveBeenCalledWith(id, user);
      expect(taskRepository.save).toHaveBeenCalledWith(task);
      expect(task.status).toEqual(status);
      expect(result).toEqual(task);
    });

    it('should throw a NotFoundException if task is not found', async () => {
      const id = 'task-id';
      const status = TaskStatus.DONE;
      const user: User = {
        id: 'user-id',
        fullname: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password', await bcrypt.genSalt()),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.update(id, status, user)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const id = 'task-id';
      const user: User = {
        id: 'user-id',
        fullname: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password', await bcrypt.genSalt()),
      };

      const deleteSpy = jest
        .spyOn(taskRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: null }); // Add the 'raw' property to the mockResolvedValue object

      await service.remove(id, user);

      expect(deleteSpy).toHaveBeenCalledWith({ id, user });
    });

    it('should throw a NotFoundException if task is not found', async () => {
      const id = 'task-id';
      const user: User = {
        id: 'user-id',
        fullname: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password', await bcrypt.genSalt()),
      };

      const deleteSpy = jest
        .spyOn(taskRepository, 'delete')
        .mockResolvedValue({ affected: 0, raw: null }); // Add the 'raw' property to the mockResolvedValue object

      await expect(service.remove(id, user)).rejects.toThrow(NotFoundException);
    });
  });
});

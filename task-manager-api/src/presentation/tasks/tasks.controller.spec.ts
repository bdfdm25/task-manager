import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskDto } from './dto/task.dto';
import { TasksFilterDto } from './dto/tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { TaskStatus } from '@shared/enums/task-status.enum';
import { TaskEntity } from '@core/domain/entities/tasks/task.entity';

const MOCK_USER: UserEntity = {
  fullname: 'John Doe',
  email: 'john.doe@example.com',
  password: 'JohnDoe1234',
};

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: TaskDto = {
        title: '',
        description: '',
        status: TaskStatus.OPEN,
      };

      const createdTask: TaskEntity = {
        id: '',
        title: '',
        description: '',
        status: TaskStatus.OPEN,
      };

      jest.spyOn(tasksService, 'create').mockResolvedValue(createdTask);

      const result = await controller.create(createTaskDto, MOCK_USER);

      expect(tasksService.create).toHaveBeenCalledWith(
        createTaskDto,
        MOCK_USER,
      );
      expect(result).toEqual(createdTask);
    });
  });

  describe('findAll', () => {
    it('should return a list of tasks', async () => {
      const tasksFilterDto: TasksFilterDto = {
        status: TaskStatus.OPEN,
        search: '',
      };

      const tasks: TaskEntity[] = [
        {
          id: '001',
          title: 'Task 001',
          description: 'task 001 description',
          status: TaskStatus.OPEN,
        },
        {
          id: '002',
          title: 'Task 002',
          description: 'task 002 description',
          status: TaskStatus.OPEN,
        },
      ];

      jest.spyOn(tasksService, 'findAll').mockResolvedValue(tasks);

      const result = await controller.findAll(tasksFilterDto, MOCK_USER);

      expect(tasksService.findAll).toHaveBeenCalledWith(
        tasksFilterDto,
        MOCK_USER,
      );
      expect(result).toEqual(tasks);
    });
  });

  describe('findOne', () => {
    it('should return a specific task by id', async () => {
      const id: string = 'task-id';

      const task: TaskEntity = {
        id: '001',
        title: 'Task 001',
        description: 'task 001 description',
        status: TaskStatus.OPEN,
      };

      jest.spyOn(tasksService, 'findOne').mockResolvedValue(task);

      const result = await controller.findOne(id, MOCK_USER);

      expect(tasksService.findOne).toHaveBeenCalledWith(id, MOCK_USER);
      expect(result).toEqual(task);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const id: string = '001';
      const taskStatus: UpdateTaskDto = {
        status: TaskStatus.OPEN,
      };

      const updatedTask: TaskEntity = {
        id: '001',
        title: 'Task 001',
        description: 'task 001 description',
        status: TaskStatus.OPEN,
      };

      jest.spyOn(tasksService, 'update').mockResolvedValue(updatedTask);

      const result = await controller.update(id, taskStatus, MOCK_USER);

      expect(tasksService.update).toHaveBeenCalledWith(
        id,
        taskStatus.status,
        MOCK_USER,
      );
      expect(result).toEqual(updatedTask);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const id: string = 'task-id';

      jest.spyOn(tasksService, 'remove').mockResolvedValue();

      const result = await controller.remove(id, MOCK_USER);

      expect(tasksService.remove).toHaveBeenCalledWith(id, MOCK_USER);
      expect(result).toBeUndefined();
    });
  });
});

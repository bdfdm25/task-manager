// tasks.service.spec.ts
import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { TaskEntity } from '@core/domain/entities/tasks/task.entity';
import { TaskStatus } from '@shared/enums/task-status.enum';
import { TaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service';
import { TasksFilterDto } from '@dtos/tasks/tasks-filter.dto';

const MOCK_USER: UserEntity = {
  fullname: 'John Doe',
  email: 'john.doe@example.com',
  password: 'JohnDoe1234',
};

const MOCK_TASK: TaskEntity = {
  id: '001',
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.OPEN,
  user: MOCK_USER,
};

const MOCK_TASK_LIST: TaskEntity[] = [
  {
    id: '001',
    title: 'Test Task 1',
    description: 'Test Description 1',
    status: TaskStatus.OPEN,
    user: MOCK_USER,
  },
  {
    id: '002',
    title: 'Test Task 2',
    description: 'Test Description 2',
    status: TaskStatus.IN_PROGRESS,
    user: MOCK_USER,
  },
];

describe('TasksService', () => {
  let tasksService: TasksService;
  let mockCreateTaskUseCase;
  let mockDeleteTaskUseCase;
  let mockGetTaskListUseCase;
  let mockGetTaskUseCase;
  let mockUpdateTaskUseCase;

  beforeEach(() => {
    mockCreateTaskUseCase = { execute: jest.fn() };
    mockDeleteTaskUseCase = { execute: jest.fn() };
    mockGetTaskListUseCase = { execute: jest.fn() };
    mockGetTaskUseCase = { execute: jest.fn() };
    mockUpdateTaskUseCase = { execute: jest.fn() };

    tasksService = new TasksService(
      mockCreateTaskUseCase,
      mockDeleteTaskUseCase,
      mockGetTaskListUseCase,
      mockGetTaskUseCase,
      mockUpdateTaskUseCase,
    );
  });

  it('should create a task', async () => {
    const taskDto: TaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.OPEN,
    };

    jest.spyOn(mockCreateTaskUseCase, 'execute').mockResolvedValue(MOCK_TASK);

    const result = await tasksService.create(taskDto, MOCK_USER);

    expect(result).toEqual(MOCK_TASK);
    expect(mockCreateTaskUseCase.execute).toHaveBeenCalledWith(
      taskDto,
      MOCK_USER,
    );
  });

  it('should find all tasks', async () => {
    const tasksFilterDto: TasksFilterDto = {
      status: TaskStatus.OPEN,
      search: 'Test',
    };

    jest
      .spyOn(mockGetTaskListUseCase, 'execute')
      .mockResolvedValue(MOCK_TASK_LIST);

    const result = await tasksService.findAll(tasksFilterDto, MOCK_USER);

    expect(result).toEqual(MOCK_TASK_LIST);
    expect(mockGetTaskListUseCase.execute).toHaveBeenCalledWith(
      tasksFilterDto,
      MOCK_USER,
    );
  });

  it('should find one task', async () => {
    const id = '001';

    mockGetTaskUseCase.execute.mockResolvedValue(MOCK_TASK);
    const result = await tasksService.findOne(id, MOCK_USER);

    expect(result).toEqual(MOCK_TASK);
    expect(mockGetTaskUseCase.execute).toHaveBeenCalledWith(id, MOCK_USER);
  });

  it('should update a task', async () => {
    const id = '001';
    const status = TaskStatus.DONE;

    const UPDATED_TASK: TaskEntity = {
      id: '001',
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.DONE,
      user: MOCK_USER,
    };

    jest
      .spyOn(mockUpdateTaskUseCase, 'execute')
      .mockResolvedValue(UPDATED_TASK);
    mockUpdateTaskUseCase.execute.mockResolvedValue(UPDATED_TASK);
    const result = await tasksService.update(id, status, MOCK_USER);

    expect(result).toEqual(UPDATED_TASK);
    expect(mockUpdateTaskUseCase.execute).toHaveBeenCalledWith(
      id,
      status,
      MOCK_USER,
    );
  });

  it('should remove a task', async () => {
    const id = '001';

    jest.spyOn(mockDeleteTaskUseCase, 'execute');
    await tasksService.remove(id, MOCK_USER);
    expect(mockDeleteTaskUseCase.execute).toHaveBeenCalledWith(id, MOCK_USER);
  });
});

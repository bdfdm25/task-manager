// create-task.usecase.spec.ts

import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { TaskEntity } from '@core/domain/entities/tasks/task.entity';
import { TaskDto } from '@dtos/tasks/task.dto';
import { TaskStatus } from '@shared/enums/task-status.enum';
import { CreateTaskUseCase } from './create-task.usecase';

describe('CreateTaskUseCase', () => {
  let createTaskUseCase: CreateTaskUseCase;
  let mockService;

  beforeEach(() => {
    mockService = { create: jest.fn() };
    createTaskUseCase = new CreateTaskUseCase(mockService);
  });

  it('should call the service create method with the provided dto and user', async () => {
    const dto: TaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.OPEN,
    };
    const user: UserEntity = {
      id: 1,
      email: 'test@test.com',
      password: 'password',
      fullname: '',
    };
    const task: TaskEntity = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      user,
      status: TaskStatus.OPEN,
    };

    mockService.create.mockResolvedValue(task);
    const result = await createTaskUseCase.execute(dto, user);

    expect(result).toEqual(task);
    expect(mockService.create).toHaveBeenCalledWith(dto, user);
  });
});

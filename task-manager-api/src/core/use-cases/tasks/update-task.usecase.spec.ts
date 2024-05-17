// update-task.usecase.spec.ts
import { UpdateTaskUseCase } from './update-task.usecase';
import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { TaskEntity } from '@core/domain/entities/tasks/task.entity';
import { TaskStatus } from '@shared/enums/task-status.enum';

describe('UpdateTaskUseCase', () => {
  let updateTaskUseCase: UpdateTaskUseCase;
  let mockService;

  beforeEach(() => {
    mockService = { update: jest.fn() };
    updateTaskUseCase = new UpdateTaskUseCase(mockService);
  });

  it('should call the service update method with the provided url, status, and user', async () => {
    const url = '1';
    const status = TaskStatus.DONE;
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
      status,
      user,
    };

    mockService.update.mockResolvedValue(task);
    const result = await updateTaskUseCase.execute(url, status, user);

    expect(result).toEqual(task);
    expect(mockService.update).toHaveBeenCalledWith(url, status, user);
  });
});

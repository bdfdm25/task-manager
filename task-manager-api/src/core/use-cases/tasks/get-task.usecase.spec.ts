// get-task.usecase.spec.ts
import { GetTaskUseCase } from './get-task.usecase';
import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { TaskEntity } from '@core/domain/entities/tasks/task.entity';
import { TaskStatus } from '@shared/enums/task-status.enum';

describe('GetTaskUseCase', () => {
  let getTaskUseCase: GetTaskUseCase;
  let mockService;

  beforeEach(() => {
    mockService = { findOne: jest.fn() };
    getTaskUseCase = new GetTaskUseCase(mockService);
  });

  it('should call the service findOne method with the provided id and user', async () => {
    const id = '1';
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

    mockService.findOne.mockResolvedValue(task);
    const result = await getTaskUseCase.execute(id, user);

    expect(result).toEqual(task);
    expect(mockService.findOne).toHaveBeenCalledWith(id, user);
  });
});

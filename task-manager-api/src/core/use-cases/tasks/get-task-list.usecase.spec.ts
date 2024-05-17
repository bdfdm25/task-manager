// get-task-list.usecase.spec.ts
import { GetTaskListUseCase } from './get-task-list.usecase';
import { TasksFilterDto } from '@dtos/tasks/tasks-filter.dto';
import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { TaskEntity } from '@core/domain/entities/tasks/task.entity';
import { TaskStatus } from '@shared/enums/task-status.enum';

describe('GetTaskListUseCase', () => {
  let getTaskListUseCase: GetTaskListUseCase;
  let mockService;

  beforeEach(() => {
    mockService = { findAll: jest.fn() };
    getTaskListUseCase = new GetTaskListUseCase(mockService);
  });

  it('should call the service findAll method with the provided dto and user', async () => {
    const dto: TasksFilterDto = { status: TaskStatus.OPEN, search: 'Test' };
    const user: UserEntity = {
      id: 1,
      email: 'test@test.com',
      password: 'password',
      fullname: '',
    };
    const tasks: TaskEntity[] = [
      {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        user,
        status: TaskStatus.OPEN,
      },
    ];

    mockService.findAll.mockResolvedValue(tasks);
    const result = await getTaskListUseCase.execute(dto, user);

    expect(result).toEqual(tasks);
    expect(mockService.findAll).toHaveBeenCalledWith(dto, user);
  });
});

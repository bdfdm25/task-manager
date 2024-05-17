// delete-task.usecase.spec.ts
import { MOCK_USER_ENTITY } from '@usecases/mocks/user.mock';
import { DeleteTaskUseCase } from './delete-task.usecase';

describe('DeleteTaskUseCase', () => {
  let deleteTaskUseCase: DeleteTaskUseCase;
  let mockService;

  beforeEach(() => {
    mockService = { remove: jest.fn() };
    deleteTaskUseCase = new DeleteTaskUseCase(mockService);
  });

  it('should call the service remove method with the provided id and user', async () => {
    const id = '1';

    await deleteTaskUseCase.execute(id, MOCK_USER_ENTITY);

    expect(mockService.remove).toHaveBeenCalledWith(id, MOCK_USER_ENTITY);
  });
});

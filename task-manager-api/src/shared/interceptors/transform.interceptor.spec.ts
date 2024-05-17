// transform.interceptor.spec.ts
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { TransformInterceptor } from './transform.interceptor';

describe('TransformInterceptor', () => {
  let transformInterceptor: TransformInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(() => {
    transformInterceptor = new TransformInterceptor();
    mockExecutionContext = {} as ExecutionContext;
    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of({ prop: 'value' })),
    } as CallHandler;
  });

  it('should transform instance to plain object', () => {
    const result = transformInterceptor.intercept(
      mockExecutionContext,
      mockCallHandler,
    );

    result.subscribe((data) => {
      expect(data).toEqual({ prop: 'value' });
    });

    expect(mockCallHandler.handle).toHaveBeenCalled();
  });
});

import { TaskEntity } from '@core/domain/entities/tasks/task.entity';
import { TaskSchema } from '@infra/db/typeorm/tasks/task.schema';
import { TasksTypeOrmService } from '@infra/db/typeorm/tasks/tasks-typeorm.service';
import { Module } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@presentation/auth/auth.module';
import { TasksBaseService } from '@services/tasks/tasks.service';
import { CreateTaskUseCase } from '@usecases/tasks/create-task.usecase';
import { DeleteTaskUseCase } from '@usecases/tasks/delete-task.usecase';
import { GetTaskListUseCase } from '@usecases/tasks/get-task-list.usecase';
import { GetTaskUseCase } from '@usecases/tasks/get-task.usecase';
import { UpdateTaskUseCase } from '@usecases/tasks/update-task.usecase';
import { DataSource } from 'typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([TaskSchema])],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: TasksTypeOrmService,
      useFactory: (dataSource: DataSource) => {
        return new TasksTypeOrmService(dataSource.getRepository(TaskEntity));
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: CreateTaskUseCase,
      useFactory: (service: TasksBaseService) => {
        return new CreateTaskUseCase(service);
      },
      inject: [TasksTypeOrmService],
    },
    {
      provide: DeleteTaskUseCase,
      useFactory: (service: TasksBaseService) => {
        return new DeleteTaskUseCase(service);
      },
      inject: [TasksTypeOrmService],
    },
    {
      provide: GetTaskListUseCase,
      useFactory: (service: TasksBaseService) => {
        return new GetTaskListUseCase(service);
      },
      inject: [TasksTypeOrmService],
    },
    {
      provide: GetTaskUseCase,
      useFactory: (service: TasksBaseService) => {
        return new GetTaskUseCase(service);
      },
      inject: [TasksTypeOrmService],
    },
    {
      provide: UpdateTaskUseCase,
      useFactory: (service: TasksBaseService) => {
        return new UpdateTaskUseCase(service);
      },
      inject: [TasksTypeOrmService],
    },
  ],
})
export class TasksModule {}

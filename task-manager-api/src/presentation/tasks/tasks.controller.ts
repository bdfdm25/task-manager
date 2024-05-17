import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TaskDto } from './dto/task.dto';
import { TasksFilterDto } from './dto/tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { TaskEntity } from '@core/domain/entities/tasks/task.entity';
import { GetUser } from '@decorators/get-user.decorator';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'New Task created',
    type: TaskDto,
  })
  @ApiBody({
    description: 'Data to create a new task',
    type: TaskDto,
  })
  create(
    @Body() createTaskDto: TaskDto,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity> {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  @ApiOkResponse({
    description: 'List of tasks',
    type: TaskDto,
    isArray: true,
  })
  findAll(
    @Query(ValidationPipe) tasksFilterDto: TasksFilterDto,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity[]> {
    return this.tasksService.findAll(tasksFilterDto, user);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'A specific task by id',
    type: TaskDto,
  })
  findOne(@Param('id') id: string, @GetUser() user: UserEntity) {
    return this.tasksService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() taskStatus: UpdateTaskDto,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity> {
    return this.tasksService.update(id, taskStatus.status, user);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Task deleted',
  })
  remove(@Param('id') id: string, @GetUser() user: UserEntity) {
    return this.tasksService.remove(id, user);
  }
}

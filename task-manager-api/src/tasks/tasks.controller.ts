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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksFilterDto } from './dto/tasks-filter.dto';
import { AuthGuard } from '@nestjs/passport';

import { User } from '@auth/entities/user.entity';
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
  create(@Body() createTaskDto: TaskDto, @GetUser() user: User): Promise<Task> {
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
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.findAll(tasksFilterDto, user);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'A specific task by id',
    type: TaskDto,
  })
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.tasksService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() taskStatus: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.update(id, taskStatus.status, user);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Task deleted',
  })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.tasksService.remove(id, user);
  }
}

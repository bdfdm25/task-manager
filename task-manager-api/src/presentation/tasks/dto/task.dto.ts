import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../../shared/enums/task-status.enum';
import { IsEnum, IsString } from 'class-validator';

export class TaskDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

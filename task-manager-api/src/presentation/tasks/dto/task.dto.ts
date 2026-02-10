import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../../shared/enums/task-status.enum';
import { TaskPriority } from '../../../shared/enums/task-priority.enum';
import { TaskCategory } from '../../../shared/enums/task-category.enum';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class TaskDto {
  @ApiProperty({ example: 'TASK-001', description: 'Unique task code' })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[A-Z]+-\d+$/, {
    message:
      'Task code must follow the pattern: PREFIX-NUMBER (e.g., TASK-001)',
  })
  taskCode: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @ApiProperty()
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({ enum: TaskStatus })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({ enum: TaskPriority, required: false })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({ enum: TaskCategory, required: false })
  @IsOptional()
  @IsEnum(TaskCategory)
  category?: TaskCategory;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  assignedTo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(1000)
  estimatedHours?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  deadline?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9\s]+(,\s*[a-zA-Z0-9\s]+)*$/, {
    message: 'Tags must be comma-separated alphanumeric values',
  })
  tags?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  notifyOnCompletion?: boolean;
}

import { IsEnum, IsString, IsOptional, IsUUID } from 'class-validator';
import { IssuePriority } from '../entities/issue-priority.enum';

export class UpdateIssueDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(IssuePriority)
  priority?: IssuePriority;

  @IsOptional()
  @IsUUID()
  assignedManagerId?: string;
}


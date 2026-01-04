import { IsEnum, IsString, IsArray, IsUUID, IsOptional } from 'class-validator';
import { IssueCategory } from '../entities/issue.entity';
import { IssuePriority } from '../entities/issue-priority.enum';

export class CreateIssueDto {
  @IsEnum(IssueCategory)
  category: IssueCategory;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];

  @IsUUID()
  apartmentId: string;

  @IsOptional()
  @IsEnum(IssuePriority)
  priority?: IssuePriority;
}



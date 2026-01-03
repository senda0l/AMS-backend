import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { IssueStatus } from '../entities/issue-status.enum';

export class UpdateIssueStatusDto {
  @IsEnum(IssueStatus)
  status: IssueStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  assignedManagerId?: string;
}



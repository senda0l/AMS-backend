import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateEntranceDto {
  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsUUID()
  buildingId?: string;
}


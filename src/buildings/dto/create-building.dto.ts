import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateBuildingDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsUUID()
  managerId?: string;
}



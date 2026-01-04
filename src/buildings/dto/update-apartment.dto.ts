import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateApartmentDto {
  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsUUID()
  entranceId?: string;
}


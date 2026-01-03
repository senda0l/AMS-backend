import { IsString, IsUUID } from 'class-validator';

export class CreateEntranceDto {
  @IsString()
  number: string;

  @IsUUID()
  buildingId: string;
}



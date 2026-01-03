import { IsString, IsUUID } from 'class-validator';

export class CreateApartmentDto {
  @IsString()
  number: string;

  @IsUUID()
  entranceId: string;
}



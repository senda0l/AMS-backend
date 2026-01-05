import { IsString, MinLength, IsUUID, IsOptional } from 'class-validator';

export class CompleteRegistrationDto {
  @IsString()
  token: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(6)
  password: string;
}


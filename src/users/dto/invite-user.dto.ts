import { IsEmail, IsUUID, IsOptional } from 'class-validator';

export class InviteUserDto {
  @IsEmail()
  email: string;

  @IsUUID()
  roleId: string;

  @IsOptional()
  @IsUUID()
  apartmentId?: string;
}


import { IsString, MinLength } from 'class-validator';

export class CreateAuthAdminDto {
  @IsString()
  @MinLength(3)
  user: string;

  @IsString()
  @MinLength(6)
  password: string;
}

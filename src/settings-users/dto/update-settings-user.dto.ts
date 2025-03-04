import { IsString } from 'class-validator';

export class UpdateSettingsUserDto {
  @IsString()
  name: string;
}

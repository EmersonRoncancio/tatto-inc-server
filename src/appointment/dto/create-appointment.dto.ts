import { IsString, MinLength } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @MinLength(3)
  message: string;
}

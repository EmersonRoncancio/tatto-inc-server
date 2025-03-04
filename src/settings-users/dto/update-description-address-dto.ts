import { IsOptional, IsString } from 'class-validator';

export class UpdateTattooArtistDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  specialty: string;

  @IsString()
  @IsOptional()
  experience: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  numberPhone: string;

  @IsString()
  @IsOptional()
  schedule: string;
}

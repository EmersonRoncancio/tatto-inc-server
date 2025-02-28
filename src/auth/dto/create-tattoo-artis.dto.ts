import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTattooArtistDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  specialty: string;

  @IsString()
  @MinLength(3)
  expereince: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  instagram: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  facebook: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  twitter: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  tiktok: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  address: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  description: string;
}

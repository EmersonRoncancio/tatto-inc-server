import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTattooArtistDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  specialty: string;

  @IsString()
  @MinLength(3)
  experience: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsString()
  @MinLength(3)
  address: string;

  @IsString()
  @MinLength(3)
  description: string;

  @IsString()
  @MinLength(3)
  instagram: string;

  @IsString()
  @MinLength(3)
  facebook: string;
}

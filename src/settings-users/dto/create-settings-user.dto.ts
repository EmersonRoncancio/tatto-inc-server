import { IsOptional, IsString, MinLength } from 'class-validator';

export class SocialNetworksDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  facebook: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  instagram: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  twitter: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  tiktok: string;
}

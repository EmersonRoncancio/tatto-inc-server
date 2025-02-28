import { IsOptional, IsString } from 'class-validator';

export class SocialNetworksDto {
  @IsString()
  @IsOptional()
  facebook: string;

  @IsString()
  @IsOptional()
  instagram: string;

  @IsString()
  @IsOptional()
  twitter: string;

  @IsString()
  @IsOptional()
  tiktok: string;
}

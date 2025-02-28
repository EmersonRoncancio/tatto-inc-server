import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateDescriptionAddressDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  description: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  address: string;
}

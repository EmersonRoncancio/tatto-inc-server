import { IsOptional, IsString } from 'class-validator';

export class UpdateDescriptionAddressDto {
  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  numberPhone: string;
}

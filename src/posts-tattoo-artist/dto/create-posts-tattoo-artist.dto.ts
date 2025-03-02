import { IsString } from 'class-validator';

export class CreatePostsTattooArtistDto {
  @IsString()
  descritpion: string;
}

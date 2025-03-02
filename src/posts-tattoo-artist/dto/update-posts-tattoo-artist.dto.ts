import { PartialType } from '@nestjs/mapped-types';
import { CreatePostsTattooArtistDto } from './create-posts-tattoo-artist.dto';

export class UpdatePostsTattooArtistDto extends PartialType(
  CreatePostsTattooArtistDto,
) {}

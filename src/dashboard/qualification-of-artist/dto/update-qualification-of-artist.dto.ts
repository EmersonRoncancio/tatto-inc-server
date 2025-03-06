import { PartialType } from '@nestjs/mapped-types';
import { CreateQualificationOfArtistDto } from './create-qualification-of-artist.dto';

export class UpdateQualificationOfArtistDto extends PartialType(CreateQualificationOfArtistDto) {}

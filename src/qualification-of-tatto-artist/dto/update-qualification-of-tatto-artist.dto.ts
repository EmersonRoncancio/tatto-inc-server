import { PartialType } from '@nestjs/mapped-types';
import { CreateQualificationOfTattoArtistDto } from './create-qualification-of-tatto-artist.dto';

export class UpdateQualificationOfTattoArtistDto extends PartialType(CreateQualificationOfTattoArtistDto) {}

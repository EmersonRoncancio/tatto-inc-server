import { Controller } from '@nestjs/common';
import { QualificationOfTattoArtistService } from './qualification-of-tatto-artist.service';

@Controller('qualification-of-tatto-artist')
export class QualificationOfTattoArtistController {
  constructor(
    private readonly qualificationOfTattoArtistService: QualificationOfTattoArtistService,
  ) {}
}

import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { QualificationOfArtistService } from './qualification-of-artist.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('qualification-of-artist')
export class QualificationOfArtistController {
  constructor(
    private readonly qualificationOfArtistService: QualificationOfArtistService,
  ) {}

  @Get('get-qualification-artist')
  @UseGuards(AuthGuard())
  getQualificationArtist() {
    return this.qualificationOfArtistService.getQualificationArtist();
  }

  @Get('get-qualification-for-artist/:id')
  @UseGuards(AuthGuard())
  getQualificationForArtist(@Param('id') id: string) {
    return this.qualificationOfArtistService.getQualificationForArtist(id);
  }

  @Get('get-qualification-for-user/:id')
  @UseGuards(AuthGuard())
  getQualificationForUser(@Param('id') id: string) {
    return this.qualificationOfArtistService.getQualificationForUser(id);
  }

  @Delete('delete-qualification/:id')
  @UseGuards(AuthGuard())
  deleteQualification(@Param('id') id: string) {
    return this.qualificationOfArtistService.deleteQualification(id);
  }
}

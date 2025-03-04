import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { QualificationOfTattoArtistService } from './qualification-of-tatto-artist.service';
import { CreateQualificationOfTattoArtistDto } from './dto/create-qualification-of-tatto-artist.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { GetTattooArtistType, GetUserType } from './types/get-user.types';
import { UpdateQualificationOfTattoArtistDto } from './dto/update-qualification-of-tatto-artist.dto';

@Controller('qualification-of-tatto-artist')
export class QualificationOfTattoArtistController {
  constructor(
    private readonly qualificationOfTattoArtistService: QualificationOfTattoArtistService,
  ) {}

  @Post('create-qualification/:id')
  @UseGuards(AuthGuard())
  createQualificationOfTattooArtist(
    @Param('id') id: string,
    @Body() createQualificationDto: CreateQualificationOfTattoArtistDto,
    @GetUser() user: GetUserType | GetTattooArtistType,
  ) {
    if (user.type === 'tattooArtist')
      throw new BadRequestException(
        'Tattoo artist cannot create qualification',
      );

    return this.qualificationOfTattoArtistService.createQualificationOfTattoArtist(
      id,
      createQualificationDto,
      user,
    );
  }

  @Patch('update-qualification/:id')
  @UseGuards(AuthGuard())
  updatedQualificationOfTattooArtist(
    @Param('id') id: string,
    @GetUser() user: GetUserType | GetTattooArtistType,
    @Body() updateQualificationDto: UpdateQualificationOfTattoArtistDto,
  ) {
    if (user.type === 'tattooArtist')
      throw new BadRequestException(
        'Tattoo artist cannot update qualification',
      );
    return this.qualificationOfTattoArtistService.updatedQualificationOfTattooArtist(
      user,
      updateQualificationDto,
      id,
    );
  }

  @Get('get-find-calification/:id')
  getFindCalificationOfTattoArtist(@Param('id') id: string) {
    return this.qualificationOfTattoArtistService.getFindCalificationOfTattoArtist(
      id,
    );
  }
}

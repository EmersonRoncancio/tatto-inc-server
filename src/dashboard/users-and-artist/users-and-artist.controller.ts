import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersAndArtisService } from './users-and-artist.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users-and-artist')
export class UsersAndArtisController {
  constructor(private readonly usersAndArtisService: UsersAndArtisService) {}

  @Post('status-artist/:id')
  @UseGuards(AuthGuard())
  statusArtist(@Param('id') id: string) {
    return this.usersAndArtisService.statusArtist(id);
  }

  @Post('status-user/:id')
  @UseGuards(AuthGuard())
  statusUser(@Param('id') id: string) {
    return this.usersAndArtisService.statusUser(id);
  }

  @Get('get-users')
  @UseGuards(AuthGuard())
  getUsers() {
    return this.usersAndArtisService.getUsers();
  }

  @Get('get-artists')
  @UseGuards(AuthGuard())
  getArtists() {
    return this.usersAndArtisService.getArtists();
  }

  @Get('get-artists-inauthorized')
  @UseGuards(AuthGuard())
  getArtistsInauthorized() {
    return this.usersAndArtisService.getArtistsInauthorized();
  }

  @Get('get-length-data')
  @UseGuards(AuthGuard())
  getLengthData() {
    return this.usersAndArtisService.getLengthData();
  }

  @Delete('delete-artist/:id')
  @UseGuards(AuthGuard())
  deleteArtist(@Param('id') id: string) {
    return this.usersAndArtisService.deleteArtist(id);
  }
}

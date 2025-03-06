import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { PostsTattooArtistService } from './posts-tattoo-artist.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts-tattoo-artist-admin')
export class PostsTattooArtistController {
  constructor(
    private readonly postsTattooArtistService: PostsTattooArtistService,
  ) {}

  @Get('get-posts-artists')
  @UseGuards(AuthGuard())
  getPostsArtists() {
    return this.postsTattooArtistService.getPostsArtists();
  }

  @Get('get-posts-id/:id')
  @UseGuards(AuthGuard())
  getPostById(@Param('id') id: string) {
    return this.postsTattooArtistService.getPostById(id);
  }

  @Delete('delete-post/:id')
  @UseGuards(AuthGuard())
  deletePost(@Param('id') id: string) {
    return this.postsTattooArtistService.deletePost(id);
  }
}

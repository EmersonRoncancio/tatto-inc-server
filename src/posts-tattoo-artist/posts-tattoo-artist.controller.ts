import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsTattooArtistService } from './posts-tattoo-artist.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { GetTattooArtistType, GetUserType } from './types/get-user.types';
import { CreatePostsTattooArtistDto } from './dto/create-posts-tattoo-artist.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('posts-tattoo-artist')
export class PostsTattooArtistController {
  constructor(
    private readonly postsTsttooArtistService: PostsTattooArtistService,
  ) {}

  @Post('create-post')
  @UseGuards(AuthGuard())
  @UseInterceptors(FilesInterceptor('images'))
  createPost(
    @GetUser() user: GetTattooArtistType | GetUserType,
    @Body() descriptionDto: CreatePostsTattooArtistDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
        ],
      }),
    )
    images: Express.Multer.File[],
  ) {
    if (user.type === 'user') {
      throw new BadRequestException('User is not a tattoo artist');
    }

    return this.postsTsttooArtistService.createPost(
      user,
      images,
      descriptionDto,
    );
  }

  @Delete('delete-post/:id')
  @UseGuards(AuthGuard())
  deletePost(@Param('id') id: string) {
    return this.postsTsttooArtistService.deletePost(id);
  }

  @Get('get-posts-tattoo-artist/:id')
  getPostsTattooArtistById(@Param('id') id: string) {
    return this.postsTsttooArtistService.getPostsTattooArtistById(id);
  }

  @Get('get-find-posts')
  getFindPostsTattooArtist() {
    return this.postsTsttooArtistService.getFindPostsTattooArtist();
  }

  @Post('like-post/:id')
  @UseGuards(AuthGuard())
  likePost(@GetUser() user: GetUserType, @Param('id') id: string) {
    return this.postsTsttooArtistService.likePost(user, id);
  }

  @Post('unlike-post/:id')
  @UseGuards(AuthGuard())
  unlikePost(@GetUser() user: GetUserType, @Param('id') id: string) {
    return this.postsTsttooArtistService.unlikePost(user, id);
  }
}

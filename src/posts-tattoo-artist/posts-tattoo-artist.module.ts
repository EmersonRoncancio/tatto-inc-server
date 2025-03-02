import { Module } from '@nestjs/common';
import { PostsTattooArtistService } from './posts-tattoo-artist.service';
import { PostsTattooArtistController } from './posts-tattoo-artist.controller';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PostsTattooArtist,
  PostsTattooArtistSchema,
} from './entities/posts-tattoo-artist.entity';
import {
  TattooArtist,
  TattooArtistSchema,
} from 'src/auth/entities/tattoo-artist.entity';
import { User, UserSchema } from 'src/auth/entities/user.entity';

@Module({
  controllers: [PostsTattooArtistController],
  providers: [PostsTattooArtistService],
  imports: [
    CommonModule,
    AuthModule,
    MongooseModule.forFeature([
      {
        name: PostsTattooArtist.name,
        schema: PostsTattooArtistSchema,
      },
      {
        name: TattooArtist.name,
        schema: TattooArtistSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
})
export class PostsTattooArtistModule {}

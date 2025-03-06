import { Module } from '@nestjs/common';
import { PostsTattooArtistService } from './posts-tattoo-artist.service';
import { PostsTattooArtistController } from './posts-tattoo-artist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import {
  TattooArtist,
  TattooArtistSchema,
} from 'src/auth/entities/tattoo-artist.entity';
import {
  PostsTattooArtist,
  PostsTattooArtistSchema,
} from 'src/posts-tattoo-artist/entities/posts-tattoo-artist.entity';
import {
  QualificationOfTattoArtist,
  QualificationOfTattoArtistSchema,
} from 'src/qualification-of-tatto-artist/entities/qualification-of-tatto-artist.entity';
import { AuthAdminModule } from 'src/auth-admin/auth-admin.module';

@Module({
  controllers: [PostsTattooArtistController],
  providers: [PostsTattooArtistService],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: TattooArtist.name,
        schema: TattooArtistSchema,
      },
      {
        name: PostsTattooArtist.name,
        schema: PostsTattooArtistSchema,
      },
      {
        name: QualificationOfTattoArtist.name,
        schema: QualificationOfTattoArtistSchema,
      },
    ]),
    AuthAdminModule,
  ],
})
export class PostsTattooArtistModuleAdin {}

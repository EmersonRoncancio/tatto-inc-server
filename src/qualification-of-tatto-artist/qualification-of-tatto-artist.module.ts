import { Module } from '@nestjs/common';
import { QualificationOfTattoArtistService } from './qualification-of-tatto-artist.service';
import { QualificationOfTattoArtistController } from './qualification-of-tatto-artist.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QualificationOfTattoArtist,
  QualificationOfTattoArtistSchema,
} from './entities/qualification-of-tatto-artist.entity';
import {
  TattooArtist,
  TattooArtistSchema,
} from 'src/auth/entities/tattoo-artist.entity';
import { User, UserSchema } from 'src/auth/entities/user.entity';

@Module({
  controllers: [QualificationOfTattoArtistController],
  providers: [QualificationOfTattoArtistService],
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: QualificationOfTattoArtist.name,
        schema: QualificationOfTattoArtistSchema,
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
export class QualificationOfTattoArtistModule {}

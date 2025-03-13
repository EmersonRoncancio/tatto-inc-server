import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/configs/envs.configs';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import {
  TattooArtist,
  TattooArtistSchema,
} from './entities/tattoo-artist.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import {
  QualificationOfTattoArtist,
  QualificationOfTattoArtistSchema,
} from 'src/qualification-of-tatto-artist/entities/qualification-of-tatto-artist.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: envs.JWT_SECRET,
      signOptions: { expiresIn: '6h' },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TattooArtist.name, schema: TattooArtistSchema },
      {
        name: QualificationOfTattoArtist.name,
        schema: QualificationOfTattoArtistSchema,
      },
    ]),
  ],
  exports: [JwtModule, MongooseModule, JwtStrategy, PassportModule],
})
export class AuthModule {}

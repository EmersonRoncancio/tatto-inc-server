import { Module } from '@nestjs/common';
import { SettingsUsersService } from './settings-users.service';
import { SettingsUsersController } from './settings-users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import {
  TattooArtist,
  TattooArtistSchema,
} from 'src/auth/entities/tattoo-artist.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SettingsUsersController],
  providers: [SettingsUsersService],
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TattooArtist.name, schema: TattooArtistSchema },
    ]),
  ],
})
export class SettingsUsersModule {}

import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './configs/envs.configs';
import { SettingsUsersModule } from './settings-users/settings-users.module';
import { CommonModule } from './common/common.module';
import { PostsTattooArtistModule } from './posts-tattoo-artist/posts-tattoo-artist.module';
import { QualificationOfTattoArtistModule } from './qualification-of-tatto-artist/qualification-of-tatto-artist.module';
import { AuthAdminModule } from './auth-admin/auth-admin.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(envs.MONGO_DB_URL, {
      dbName: envs.DB_NAME,
    }),
    SettingsUsersModule,
    CommonModule,
    PostsTattooArtistModule,
    QualificationOfTattoArtistModule,
    AuthAdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

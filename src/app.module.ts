import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './configs/envs.configs';
import { SettingsUsersModule } from './settings-users/settings-users.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(envs.MONGO_DB_URL, {
      dbName: envs.DB_NAME,
    }),
    SettingsUsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

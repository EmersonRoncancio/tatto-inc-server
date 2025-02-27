import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './configs/envs.configs';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(envs.MONGO_DB_URL, {
      dbName: envs.DB_NAME,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

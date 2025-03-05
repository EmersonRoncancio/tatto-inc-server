import { Module } from '@nestjs/common';
import { UsersAndArtisService } from './users-and-artis.service';
import { UsersAndArtisController } from './users-and-artis.controller';

@Module({
  controllers: [UsersAndArtisController],
  providers: [UsersAndArtisService],
})
export class UsersAndArtisModule {}

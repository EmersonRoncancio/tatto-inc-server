import { Controller, Post } from '@nestjs/common';
import { UsersAndArtisService } from './users-and-artis.service';

@Controller('users-and-artis')
export class UsersAndArtisController {
  constructor(private readonly usersAndArtisService: UsersAndArtisService) {}
}

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateTattooArtistDto } from './dto/create-tattoo-artis.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-user')
  registerUser(@Body() CreateUserDto: CreateUserDto) {
    return this.authService.registerUser(CreateUserDto);
  }

  @Post('register-tattoo-artist')
  registerTattooArtist(@Body() CreateTattooArtistDto: CreateTattooArtistDto) {
    return this.authService.registerTattooArtist(CreateTattooArtistDto);
  }

  @Post('verify-email')
  verifyEmail(@Body('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}

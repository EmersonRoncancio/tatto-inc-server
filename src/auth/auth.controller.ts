import { Body, Controller, Post, Get, UseGuards, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateTattooArtistDto } from './dto/create-tattoo-artis.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/getUser.decorator';
import { TattooArtist } from './entities/tattoo-artist.entity';

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

  @Post('login')
  login(@Body() logindto: LoginDto) {
    return this.authService.login(logindto);
  }

  @Get('get-user')
  @UseGuards(AuthGuard())
  getUser(@GetUser() user: User | TattooArtist) {
    return user;
  }

  @Get('get-tattoo-artist/:id')
  @UseGuards(AuthGuard())
  getTattooArtist(@Param('id') id: string) {
    return this.authService.getTattooArtist(id);
  }

  @Get('get-find-tattoo-artist')
  getFindTattooArtist() {
    return this.authService.getFindTattooArtist();
  }
}

import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateTattooArtistDto } from './dto/create-tattoo-artis.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/getUser.decorator';
import { TattooArtist } from './entities/tattoo-artist.entity';
import { GetTattooArtistType, GetUserType } from './types/get-user.types';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-and-login-user')
  registerUser(@Body() CreateUserDto: CreateUserDto) {
    return this.authService.validateEmailRegisterUser(CreateUserDto);
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
  getTattooArtist(@Param('id') id: string) {
    return this.authService.getTattooArtist(id);
  }

  @Get('get-find-tattoo-artist')
  getFindTattooArtist() {
    return this.authService.getFindTattooArtist();
  }

  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Patch('reset-password')
  @UseGuards(AuthGuard())
  resetPassword(
    @Body() password: ResetPasswordDto,
    @GetUser() user: GetUserType | GetTattooArtistType,
  ) {
    return this.authService.resetPassword(password, user);
  }
}

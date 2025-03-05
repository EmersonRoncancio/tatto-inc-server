import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthAdminService } from './auth-admin.service';
import { CreateAuthAdminDto } from './dto/create-auth-admin.dto';
import { GetUser } from './decorators/getUser.decorator';
import { Admin } from './entities/auth-admin.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth-admin')
export class AuthAdminController {
  constructor(private readonly authAdminService: AuthAdminService) {}

  @Post('create-admin')
  createAdmin(@Body() createAdminDto: CreateAuthAdminDto) {
    return this.authAdminService.createAdmin(createAdminDto);
  }

  @Post('login-admin')
  loginAdmin(@Body() loginAdminDto: CreateAuthAdminDto) {
    return this.authAdminService.loginAdmin(loginAdminDto);
  }

  @Get('get-admin')
  @UseGuards(AuthGuard())
  getAdmin(@GetUser() user: Admin) {
    return user;
  }
}

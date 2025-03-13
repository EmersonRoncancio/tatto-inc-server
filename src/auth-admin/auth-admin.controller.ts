import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthAdminService } from './auth-admin.service';
import { CreateAuthAdminDto } from './dto/create-auth-admin.dto';
import { GetUser } from './decorators/getUser.decorator';
import { Admin } from './entities/auth-admin.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetAdminType } from './types/GetAdminType.type';

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

  @Get('get-admins')
  @UseGuards(AuthGuard())
  getAdmins(@GetUser() user: GetAdminType) {
    return this.authAdminService.getAdmins(user);
  }

  @Delete('delete-admin/:id')
  @UseGuards(AuthGuard())
  deleteAdmin(@GetUser() user: GetAdminType, @Param('id') id: string) {
    return this.authAdminService.deleteAdmin(user, id);
  }

  @Get('get-admin')
  @UseGuards(AuthGuard())
  getAdmin(@GetUser() user: Admin) {
    return user;
  }
}

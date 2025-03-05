import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthAdminDto } from './dto/create-auth-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './entities/auth-admin.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthAdminService {
  constructor(
    @InjectModel(Admin.name)
    private readonly authAdminModel: Model<Admin>,
    private readonly JwtService: JwtService,
  ) {}

  async createAdmin(createAdminDto: CreateAuthAdminDto) {
    const validateAdmin = await this.authAdminModel.findOne({
      email: createAdminDto.user,
    });

    if (validateAdmin) {
      throw new BadRequestException('Email registered in admin');
    }

    const admin = await this.authAdminModel.create({
      user: createAdminDto.user,
      password: bcrypt.hashSync(createAdminDto.password),
    });

    return admin;
  }

  async loginAdmin(createAdminDto: CreateAuthAdminDto) {
    const admin = await this.authAdminModel.findOne({
      user: createAdminDto.user,
    });

    if (!admin) {
      throw new BadRequestException('User not found');
    }

    if (!bcrypt.compareSync(createAdminDto.password, admin.password)) {
      throw new BadRequestException('Password incorrect');
    }

    return {
      user: admin,
      token: this.JwtService.sign({ user: admin.user }),
    };
  }
}

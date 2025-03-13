import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthAdminDto } from './dto/create-auth-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './entities/auth-admin.entity';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { GetAdminType } from './types/GetAdminType.type';

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

  async getAdmins(admin: GetAdminType) {
    return await this.authAdminModel
      .find({
        _id: { $ne: admin._id },
      })
      .select('-password');
  }

  async deleteAdmin(admin: GetAdminType, id: string) {
    if (admin.user !== 'firstAdmin') {
      throw new UnauthorizedException(
        'You do not have permission to delete administrators.',
      );
    }

    await this.authAdminModel.deleteOne({ _id: new Types.ObjectId(id) });

    return { message: 'Admin deleted' };
  }
}

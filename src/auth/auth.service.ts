import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateTattooArtistDto } from './dto/create-tattoo-artis.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { TattooArtist } from './entities/tattoo-artist.entity';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/configs/mailer.configs';
import { envs } from 'src/configs/envs.configs';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(TattooArtist.name)
    private readonly tattooArtistModel: Model<TattooArtist>,
    private readonly JwtService: JwtService,
  ) {}

  private async validateEmail(email: string) {
    const validateUser = await this.userModel.findOne({
      email,
    });
    if (validateUser) {
      throw new BadRequestException('Email registered in user');
    }

    const validateTattooArtist = await this.tattooArtistModel.findOne({
      email,
    });
    if (validateTattooArtist) {
      throw new BadRequestException('Email registered in tattoo artist');
    }
  }

  private async validateUsersOrTattooArtist(email: string) {
    const user = await this.userModel.findOne({ email });
    const tattooArtist = await this.tattooArtistModel.findOne({ email });

    if (!user && !tattooArtist) {
      return false;
    }

    if (user)
      return {
        user,
        type: 'user',
      };

    if (tattooArtist)
      return {
        tattooArtist,
        type: 'tattooArtist',
      };
  }

  async registerUser(createUserDto: CreateUserDto) {
    await this.validateEmail(createUserDto.email);
    const user = await this.userModel.create({
      ...createUserDto,
      password: bcrypt.hashSync(createUserDto.password, 8),
    });

    const tokenVerification = this.JwtService.sign({ email: user.email });

    const Mai = new MailService();
    const email = await Mai.sendMail(user, tokenVerification);

    return { user, email };
  }

  async registerTattooArtist(createTattooArtistDto: CreateTattooArtistDto) {
    await this.validateEmail(createTattooArtistDto.email);

    const tattooArtist = await this.tattooArtistModel.create({
      name: createTattooArtistDto.name,
      specialty: createTattooArtistDto.specialty,
      experience: createTattooArtistDto.experience,
      email: createTattooArtistDto.email,
      password: bcrypt.hashSync(createTattooArtistDto.password, 8),
      address: createTattooArtistDto.address,
      description: createTattooArtistDto.description,
      socialNetworks: {
        instagram: createTattooArtistDto.instagram,
        facebook: createTattooArtistDto.facebook,
      },
    });

    const tokenVerification = this.JwtService.sign({
      email: tattooArtist.email,
    });

    const Mai = new MailService();
    const email = await Mai.sendMailTattoArtist(
      tattooArtist,
      tokenVerification,
    );

    return { tattooArtist, email };
  }

  async verifyEmail(token: string) {
    try {
      const decoded: { email: string } = this.JwtService.verify(token, {
        secret: envs.JWT_SECRET,
      });

      const user = await this.validateUsersOrTattooArtist(decoded.email);
      if (user === false) {
        throw new BadRequestException('User not found');
      }

      if (user?.type === 'user') {
        await this.userModel.updateOne(
          { email: decoded.email },
          { isVerified: true },
        );
      }

      if (user?.type === 'tattooArtist') {
        await this.tattooArtistModel.updateOne(
          { email: decoded.email },
          { isVerified: true },
        );
      }

      return { message: 'Email verified' };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Invalid token');
    }
  }

  async login(logindto: LoginDto) {
    console.log(logindto);
    const user = await this.validateUsersOrTattooArtist(logindto.email);

    if (user === false) {
      throw new BadRequestException('User not found');
    }

    if (user?.type === 'user') {
      const validatePassword = bcrypt.compareSync(
        logindto.password,
        user.user?.password as string,
      );
      if (!validatePassword) {
        throw new BadRequestException('Invalid password');
      }

      if (!user.user?.isVerified) {
        throw new BadRequestException('Email not verified');
      }

      return { token: this.JwtService.sign({ email: user.user.email }) };
    }

    if (user?.type === 'tattooArtist') {
      const validatePassword = bcrypt.compareSync(
        logindto.password,
        user.tattooArtist?.password as string,
      );
      if (!validatePassword) {
        throw new BadRequestException('Invalid password');
      }

      if (!user.tattooArtist?.isVerified) {
        throw new BadRequestException('Email not verified');
      }

      if (user.tattooArtist?.authorizedArtist === false)
        throw new UnauthorizedException('Unauthorized artist');

      return {
        token: this.JwtService.sign({ email: user.tattooArtist.email }),
      };
    }
  }

  async getTattooArtist(id: string) {
    const artis = await this.tattooArtistModel.findById(id).select('-password');

    if (!artis) {
      throw new BadRequestException('Tattoo artist not found');
    }

    return artis;
  }

  async getFindTattooArtist() {
    return await this.tattooArtistModel.find().select('-password');
  }
}

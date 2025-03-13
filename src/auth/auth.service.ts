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
import { GetTattooArtistType, GetUserType } from './types/get-user.types';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { QualificationOfTattoArtist } from 'src/qualification-of-tatto-artist/entities/qualification-of-tatto-artist.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(TattooArtist.name)
    private readonly tattooArtistModel: Model<TattooArtist>,
    private readonly JwtService: JwtService,
    @InjectModel(QualificationOfTattoArtist.name)
    private readonly qualificationOfTattoArtistModel: Model<QualificationOfTattoArtist>,
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

  async validateEmailRegisterUser(createUserDto: CreateUserDto) {
    const tattooArtist = await this.tattooArtistModel.findOne({
      email: createUserDto.email,
    });
    if (tattooArtist) {
      throw new BadRequestException('Email registered in tattoo artist');
    }

    const user = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (user) {
      return await this.loginUser(createUserDto.email);
    } else {
      return await this.registerUserGoogle(createUserDto);
    }
  }

  async loginUser(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const token = this.JwtService.sign({ email: user.email });

    return {
      user: user,
      token: token,
    };
  }

  async registerUserGoogle(createUserDto: CreateUserDto) {
    if (!createUserDto.name) throw new BadRequestException('Name is required');
    await this.validateEmail(createUserDto.email);
    const user = await this.userModel.create({
      ...createUserDto,
    });

    const Mai = new MailService();
    await Mai.sendMailWelcome(user);

    const token = this.JwtService.sign({ email: user.email });

    return { user, token };
  }

  async registerUser(createUserDto: CreateUserDto) {
    if (!createUserDto.password)
      throw new BadRequestException('Password is required');

    await this.validateEmail(createUserDto.email);

    const user = await this.userModel.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: bcrypt.hashSync(createUserDto.password, 8),
    });

    const tokenVerification = this.JwtService.sign({
      email: user.email,
    });

    const Mai = new MailService();
    const email = await Mai.sendMailUser(user, tokenVerification);

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
    const user = await this.validateUsersOrTattooArtist(logindto.email);

    if (user === false) {
      throw new BadRequestException('User not found');
    }

    if (user?.type === 'user') {
      if (!user.user?.password) {
        throw new BadRequestException(
          'You must sign in using Google to continue',
        );
      }

      const validatePassword = bcrypt.compareSync(
        logindto.password,
        user.user?.password,
      );
      if (!validatePassword) {
        throw new BadRequestException('Invalid password');
      }

      if (!user.user?.isVerified) {
        throw new BadRequestException('Email not verified');
      }

      return {
        token: this.JwtService.sign({ email: user.user.email }),
      };
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
    const artis = await this.tattooArtistModel
      .findOne({
        _id: id,
        isVerified: true,
        authorizedArtist: true,
      })
      .select('-password');

    if (!artis) {
      throw new BadRequestException('Tattoo artist not found or not verified');
    }

    return artis;
  }

  async getFindTattooArtist() {
    const tattooArtist = await this.tattooArtistModel
      .find({
        isVerified: true,
        authorizedArtist: true,
      })
      .select('-password');

    const tatttoCalifications = await Promise.all(
      tattooArtist.map(async (tattooArtist) => {
        const califications = await this.qualificationOfTattoArtistModel.find({
          tattooArtist: tattooArtist.id,
        });

        const QualificationGlobal = califications.map((calification) => {
          return calification.qualification;
        });

        const averageQualification = parseFloat(
          (
            QualificationGlobal.reduce((a, b) => a + b, 0) /
            QualificationGlobal.length
          ).toFixed(1),
        );

        return {
          tattooArtist,
          califications: averageQualification ? averageQualification : 0,
        };
      }),
    );

    return tatttoCalifications;
  }

  async forgotPassword(email: string) {
    const user = await this.validateUsersOrTattooArtist(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const token = this.JwtService.sign({ email });

    const Mai = new MailService();
    if (user.type === 'tattooArtist' && user.tattooArtist)
      await Mai.sendMailResetPassword(user.tattooArtist, token);

    return { message: 'Email sent' };
  }

  async resetPassword(
    password: ResetPasswordDto,
    user: GetUserType | GetTattooArtistType,
  ) {
    if (user.type === 'tattooArtist') {
      await this.tattooArtistModel.updateOne(
        { email: user.user.email },
        { password: bcrypt.hashSync(password.password, 8) },
      );
    }

    return { message: 'Password updated' };
  }

  async validateUser(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async addPasswordUser(id: string, password: ResetPasswordDto) {
    const user = await this.userModel.findOneAndUpdate(
      { _id: id },
      { password: bcrypt.hashSync(password.password, 8) },
    );

    return { message: 'Password updated', ussr: user };
  }
}

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateTattooArtistDto } from './dto/create-tattoo-artis.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { TattooArtist } from './entities/tattoo-artist.entity';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/configs/mailer.configs';
import { envs } from 'src/configs/envs.configs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(TattooArtist.name)
    private readonly tattooArtistModel: Model<TattooArtist>,
    private readonly JwrService: JwtService,
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
        isUser: true,
        type: 'user',
      };

    if (tattooArtist)
      return {
        tattooArtist,
        isUser: false,
        type: 'tattooArtist',
      };
  }

  async registerUser(CreateUserDto: CreateUserDto) {
    await this.validateEmail(CreateUserDto.email);
    const user = await this.userModel.create(CreateUserDto);

    const tokenVerification = this.JwrService.sign({ email: user.email });

    const Mai = new MailService();
    const email = await Mai.sendMail(user, tokenVerification);

    return { user, email };
  }

  async registerTattooArtist(CreateTattooArtistDto: CreateTattooArtistDto) {
    await this.validateEmail(CreateTattooArtistDto.email);

    const tattooArtist = await this.tattooArtistModel.create(
      CreateTattooArtistDto,
    );

    const tokenVerification = this.JwrService.sign({
      email: tattooArtist.email,
    });

    const Mai = new MailService();
    const email = await Mai.sendMail(tattooArtist, tokenVerification);

    return { tattooArtist, email };
  }

  async verifyEmail(token: string) {
    try {
      const decoded: { email: string } = this.JwrService.verify(token, {
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
}

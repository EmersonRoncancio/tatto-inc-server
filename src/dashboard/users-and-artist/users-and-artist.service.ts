import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TattooArtist } from 'src/auth/entities/tattoo-artist.entity';
import { User } from 'src/auth/entities/user.entity';
import { MailService } from 'src/configs/mailer.configs';

@Injectable()
export class UsersAndArtisService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(TattooArtist.name)
    private readonly tattooArtistModel: Model<TattooArtist>,
  ) {}

  async statusUser(id: string) {
    if (Types.ObjectId.isValid(id) === false)
      throw new BadRequestException('Invalid ID');

    const userValidate = await this.userModel.findOne({ _id: id });

    if (!userValidate) {
      throw new BadRequestException('User not found');
    }

    const user = await this.userModel.findByIdAndUpdate(
      id,
      {
        isVerified: !userValidate.isVerified,
      },
      { new: true },
    );

    if (user?.isVerified === true) {
      const mail = new MailService();
      await mail.sendMailDisable(user);
    }

    return user;
  }

  async statusArtist(id: string) {
    if (Types.ObjectId.isValid(id) === false)
      throw new BadRequestException('Invalid ID');

    const tattooArtistValidate = await this.tattooArtistModel.findById(id);

    if (!tattooArtistValidate) {
      throw new BadRequestException('User not found');
    }

    const tattooArtist = await this.tattooArtistModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        authorizedArtist: !tattooArtistValidate.authorizedArtist,
      },
      { new: true },
    );

    const mail = new MailService();

    if (tattooArtist?.authorizedArtist === true) {
      await mail.senMailapprovedArtist(tattooArtist);
    } else {
      if (tattooArtist) await mail.sendMailDisable(tattooArtist);
    }

    return tattooArtist;
  }

  async getUsers() {
    return await this.userModel.find();
  }

  async getArtists() {
    return await this.tattooArtistModel.find();
  }

  getArtistsInauthorized() {
    return this.tattooArtistModel.find({ authorizedArtist: false });
  }
}

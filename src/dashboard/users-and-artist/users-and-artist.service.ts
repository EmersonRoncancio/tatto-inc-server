import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Admin } from 'src/auth-admin/entities/auth-admin.entity';
import { TattooArtist } from 'src/auth/entities/tattoo-artist.entity';
import { User } from 'src/auth/entities/user.entity';
import { MailService } from 'src/configs/mailer.configs';
import { PostsTattooArtist } from 'src/posts-tattoo-artist/entities/posts-tattoo-artist.entity';
import { QualificationOfTattoArtist } from 'src/qualification-of-tatto-artist/entities/qualification-of-tatto-artist.entity';

@Injectable()
export class UsersAndArtisService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(TattooArtist.name)
    private readonly tattooArtistModel: Model<TattooArtist>,
    @InjectModel(PostsTattooArtist.name)
    private readonly postsTattooArtistModel: Model<PostsTattooArtist>,
    @InjectModel(QualificationOfTattoArtist.name)
    private readonly qualificationOfTattoArtistModel: Model<QualificationOfTattoArtist>,
    @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>,
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

    if (user?.isVerified === false) {
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

  async getLengthData() {
    return {
      lengthUsers: await this.userModel.countDocuments(),
      lengthArtists: await this.tattooArtistModel.countDocuments(),
      lengthArtistsInauthorized: await this.tattooArtistModel.countDocuments({
        authorizedArtist: false,
      }),
      lengthPosts: await this.postsTattooArtistModel.countDocuments(),
      lengthQualification:
        await this.qualificationOfTattoArtistModel.countDocuments(),
      lengthAdmins: await this.adminModel.countDocuments(),
    };
  }

  async deleteArtist(id: string) {
    if (Types.ObjectId.isValid(id) === false)
      throw new BadRequestException('Invalid ID');

    const user = await this.tattooArtistModel.findByIdAndDelete(id);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const mail = new MailService();
    await mail.sendMailRejectedArtist(user);

    return user;
  }
}

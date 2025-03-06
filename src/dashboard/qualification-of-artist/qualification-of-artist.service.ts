import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TattooArtist } from 'src/auth/entities/tattoo-artist.entity';
import { User } from 'src/auth/entities/user.entity';
import { QualificationOfTattoArtist } from 'src/qualification-of-tatto-artist/entities/qualification-of-tatto-artist.entity';

@Injectable()
export class QualificationOfArtistService {
  constructor(
    @InjectModel(QualificationOfTattoArtist.name)
    private readonly qualificationOfArtistModel: Model<QualificationOfTattoArtist>,
    @InjectModel(TattooArtist.name)
    private readonly tattoArtistModel: Model<TattooArtist>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async getQualificationArtist() {
    return await this.qualificationOfArtistModel
      .find()
      .populate('tattooArtist')
      .populate('user')
      .select('-__v');
  }

  async getQualificationForArtist(id: string) {
    const validateArtist = await this.tattoArtistModel.findById(id);
    if (!validateArtist) {
      throw new BadRequestException('Artist not found');
    }

    const qualification = await this.qualificationOfArtistModel
      .find({ tattooArtist: id })
      .select('-__v')
      .populate('tattooArtist')
      .populate('user');

    return qualification;
  }

  async getQualificationForUser(id: string) {
    const validateUser = await this.userModel.findById(id);
    if (!validateUser) throw new BadRequestException('User not found');

    const qualification = await this.qualificationOfArtistModel
      .find({ user: new Types.ObjectId(id) })
      .select('-__v')
      .populate('tattooArtist')
      .populate('user');

    return qualification;
  }

  async deleteQualification(id: string) {
    const validateQualification =
      await this.qualificationOfArtistModel.findById(id);
    if (!validateQualification) {
      throw new BadRequestException('Qualification not found');
    }

    await this.qualificationOfArtistModel.deleteOne({ _id: id });

    return { message: 'Qualification deleted' };
  }
}

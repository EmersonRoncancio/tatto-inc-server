import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QualificationOfTattoArtist } from './entities/qualification-of-tatto-artist.entity';
import { Model } from 'mongoose';
import { TattooArtist } from 'src/auth/entities/tattoo-artist.entity';
import { CreateQualificationOfTattoArtistDto } from './dto/create-qualification-of-tatto-artist.dto';
import { GetUserType } from './types/get-user.types';
import { UpdateQualificationOfTattoArtistDto } from './dto/update-qualification-of-tatto-artist.dto';

@Injectable()
export class QualificationOfTattoArtistService {
  constructor(
    @InjectModel(QualificationOfTattoArtist.name)
    private readonly qualificationOfTattoArtistModel: Model<QualificationOfTattoArtist>,
    @InjectModel(TattooArtist.name)
    private readonly tattooArtistModel: Model<TattooArtist>,
  ) {}

  async createQualificationOfTattoArtist(
    idTattooArtist: string,
    createQualificationDto: CreateQualificationOfTattoArtistDto,
    user: GetUserType,
  ) {
    const tattooArtist = await this.tattooArtistModel.findById(idTattooArtist);
    if (!tattooArtist) throw new BadRequestException('Tattoo artist not found');

    const qualificationValidate =
      await this.qualificationOfTattoArtistModel.findOne({
        tattooArtist: idTattooArtist,
        user: user.user._id,
      });
    if (qualificationValidate) {
      throw new BadRequestException('User already qualified');
    }

    const qualificationOfTattoArtist =
      await this.qualificationOfTattoArtistModel.create({
        comment: createQualificationDto.comment,
        qualification: createQualificationDto.qualification,
        tattooArtist: idTattooArtist,
        user: user.user._id,
      });

    return qualificationOfTattoArtist;
  }

  async getFindCalificationOfTattoArtist(id: string) {
    const tattooArtist = await this.tattooArtistModel.findById(id);
    if (!tattooArtist) {
      throw new BadRequestException('Tattoo artist not found');
    }

    const califications = await this.qualificationOfTattoArtistModel
      .find({
        tattooArtist: id,
      })
      .select('-tattooArtist -user -__v');

    const QualificationGlonal = califications.map((calification) => {
      return calification.qualification;
    });

    const averageQualification =
      QualificationGlonal.reduce((a, b) => a + b, 0) /
      QualificationGlonal.length;

    return {
      Qualifications: califications,
      averageQualification,
    };
  }

  async updatedQualificationOfTattooArtist(
    user: GetUserType,
    updateQualificationDto: UpdateQualificationOfTattoArtistDto,
    idQualification: string,
  ) {
    const tattooArtist =
      await this.qualificationOfTattoArtistModel.findById(idQualification);
    if (!tattooArtist) {
      throw new BadRequestException('Qualification not found');
    }

    const updateQualification = await this.qualificationOfTattoArtistModel
      .findOneAndUpdate(
        { _id: idQualification, user: user.user._id },
        {
          comment: updateQualificationDto.comment,
          qualification: updateQualificationDto.qualification,
        },
        { new: true },
      )
      .select('-tattooArtist -user -__v');

    if (!updateQualification)
      throw new BadRequestException('Qualification not found');

    return updateQualification;
  }
}

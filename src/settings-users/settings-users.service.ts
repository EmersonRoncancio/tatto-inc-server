import { Injectable } from '@nestjs/common';
import { GetTattooArtistType, GetUserType } from './types/get-user.types';
import { InjectModel } from '@nestjs/mongoose';
import { TattooArtist } from 'src/auth/entities/tattoo-artist.entity';
import { Model, Types } from 'mongoose';
import { SocialNetworksDto } from './dto/create-settings-user.dto';
import { UpdateTattooArtistDto } from './dto/update-description-address-dto';
import { cloudinaryAdapter } from 'src/common/adapters/cloudinary.adapter';
import { User } from 'src/auth/entities/user.entity';
import { UpdateSettingsUserDto } from './dto/update-settings-user.dto';

@Injectable()
export class SettingsUsersService {
  constructor(
    @InjectModel(TattooArtist.name)
    private readonly tattoArtistModel: Model<TattooArtist>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async addSocialNetwork(
    getTattooArtistType: GetTattooArtistType,
    socialNetwork: SocialNetworksDto,
  ) {
    const tattooArtistSocialNetworks =
      await this.tattoArtistModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(getTattooArtistType.user._id as string),
        },
        {
          $set: Object.fromEntries(
            Object.entries(socialNetwork).map(([key, value]) => [
              `socialNetworks.${key}`,
              value,
            ]),
          ),
        },
        { new: true },
      );

    return tattooArtistSocialNetworks;
  }

  async updateDescriptionAddress(
    getTattooArtistType: GetTattooArtistType,
    updateUpdateTattooArtistDto: UpdateTattooArtistDto,
  ) {
    const tattooArtistSocialNetworks =
      await this.tattoArtistModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(getTattooArtistType.user._id as string),
        },
        {
          $set: {
            name: updateUpdateTattooArtistDto.name,
            experience: updateUpdateTattooArtistDto.experience,
            specialty: updateUpdateTattooArtistDto.specialty,
            description: updateUpdateTattooArtistDto.description,
            address: updateUpdateTattooArtistDto.address,
            numberPhone: updateUpdateTattooArtistDto.numberPhone,
            schedule: updateUpdateTattooArtistDto.schedule,
          },
        },
        { new: true },
      );

    return tattooArtistSocialNetworks;
  }

  async updatePhotoProfile(
    profilePhoto: Express.Multer.File,
    user: GetUserType | GetTattooArtistType,
  ) {
    if (user.type === 'user') {
      if (user.user?.photoPerfil) {
        await cloudinaryAdapter.deleteImage(
          user.user.photoPerfil.public_id.replace('&', '/'),
        );
      }

      const photo = await cloudinaryAdapter.uploadImageOne(
        profilePhoto,
        user.user._id as string,
      );

      const userPhoto = await this.userModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(user.user._id as string),
        },
        {
          $set: {
            photoPerfil: {
              url: photo.url,
              public_id: photo.public_id.replace('/', '&'),
            },
          },
        },
        { new: true },
      );

      return userPhoto;
    }

    if (user.type === 'tattooArtist') {
      if (user.user?.photoPerfil) {
        await cloudinaryAdapter.deleteImage(
          user.user.photoPerfil.public_id.replace('&', '/'),
        );
      }

      const photo = await cloudinaryAdapter.uploadImageOne(
        profilePhoto,
        user.user._id as string,
      );

      const tattooArtistPhoto = await this.tattoArtistModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(user.user._id as string),
        },
        {
          $set: {
            photoPerfil: {
              url: photo.url,
              public_id: photo.public_id.replace('/', '&'),
            },
          },
        },
        { new: true },
      );

      return tattooArtistPhoto;
    }
  }

  async updatebackgroundPhoto(
    backgroundPhoto: Express.Multer.File,
    user: GetUserType | GetTattooArtistType,
  ) {
    if (user.type === 'user') {
      if (user.user?.photoBackground) {
        await cloudinaryAdapter.deleteImage(
          user.user.photoBackground.public_id.replace('&', '/'),
        );
      }

      const photo = await cloudinaryAdapter.uploadImageOne(
        backgroundPhoto,
        user.user._id as string,
      );

      const userBackgroundPhoto = await this.userModel
        .findOneAndUpdate(
          {
            _id: new Types.ObjectId(user.user._id as string),
          },
          {
            $set: {
              photoBackground: {
                url: photo.url,
                public_id: photo.public_id.replace('/', '&'),
              },
            },
          },
          { new: true },
        )
        .select('-password');

      return userBackgroundPhoto;
    }

    if (user.type === 'tattooArtist') {
      if (user.user?.photoBackground) {
        await cloudinaryAdapter.deleteImage(
          user.user.photoBackground.public_id.replace('&', '/'),
        );
      }

      const photo = await cloudinaryAdapter.uploadImageOne(
        backgroundPhoto,
        user.user._id as string,
      );

      const tattooArtistPhoto = await this.tattoArtistModel
        .findOneAndUpdate(
          {
            _id: new Types.ObjectId(user.user._id as string),
          },
          {
            $set: {
              photoBackground: {
                url: photo.url,
                public_id: photo.public_id.replace('/', '&'),
              },
            },
          },
          { new: true },
        )
        .select('-password');

      return tattooArtistPhoto;
    }
  }

  async updateUser(
    user: GetUserType,
    updateSettingsUserDto: UpdateSettingsUserDto,
  ) {
    const userUpdated = await this.userModel.findOneAndUpdate(
      { _id: user.user._id as string },
      {
        $set: {
          name: updateSettingsUserDto?.name,
        },
      },
      { new: true },
    );

    return userUpdated;
  }
}

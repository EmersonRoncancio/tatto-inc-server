import { Injectable } from '@nestjs/common';
import { GetTattooArtistType } from './types/get-user.types';
import { InjectModel } from '@nestjs/mongoose';
import { TattooArtist } from 'src/auth/entities/tattoo-artist.entity';
import { Model, Types } from 'mongoose';
import { SocialNetworksDto } from './dto/create-settings-user.dto';
import { UpdateDescriptionAddressDto } from './dto/update-description-address-dto';

@Injectable()
export class SettingsUsersService {
  constructor(
    @InjectModel(TattooArtist.name)
    private readonly tattooArtistSocialNetworksModel: Model<TattooArtist>,
  ) {}

  async addSocialNetwork(
    getTattooArtistType: GetTattooArtistType,
    socialNetwork: SocialNetworksDto,
  ) {
    const tattooArtistSocialNetworks =
      await this.tattooArtistSocialNetworksModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(
            getTattooArtistType.tattooArtist._id as string,
          ),
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
    updateDescriptionAddressDto: UpdateDescriptionAddressDto,
  ) {
    const tattooArtistSocialNetworks =
      await this.tattooArtistSocialNetworksModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(
            getTattooArtistType.tattooArtist._id as string,
          ),
        },
        {
          $set: {
            description: updateDescriptionAddressDto.description,
            address: updateDescriptionAddressDto.address,
          },
        },
        { new: true },
      );

    return tattooArtistSocialNetworks;
  }
}

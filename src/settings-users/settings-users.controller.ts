import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SettingsUsersService } from './settings-users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { GetTattooArtistType, GetUserType } from './types/get-user.types';
import { SocialNetworksDto } from './dto/create-settings-user.dto';
import { UpdateDescriptionAddressDto } from './dto/update-description-address-dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('settings-users')
export class SettingsUsersController {
  constructor(private readonly settingsUsersService: SettingsUsersService) {}

  @Patch('add-social-network')
  @UseGuards(AuthGuard())
  addSocialNetwork(
    @GetUser() user: GetUserType | GetTattooArtistType,
    @Body() socialNetwork: SocialNetworksDto,
  ) {
    if (user.type === 'user') {
      throw new BadRequestException('User cannot add social network');
    }
    return this.settingsUsersService.addSocialNetwork(user, socialNetwork);
  }

  @Patch('update-description-address')
  @UseGuards(AuthGuard())
  updateDescriptionAddress(
    @GetUser() user: GetUserType | GetTattooArtistType,
    @Body() updateDescriptionAddressDto: UpdateDescriptionAddressDto,
  ) {
    if (user.type === 'user') {
      throw new BadRequestException(
        'User cannot update description and address',
      );
    }
    return this.settingsUsersService.updateDescriptionAddress(
      user,
      updateDescriptionAddressDto,
    );
  }

  @Post('update-photo-profile')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('profilePhoto'))
  updatePhotoProfile(
    @GetUser() user: GetUserType | GetTattooArtistType,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
        ],
      }),
    )
    photoProfile: Express.Multer.File,
  ) {
    return this.settingsUsersService.updatePhotoProfile(photoProfile, user);
  }
}

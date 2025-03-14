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
import { UpdateTattooArtistDto } from './dto/update-description-address-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateSettingsUserDto } from './dto/update-settings-user.dto';

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

  @Patch('update-tattoo-artist')
  @UseGuards(AuthGuard())
  updateDescriptionAddress(
    @GetUser() user: GetUserType | GetTattooArtistType,
    @Body() updateDescriptionAddressDto: UpdateTattooArtistDto,
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

  @Post('update-photo-background')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('backgroundPhoto'))
  updatePhotoBackground(
    @GetUser() user: GetUserType | GetTattooArtistType,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
        ],
      }),
    )
    backgroundPhoto: Express.Multer.File,
  ) {
    return this.settingsUsersService.updatebackgroundPhoto(
      backgroundPhoto,
      user,
    );
  }

  @Patch('update-user')
  @UseGuards(AuthGuard())
  updateUser(
    @GetUser() user: GetUserType | GetTattooArtistType,
    @Body() updateUserDto: UpdateSettingsUserDto,
  ) {
    if (user.type === 'tattooArtist')
      throw new BadRequestException('Tattoo artist cannot update user');

    return this.settingsUsersService.updateUser(user, updateUserDto);
  }
}

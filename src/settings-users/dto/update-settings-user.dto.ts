import { PartialType } from '@nestjs/mapped-types';
import { SocialNetworksDto } from './create-settings-user.dto';

export class UpdateSettingsUserDto extends PartialType(SocialNetworksDto) {}

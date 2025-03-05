import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersAndArtiDto } from './create-users-and-arti.dto';

export class UpdateUsersAndArtiDto extends PartialType(CreateUsersAndArtiDto) {}

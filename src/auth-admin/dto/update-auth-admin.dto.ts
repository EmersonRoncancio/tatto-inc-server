import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthAdminDto } from './create-auth-admin.dto';

export class UpdateAuthAdminDto extends PartialType(CreateAuthAdminDto) {}

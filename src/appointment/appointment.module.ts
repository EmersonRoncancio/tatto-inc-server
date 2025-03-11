import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationConfig } from '@nestjs/core';
import { AppointmentSchema } from './entities/appointment.entity';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import {
  TattooArtist,
  TattooArtistSchema,
} from 'src/auth/entities/tattoo-artist.entity';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService],
  imports: [
    CommonModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: ApplicationConfig.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema },
      { name: TattooArtist.name, schema: TattooArtistSchema },
    ]),
  ],
})
export class AppointmentModule {}

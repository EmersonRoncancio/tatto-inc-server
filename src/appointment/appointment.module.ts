import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from './entities/appointment.entity';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import {
  TattooArtist,
  TattooArtistSchema,
} from 'src/auth/entities/tattoo-artist.entity';
import {
  ConversationFlow,
  ConversationFlowSchema,
} from './entities/conversationFlow.entity';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService],
  imports: [
    CommonModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema },
      { name: TattooArtist.name, schema: TattooArtistSchema },
      { name: ConversationFlow.name, schema: ConversationFlowSchema },
    ]),
  ],
})
export class AppointmentModule {}

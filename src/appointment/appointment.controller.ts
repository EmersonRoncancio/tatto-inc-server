import { Body, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { GetTattooArtistType, GetUserType } from './types/get-user.type';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('shedule/:id')
  @UseGuards(AuthGuard())
  scheduleAppointment(
    @Param('id') id: string,
    @GetUser() user: GetUserType | GetTattooArtistType,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    if (user.type === 'tattooArtist')
      throw new Error('Tattoo artist cannot schedule appointment');

    return this.appointmentService.scheduleAppointment(
      id,
      user,
      createAppointmentDto,
    );
  }
}

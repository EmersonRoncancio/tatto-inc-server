import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { User } from 'src/auth/entities/user.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  @UseGuards(AuthGuard())
  scheduleAppointment(
    @Param('id') id: string,
    @GetUser() user: User,
    createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.appointmentService.scheduleAppointment(
      id,
      user,
      createAppointmentDto,
    );
  }
}

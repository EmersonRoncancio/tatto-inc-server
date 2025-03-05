import { Module } from '@nestjs/common';
import { AuthAdminService } from './auth-admin.service';
import { AuthAdminController } from './auth-admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AuthAdminSchema } from './entities/auth-admin.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/configs/envs.configs';
import { JwtStrategy } from './strategies/auth-admin.strategy';

@Module({
  controllers: [AuthAdminController],
  providers: [AuthAdminService, JwtStrategy],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt-admin' }),
    JwtModule.register({
      secret: envs.JWT_SECRET,
      signOptions: { expiresIn: '6h' },
    }),
    MongooseModule.forFeature([
      {
        name: Admin.name,
        schema: AuthAdminSchema,
      },
    ]),
  ],
  exports: [JwtModule, MongooseModule, JwtStrategy, PassportModule],
})
export class AuthAdminModule {}

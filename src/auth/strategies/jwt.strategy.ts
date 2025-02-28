import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { envs } from 'src/configs/envs.configs';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../entities/user.entity';
import { Model } from 'mongoose';
import { TattooArtist } from '../entities/tattoo-artist.entity';
import { payload } from '../types/payload.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(TattooArtist.name)
    private readonly tattooArtistModel: Model<TattooArtist>,
  ) {
    console.log(envs.JWT_SECRET);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.JWT_SECRET,
    });
  }

  private async validateUsersOrTattooArtist(email: string) {
    const user = await this.userModel.findOne({ email });
    const tattooArtist = await this.tattooArtistModel.findOne({ email });

    if (!user && !tattooArtist) {
      throw new UnauthorizedException();
    }

    if (user)
      return {
        user,
        type: 'user',
      };

    if (tattooArtist)
      return {
        tattooArtist,
        type: 'tattooArtist',
      };
  }

  async validate(payload: payload) {
    const user = await this.validateUsersOrTattooArtist(payload.email);

    return user;
  }
}

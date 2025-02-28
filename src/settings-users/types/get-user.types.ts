import { TattooArtist } from 'src/auth/entities/tattoo-artist.entity';
import { User } from 'src/auth/entities/user.entity';

export interface GetUserType {
  user: User;
  type: 'user';
}

export interface GetTattooArtistType {
  tattooArtist: TattooArtist;
  type: 'tattooArtist';
}

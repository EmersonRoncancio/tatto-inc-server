import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TattooArtist } from 'src/auth/entities/tattoo-artist.entity';
import { cloudinaryAdapter } from 'src/common/adapters/cloudinary.adapter';
import { PostsTattooArtist } from 'src/posts-tattoo-artist/entities/posts-tattoo-artist.entity';

@Injectable()
export class PostsTattooArtistService {
  constructor(
    @InjectModel(PostsTattooArtist.name)
    private readonly postsTattooArtistModel: Model<PostsTattooArtist>,
    @InjectModel(TattooArtist.name)
    private readonly tattooArtistModel: Model<TattooArtist>,
  ) {}

  async deletePost(id: string) {
    const validatePost = await this.postsTattooArtistModel.findById(id);
    if (!validatePost) {
      return { message: 'Post not found' };
    }

    const publics_id = validatePost.images.map((image) =>
      image.public_id.replace('&', '/'),
    );

    await cloudinaryAdapter.deleteImages(publics_id);

    await this.postsTattooArtistModel
      .findByIdAndDelete(id)
      .populate('TattooArtist');

    return { message: 'Post deleted' };
  }

  async getPostsArtists() {
    return await this.postsTattooArtistModel
      .find()
      .populate('TattooArtist')
      .select('-__v');
  }

  async getPostById(id: string) {
    const validateArtist = await this.tattooArtistModel.findById(id);

    if (!validateArtist) {
      throw new BadRequestException('Artist not found');
    }

    const post = await this.postsTattooArtistModel
      .find({
        TattooArtist: new Types.ObjectId(id),
      })
      .populate('TattooArtist')
      .select('-__v');

    return {
      tattooArtist: validateArtist,
      posts: post,
    };
  }
}

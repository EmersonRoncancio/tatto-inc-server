import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { cloudinaryAdapter } from 'src/common/adapters/cloudinary.adapter';
import { PostsTattooArtist } from 'src/posts-tattoo-artist/entities/posts-tattoo-artist.entity';
import { QualificationOfTattoArtist } from 'src/qualification-of-tatto-artist/entities/qualification-of-tatto-artist.entity';

@Injectable()
export class PostsTattooArtistService {
  constructor(
    @InjectModel(PostsTattooArtist.name)
    private readonly postsTattooArtistModel: Model<PostsTattooArtist>,
    @InjectModel(QualificationOfTattoArtist.name)
    private readonly qualificationOfTattoArtistModel: Model<QualificationOfTattoArtist>,
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

    await this.postsTattooArtistModel.findByIdAndDelete(id);

    return { message: 'Post deleted' };
  }

  async getPostsArtists() {
    return await this.postsTattooArtistModel.find().select('-__v');
  }

  async getPostById(id: string) {
    const post = await this.postsTattooArtistModel
      .find({
        TattooArtist: new Types.ObjectId(id),
      })
      .select('-__v');

    return post;
  }
}

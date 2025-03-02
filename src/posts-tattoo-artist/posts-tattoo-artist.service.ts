import { BadRequestException, Injectable } from '@nestjs/common';
import { GetTattooArtistType } from './types/get-user.types';
import { CreatePostsTattooArtistDto } from './dto/create-posts-tattoo-artist.dto';
import { cloudinaryAdapter } from 'src/common/adapters/cloudinary.adapter';
import { InjectModel } from '@nestjs/mongoose';
import { PostsTattooArtist } from './entities/posts-tattoo-artist.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class PostsTattooArtistService {
  constructor(
    @InjectModel(PostsTattooArtist.name)
    private readonly postsTattooArtistModel: Model<PostsTattooArtist>,
  ) {}

  async createPost(
    getTattooArtist: GetTattooArtistType,
    images: Express.Multer.File[],
    descriptionDto: CreatePostsTattooArtistDto,
  ) {
    const imagesPost = await cloudinaryAdapter.uploadImages(
      images,
      getTattooArtist.tattooArtist.id as string,
    );

    console.log(imagesPost);
    const CustomImages = imagesPost.map((image) => {
      return {
        public_id: image.public_id.replace('/', '&'),
        url: image.secure_url,
      };
    });

    const post = await this.postsTattooArtistModel.create({
      TattooArtist: new Types.ObjectId(
        getTattooArtist.tattooArtist._id as string,
      ),
      description: descriptionDto.descritpion,
      images: CustomImages,
    });

    return post;
  }

  async deletePost(idPost: string) {
    const post = await this.postsTattooArtistModel.findById(idPost);
    if (!post) {
      throw new BadRequestException('Post not found');
    }

    const imagesId = post.images.map((image) =>
      image.public_id.replace('&', '/'),
    );

    await this.postsTattooArtistModel.findByIdAndDelete(idPost);

    await cloudinaryAdapter.deleteImages(imagesId);

    return {
      message: 'Post deleted',
    };
  }
}

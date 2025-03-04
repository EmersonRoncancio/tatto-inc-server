import { BadRequestException, Injectable } from '@nestjs/common';
import { GetTattooArtistType, GetUserType } from './types/get-user.types';
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
    console.log(getTattooArtist);
    const imagesPost = await cloudinaryAdapter.uploadImages(
      images,
      getTattooArtist.tattooArtist.id as string,
    );

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
      description: descriptionDto.description,
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

  async getPostsTattooArtistById(id: string) {
    const posts = await this.postsTattooArtistModel
      .find({
        TattooArtist: new Types.ObjectId(id),
      })
      .populate('TattooArtist')
      .select('-__v');

    return posts;
  }

  async getFindPostsTattooArtist() {
    const posts = await this.postsTattooArtistModel
      .find()
      .populate('TattooArtist')
      .select('-__v');
    return posts;
  }

  async likePost(user: GetUserType, id: string) {
    const post = await this.postsTattooArtistModel.findById(id);
    if (!post) {
      throw new BadRequestException('Post not found');
    }

    if (!post.likes.includes(user.user._id as string)) {
      const postActualizado =
        await this.postsTattooArtistModel.findByIdAndUpdate(
          id,
          {
            $push: { likes: user.user._id as string },
            $inc: { countLikes: 1 },
          },
          { new: true },
        );
      return postActualizado;
    }

    return post;
  }

  async unlikePost(user: GetUserType, id: string) {
    const post = await this.postsTattooArtistModel.findById(id);
    if (!post) {
      throw new BadRequestException('Post not found');
    }

    if (post.likes.includes(user.user._id as string)) {
      const postActualizado =
        await this.postsTattooArtistModel.findByIdAndUpdate(
          id,
          {
            $pull: { likes: user.user._id as string },
            $inc: { countLikes: -1 },
          },
          { new: true },
        );

      return postActualizado;
    }

    return post;
  }

  async getPostsById(id: string) {
    const post = await this.postsTattooArtistModel
      .findById(id)
      .populate('TattooArtist');

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    return post;
  }
}

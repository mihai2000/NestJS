import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { PostEntity } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDTO } from '../dto/create-post.dto';
import { TagsService } from 'src/tags/providers/tags.service';
import { UpdatePostDTO } from '../dto/update-posts.dto';
import { GetPostsDto } from '../dto/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.service';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { CreatePostService } from './create-post.service';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class PostsService {
  constructor(
    /*
     * Injecting Users Service
     */
    private readonly usersService: UsersService,
    /**
     * Injecting postsRepository
     */
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
    /*
     * Injecting Tags Service
     */
    private readonly tagsService: TagsService,
    /*
    Injecting pagination provider
    */
   private  readonly paginationService:PaginationProvider,

   private readonly createPostService:CreatePostService
  ) {}

  /**
   * Method to create a new post
   */
  public async create(createPostDto: CreatePostDTO, user:ActiveUserData) {
    return await this.createPostService.create(createPostDto,user)
  }

  public async findAll(postQuery:GetPostsDto, userId: string):Promise<Paginated<PostEntity>> {
   let posts = await this.paginationService.paginateQuery({
    limit:postQuery.limit,
    page:postQuery.page
   },
  this.postsRepository)
  //  let posts = await this.postsRepository.find({});  //with eager, to not get all the realtions where eager is true is defined
  return posts;
  }

  
  public async update(updatePostDto: UpdatePostDTO) {
    // Find new tags
    let tags = undefined
    let post = undefined
    try {
      tags = await this.tagsService.findMultipleTags(updatePostDto.tags);
    } catch (error) {
      throw new RequestTimeoutException('Unable to porocess your req at the moment, try later', {
        description:"Error connecting to the database",
    })
    }

    try {
      // Update the post
      post = await this.postsRepository.findOneBy({
        id: updatePostDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException('Unable to porocess your req at the moment, try later', {
        description:"Error connecting to the database",
    })
    }

    if (!post){
    throw new BadRequestException("the post d does not exit")
    }
    if (!tags || tags.length !== updatePostDto.tags.length){
    throw new BadRequestException("please check yout tag IDs and ensure they are correct")
    }
  
    // Update the tags
    post.tags = tags;
    
     try {
      await this.postsRepository.save(post);
     } catch (error) {
      throw new RequestTimeoutException('Unable to porocess your req at the moment, try later', {
        description:"Error connecting to the database",
    })  
     }
    return post;
  }

  /**
   * Method to delete a post from the database
   */
  public async delete(id: number) {
    // Delete metaOptions and the post
    await this.postsRepository.delete(id);
    return { deleted: true, id };
  }
} 
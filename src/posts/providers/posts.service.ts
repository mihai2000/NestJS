import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { PostEntity } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDTO } from '../dto/create-post.dto';
import { TagsService } from 'src/tags/providers/tags.service';
import { UpdatePostDTO } from '../dto/update-posts.dto';

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
  ) {}

  /**
   * Method to create a new post
   */
  public async create(createPostDto: CreatePostDTO) {

    let author = await this.usersService.findOneById(createPostDto.authorId);

    let tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    // Create the post
    let post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags:tags,
    });

    return await this.postsRepository.save(post);
  }

  public async findAll(userId: string) {
   let posts = await this.postsRepository.find({
    relations:{
      metaOptions:true,
      author:true,
      tags:true
    }
   });
  //  let posts = await this.postsRepository.find({});  //with eager, to not get all the realtions where eager is true is defined
  return posts;
  }

  
  public async update(updatePostDto: UpdatePostDTO) {
    // Find new tags
    let tags = await this.tagsService.findMultipleTags(updatePostDto.tags);
    
    // Update the post
    let post = await this.postsRepository.findOneBy({
      id: updatePostDto.id,
    });
    
    // Update the tags
    post.tags = tags;
    
    return await this.postsRepository.save(post);
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
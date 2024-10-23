import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreatePostDTO } from '../dto/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { PostEntity } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { Repository } from 'typeorm';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class CreatePostService {
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

    ){}
    
    public async create(createPostDto: CreatePostDTO, user:ActiveUserData) {

        let author = undefined;
        let tags   = undefined;

        try {
            author = await this.usersService.findOneById(user.sub);
            tags   = await this.tagsService.findMultipleTags(createPostDto.tags);
        } catch (error) {
            throw new ConflictException(error);
        }
    
        if(createPostDto.tags.length !== tags.length){
            throw new BadRequestException('Please check your tag IDs')
        }
        // Create the post
        let post = this.postsRepository.create({
          ...createPostDto,
          author: author,
          tags:tags,
        });

        try {
            return await this.postsRepository.save(post);
        } catch (error) {
            throw new ConflictException(error, {
                description:"Ensure post slug is unique and not a duplicate"
            })
        }
      }
}

import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
  } from '@nestjs/common';
  import { PostsService } from './providers/posts.service';
  import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-posts.dto';
  
  @Controller('posts')
  @ApiTags('Posts')
  export class PostsController {
    constructor(
      /*
       *  Injecting Posts Service
       */
      private readonly postsService: PostsService,
    ) {}
  
    /*
     * GET localhost:3000/posts/:userId
     */
    @Get('/:userId?')
    public getPosts(@Param('userId') userId: string) {
      return this.postsService.findAll(userId);
    }
  
    @ApiOperation({
      summary: 'Creates a new blog post',
    })
    @ApiResponse({
      status: 201,
      description: 'You get a 201 response if your post is created successfully',
    })
    @Post()
    public createPost(@Body() CreatePostDTO: CreatePostDTO) {
      return this.postsService.create(CreatePostDTO);
    }
  
    @ApiOperation({
      summary: 'Updates an existing blog post',
    })
    @ApiResponse({
      status: 200,
      description: 'A 200 response if the post is updated successfully',
    })
    @Patch()
    public updatePost(@Body() updatePostDto: UpdatePostDTO) {
      return this.postsService.update(updatePostDto);
    }
  
    /**
     * Route to delete a post
     */
    @Delete()
    public deletePost(@Query('id', ParseIntPipe) id: number) {
      return this.postsService.delete(id);
    }
  }
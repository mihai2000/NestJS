import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './providers/posts.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { TagsModule } from 'src/tags/tags.module';
import { UserEntity } from 'src/users/user.entity';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { CreatePostService } from './providers/create-post.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, CreatePostService],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([PostEntity, UserEntity]),
    TagsModule,
    PaginationModule,
  ],
})
export class PostsModule {}

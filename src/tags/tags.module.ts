import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './tags.entity';
import { TagsService } from './providers/tags.service';

@Module({
  controllers: [TagsController],
  imports:[TypeOrmModule.forFeature([TagEntity])],
  providers:[TagsService],
  exports:[TagsService]
})
export class TagsModule {}

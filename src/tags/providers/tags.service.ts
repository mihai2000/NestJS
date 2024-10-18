import { In, Repository } from 'typeorm';
import { CreateTagDto } from '../dto/create-tag.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from '../tags.entity';

@Injectable()
export class TagsService {
  constructor(
    /**
     * Inject tagsRepository
     */
    @InjectRepository(TagEntity)
    private readonly tagsRepository: Repository<TagEntity>,
  ) {}

  public async create(createTagDto: CreateTagDto) {
    let tag = this.tagsRepository.create(createTagDto);
    return await this.tagsRepository.save(tag);
  }

  public async findMultipleTags(tags:number[]){
    let results = await this.tagsRepository.find({
      where:{
        // take array of ids an find all the tags that have ids within this array
        id: In(tags)
      }
    })
  return results;
  }

  public async delete(id: number) {
    await this.tagsRepository.delete(id);

    return {
      deleted: true,
      id,
    };
  }
  
  public async softRemove(id: number) {
    await this.tagsRepository.softDelete(id);

    return {
      softDeleted: true,
      id,
    };
  }
}
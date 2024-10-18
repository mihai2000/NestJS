import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { MetaOptionEntity } from '../meta-option.entity';
import { CreatePostMetaOptionsDTO } from '../dto/create-post-meta-options.dto';

@Injectable()
export class MetaOptionsService {
  constructor(
    /**
     * Injecting metaOptions repository
     */
    @InjectRepository(MetaOptionEntity)
    private metaOptionsRepository: Repository<MetaOptionEntity>,
  ) {}

  public async create(createPostMetaOptionsDto: CreatePostMetaOptionsDTO) {
    let metaOption = this.metaOptionsRepository.create(
      createPostMetaOptionsDto,
    );
    return await this.metaOptionsRepository.save(metaOption);
  }
}
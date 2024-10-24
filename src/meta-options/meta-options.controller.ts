import { Body, Controller, Post } from '@nestjs/common';
import { MetaOptionsService } from './providers/meta-options.service';
import { CreatePostMetaOptionsDTO } from './dto/create-post-meta-options.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('meta-options')
@ApiTags('Meta-options')
export class MetaOptionsController {
  constructor(
    /**
     * Inject MetaOptionsService
     * */
    private readonly metaOptionsService: MetaOptionsService,
  ) {}

  @Post()
  public async create(
    @Body() createPostMetaOptionsDto: CreatePostMetaOptionsDTO,
  ) {
    return this.metaOptionsService.create(createPostMetaOptionsDto);
  }
}

import { CreatePostDTO } from './create-post.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdatePostDTO extends PartialType(CreatePostDTO) {
  @ApiProperty({
    description: 'The ID on the post that need to be updated',
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}

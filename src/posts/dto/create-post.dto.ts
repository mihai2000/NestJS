import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { postType, postStatus } from './enums/postType.enum';
import { CreatePostMetaOptionsDTO } from '../../meta-options/dto/create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDTO {
  @ApiProperty({
    description: 'This is a title for the blog post',
    example: 'This is title',
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  @MaxLength(512)
  title: string;

  @ApiProperty({
    enum: postType,
    description: "Possible values: 'post' , 'page' , 'story' , 'series' ",
  })
  @IsNotEmpty()
  @IsEnum(postType)
  postType: postType;

  @ApiProperty({
    description: "For example - 'my-url' ",
    example: 'my-blog-post',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small leters and uses only "-" and without spaces, For example "my-url"',
  })
  slug: string;

  @ApiProperty({
    enum: postStatus,
    description:
      "Possible values: 'draft' , 'scheduled' , 'review' , 'published' ",
  })
  @IsNotEmpty()
  @IsEnum(postStatus)
  status: postStatus;

  @ApiPropertyOptional({
    description: 'This is the content of the post',
    example: 'The post content',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description:
      'Serialize your json object else a vaidation error will be thrown',
    example:
      '{\r\n "@context":"https://schema/org", \r\n "@type":"Person"\r\n}',
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'Featured image for your blog post',
    example: 'http://localhost.com/images/iamge1.jpg',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'The Data on which the blog post is published',
    example: '2024-03-16T07:46:32+0000',
  })
  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  @ApiPropertyOptional({
    description: 'Array of Ids of Tags',
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsArray()
  // for each value of the array it need to be checked if it is a string
  @IsInt({ each: true })
  tags?: number[];

  @ApiPropertyOptional({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        metavalue: {
          type: 'json',
          description: 'The metaValue is a JSON string',
          example: '{"sidebarEnabled": true,}',
        },
      },
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDTO)
  metaOptions?: CreatePostMetaOptionsDTO | null;
}

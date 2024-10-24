import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { postType, postStatus } from './dto/enums/postType.enum';
import { MetaOptionEntity } from 'src/meta-options/meta-option.entity';
import { UserEntity } from 'src/users/user.entity';
import { TagEntity } from 'src/tags/tags.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: postType,
    nullable: false,
    default: postType.POST,
  })
  postType: postType;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: postStatus,
    nullable: false,
    default: postStatus.DRAFT,
  })
  status: postStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  content: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  schema: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  featuredImageUrl: string;

  @Column({
    type: 'timestamp', //datetime in mysql
    nullable: true,
  })
  publishOn: Date;

  @OneToOne(() => MetaOptionEntity, (metaOptions) => metaOptions.post, {
    cascade: true,
    eager: true,
  })
  metaOptions?: MetaOptionEntity;

  @ManyToOne(() => UserEntity, (user) => user.posts, {
    eager: true,
  })
  author: UserEntity;

  @ManyToMany(() => TagEntity, (tag) => tag.posts, {
    eager: true,
  })
  @JoinTable()
  tags?: TagEntity[];
}

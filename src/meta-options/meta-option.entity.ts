import { PostEntity } from 'src/posts/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('meta-options')
export class MetaOptionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'json',
    nullable: false,
  })
  // contains entire json objects for the key value pairs
  metaValue: string;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @OneToOne(() => PostEntity, (post) => post.metaOptions, {
    // bidirectional direction relationship for deleting form both tables
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  post: PostEntity;
}

import { PostEntity } from "src/posts/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class UserEntity{

    @PrimaryGeneratedColumn()
    id:number;
    
    @Column({
        type:'varchar',
        length:96,
        nullable:false
    })
    firstName:string;
    
    @Column({
        type:'varchar',
        length:96,
        nullable:true
    })    
    lastName:string;

    @Column({
        type:'varchar',
        length:96,
        nullable:false,
        unique:true
    })
    email:string;
    
    @Column({
        type:'varchar',
        length:96,
        nullable:false
    })
    password:string;

    @OneToMany(()=>PostEntity, (post)=>post.author)
    posts:PostEntity[];
}
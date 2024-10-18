import { IsJSON, IsNotEmpty, IsString } from "class-validator";

export class CreatePostMetaOptionsDTO{
    @IsNotEmpty()
    @IsJSON()
    metaValue: string;
}
import { IsArray, IsNotEmpty, IsObject, ValidateNested } from "class-validator";
import { CreateUserDTO } from "./create-user.dto";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class createManyUsersDto{
 
    @ApiProperty({
        type:'array',
        required:true,
        items: {
            type:'User'
        }
    })
    @IsNotEmpty()
    @IsArray()
    // each type that is returnes is validated
    @ValidateNested({each:true})
    @Type(()=> CreateUserDTO)
    users:CreateUserDTO[];
}
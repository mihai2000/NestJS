import {  IsInt,  IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class GetUsersParamDTO{
    @ApiPropertyOptional({
        description:"Get user with a specific ID",
        example:1234,
    })
    @IsOptional()
    @IsInt()
    @Type(()=>Number) // transform to a number
    id?:number;
}

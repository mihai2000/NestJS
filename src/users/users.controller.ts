import { Controller,Get,Post, Patch,Put,Delete, Param,Query,Body,Req,Headers,Ip,ParseIntPipe,DefaultValuePipe,ValidationPipe } from '@nestjs/common';
import { Request } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { GetUsersParamDTO } from './dto/get-users-param.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(
        //Injecting users service
        private readonly usersService:UsersService
    ){}

    @Get('/:id?')
    @ApiOperation({
        summary:"Fetches a list of registered users on the application"
    })
    @ApiResponse({
        status:200,
        description:"Users fetched successfuly based on the query"
    })
    @ApiQuery({
        name:"limit",
        type:'number',
        required:false,
        description:"The number of entries returned to the query",
        example:10
    })
    @ApiQuery({
        name:"page",
        type:'number',
        required:false,
        description:"The position of the page number that you want the API to return",
        example:1
    })
    // public getUser(
    // @Param() params:any,
    // @Query() query:any){
    // when you want to indicate a specific param, query
    public getUser(
        @Param() getUsersParamDTO:GetUsersParamDTO,  //pipes will assume the id is required
        @Query('limit',new DefaultValuePipe(10)) limit:number,
        @Query('page',new DefaultValuePipe(1)) page:number
    ) {
        return this.usersService.findAll(getUsersParamDTO,limit,page);
    }

    @Post()
    public createUsers(@Body() createUserDTO:CreateUserDTO){
        return this.usersService.createUser(createUserDTO);
    }
   
    @Patch()
    public updateUser(@Body() updateUserDto: UpdateUserDTO) {
      return updateUserDto;
    }
}
 
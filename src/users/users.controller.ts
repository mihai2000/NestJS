import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  DefaultValuePipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Request } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { GetUsersParamDTO } from './dto/get-users-param.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createManyUsersDto } from './dto/create-many-users.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthTypeEnum } from 'src/auth/enums/auth-type.enum';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    //Injecting users service
    private readonly usersService: UsersService,
  ) {}

  @Get('/:id?')
  @ApiOperation({
    summary: 'Fetches a list of registered users on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfuly based on the query',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The number of entries returned to the query',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description:
      'The position of the page number that you want the API to return',
    example: 1,
  })
  // public getUser(
  // @Param() params:any,
  // @Query() query:any){
  // when you want to indicate a specific param, query
  public getUser(
    @Param() getUsersParamDTO: GetUsersParamDTO, //pipes will assume the id is required
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('page', new DefaultValuePipe(1)) page: number,
  ) {
    return this.usersService.findAll(getUsersParamDTO, limit, page);
  }

  @Post()
  // @SetMetadata('authType', 'None')
  // if both bearere and none is assinged the controller becomes public
  @Auth(AuthTypeEnum.None)
  @UseInterceptors(ClassSerializerInterceptor)
  public createUsers(@Body() createUserDTO: CreateUserDTO) {
    return this.usersService.createUser(createUserDTO);
  }

  @Post('create-many')
  public createManyUsers(@Body() createManyUsersDto: createManyUsersDto) {
    return this.usersService.createMany(createManyUsersDto);
  }

  @Patch()
  public updateUser(@Body() updateUserDto: UpdateUserDTO) {
    return updateUserDto;
  }
}

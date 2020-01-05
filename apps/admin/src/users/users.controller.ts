import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '@libs/db/models/user/user.model';

@ApiTags('用户')
@Controller('users')
export class UsersController {
    constructor (@InjectModel(User)private readonly model){}

    @Get('/getUserList')
    getUserList(){
        return '1'
    }
}

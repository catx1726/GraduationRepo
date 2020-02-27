import { Controller, Get } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { Activity } from '@libs/db/models/activity/activity.model'

@Controller('auth')
export class AuthController {}

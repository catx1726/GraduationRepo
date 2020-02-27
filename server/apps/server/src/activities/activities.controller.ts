import { Controller, Get, Inject, forwardRef } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ApiOperation, ApiRequestTimeoutResponse, ApiTags } from '@nestjs/swagger'
import { Activity } from '@libs/db/models/activity/activity.model'

@Controller('activities')
@ApiTags('活动')
export class ActivitiesController {
    constructor(@InjectModel(Activity) private readonly) {}
}

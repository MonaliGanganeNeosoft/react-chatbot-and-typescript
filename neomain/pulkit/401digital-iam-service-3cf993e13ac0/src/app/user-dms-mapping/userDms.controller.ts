import { SuccessResponse } from '@401_digital/xrm-core';
import {
    Controller,
    Get,
    Param,
    UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core/base.controller';
import { AuthGuard } from 'src/core/auth.guard';
import { UserDmsService } from './userDms.service';
@ApiTags('user-dms')
@UseGuards(AuthGuard())
@Controller('user-dms')
export class UserDmsController extends BaseController {
    constructor(private dmsUserService: UserDmsService) {
        super();
    }

    @Get()
    async getUserDms(): Promise<any> {
        return new SuccessResponse(
            await this.dmsUserService.getUserDms()
        )
    }

    @Get(':userId')
    async getUserDmsById(@Param('userId') userId: any): Promise<any> {
        return new SuccessResponse(
            await this.dmsUserService.getUserDmsById(userId)
        )
    }
}

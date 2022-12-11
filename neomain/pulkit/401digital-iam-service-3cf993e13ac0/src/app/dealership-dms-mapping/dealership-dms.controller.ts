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
import { DealershipDmsService } from './dealership-dms.service';

@ApiTags('dealership-dms')
@UseGuards(AuthGuard())
@Controller('dealership-dms')
export class DealershipDmsController extends BaseController {
    constructor(private dealershipDmsService: DealershipDmsService) {
        super();
    }
    
    @Get()
    async getDealershipDms(): Promise<any> {
        return new SuccessResponse(
            await this.dealershipDmsService.getDealershipDms()
        )
    }

    @Get(':dealershipId')
    async getDealershipDmsById(@Param('dealershipId') dealershipId: any): Promise<any> {
        return new SuccessResponse(
            await this.dealershipDmsService.getDealershipDmsById(dealershipId)
        )
    }
}

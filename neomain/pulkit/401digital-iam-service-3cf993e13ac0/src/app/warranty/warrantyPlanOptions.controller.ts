import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { PaginationDTO, ResponseDta } from '@model';
import { WarrantyPlanOptionsDTO, WarrantyPlanConditionDTO } from './warrantyPlanOptions.dto';
import { WarrantyPlansService } from './warrantyPlanOptions.service';
import { AuthGuard } from '../../core/auth.guard'

@ApiTags('Warranty Plans')
@UseGuards(AuthGuard())
@Controller('WarrantyPlans')

export class WarrantyPlanController {
    constructor(private warrantyPlanService: WarrantyPlansService) { }

    @Get('eligibleForWarranty')
    async getWarrantyStatus(@Query() data: WarrantyPlanOptionsDTO): Promise<ResponseDta> {
        return this.warrantyPlanService.eligbleForWarranty(data);
    }
    @Get('eligibleForWarrantyCondition')
    async getWarrantyCondition(@Query() data: WarrantyPlanConditionDTO): Promise<ResponseDta> {
        return this.warrantyPlanService.eligbleForWarrantyCondition(data);
    }
}
import { RequestQuery, SuccessResponse } from '@401_digital/xrm-core';
import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core/base.controller';
import { CustomerGuard } from 'src/core/cutomerGuard';
import { CustomerService } from './customer.service';

@ApiTags('customer')
@UseGuards(CustomerGuard())
@Controller('customer')
export class CustomerController extends BaseController {
    constructor(private customerService: CustomerService) {
        super();
    }

    @Get('/salesPerson')
    async getEmployee(@Query() query): Promise<any> {
        return new SuccessResponse(
            await this.customerService.getSalesPerson(
                query['pbsEmployeeId'] ? query['pbsEmployeeId'] : '', query['salesAgentId'] ? query['salesAgentId'] : ''
            ),
        );
    }
}

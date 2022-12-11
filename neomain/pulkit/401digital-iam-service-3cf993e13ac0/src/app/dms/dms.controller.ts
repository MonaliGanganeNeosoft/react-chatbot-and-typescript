import { SuccessResponse, ErrorResponse } from '@401_digital/xrm-core';
import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    UseGuards,
    Put
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core/base.controller';
import { AuthGuard } from 'src/core/auth.guard';
import { DmsService } from './dms.service';
import { AddDmsDTO } from './dms.dto';
@ApiTags('dms')
@UseGuards(AuthGuard())
@Controller('dms')
export class DmsController extends BaseController {
    constructor(private dmsService: DmsService) {
        super();
    }

    @Post()
    async addDms(@Body() dms: AddDmsDTO): Promise<any> {
        return new SuccessResponse(
            await this.dmsService.createDms(dms)
        )
    }

    @Get()
    async getDms(): Promise<any> {
        return new SuccessResponse(
            await this.dmsService.getDms()
        )
    }

    @Get(':id')
    async getDmsById(@Param('id') id: any): Promise<any> {
        return new SuccessResponse(
            await this.dmsService.getDmsById(id)
        )
    }

    @Put(':id')
    async updateUser(@Param('id') id: number, @Body() data: any) {
      
      const dms = await this.dmsService.getDmsById(id)
     
      if (dms) return new SuccessResponse(await this.dmsService.updateDmsById(id, data));
      
      else return new ErrorResponse('Dms not found.') 
    }
}

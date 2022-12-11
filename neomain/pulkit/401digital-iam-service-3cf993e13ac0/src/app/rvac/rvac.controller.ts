import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { PaginationDTO, ResponseDta } from '@model';
import { RvacDTO } from './rvac.dto';
import { RvacService } from './rvac.service';
import { AuthGuard } from '../../core/auth.guard'

@ApiTags('Rvac')
//@UseGuards(AuthGuard())
@Controller('Rvac')

export class RvacController {
    constructor(private rvacService: RvacService) { }


    @Get('eligibleForRvac')
    async getRvacCondition(@Query() data: RvacDTO): Promise<ResponseDta> {
        return this.rvacService.eligbleForRvacCondition(data);
    }
}
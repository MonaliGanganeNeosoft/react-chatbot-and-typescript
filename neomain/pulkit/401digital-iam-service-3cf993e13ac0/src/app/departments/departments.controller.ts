import { SuccessResponse } from '@401_digital/xrm-core';
import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ServiceCodes } from 'src/constants';
import { AuthGuard } from 'src/core/auth.guard';
import { BaseController } from 'src/core/base.controller';
import { CurrentUser } from 'src/decorators';
import { TokenDTO } from '../auth/auth.dto';
import {
    AddDepartmentDTO,
    DepartmentQueryDTO,
    UpdateDepartmentDTO,
} from './department.dto';
import { DepartmentService } from './department.service';

@ApiTags('Departments')
@UseGuards(AuthGuard(ServiceCodes.DEPARTMENT))
@Controller('departments')
export class DepartmetsController extends BaseController {
    constructor(private departmentService: DepartmentService) {
        super();
    }

    @Post()
    async create(
        @Body() data: AddDepartmentDTO,
        @CurrentUser() user: TokenDTO,
    ): Promise<any> {
        await this.verifyAccess(ServiceCodes.DEPARTMENT, user, 'write');
        const department = await this.departmentService.save(user, data);
        data.id = department.id;
        return new SuccessResponse(data);
    }

    @Put('/:id')
    async update(
        @Body() data: UpdateDepartmentDTO,
        @CurrentUser() user: TokenDTO,
        @Param('id') id: string,
    ): Promise<any> {
        await this.verifyAccess(ServiceCodes.DEPARTMENT, user, 'update');
        const department = await this.departmentService.update(user, id, data);
        data.id = department.id;
        return new SuccessResponse(data);
    }

    @Get()
    @ApiQuery({ name: 'filter', type: DepartmentQueryDTO })
    async get(@CurrentUser() user: TokenDTO, @Query() query: any) {
        await this.verifyAccess(ServiceCodes.DEPARTMENT, user, 'read');
        return new SuccessResponse(await this.departmentService.get(user, query));
    }

    @Get('/:id')
    async getById(@CurrentUser() user: TokenDTO, @Param('id') id: string) {
        await this.verifyAccess(ServiceCodes.DEPARTMENT, user, 'read');
        return new SuccessResponse(await this.departmentService.getById(user, id));
    }
}

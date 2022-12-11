import { RequestQuery, SuccessResponse } from '@401_digital/xrm-core';
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
    UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Level, ServiceCodes } from 'src/constants';
import { AuthGuard } from 'src/core/auth.guard';
import { BaseController } from 'src/core/base.controller';
import { ApiFile, CurrentUser } from 'src/decorators';
import { TokenDTO } from '../auth/auth.dto';
import { DealerGroupService } from './dealer-group.service';
import {
    AddDealerGroupDTO,
    DealerGroupFilterDTO,
    DealerGroupQueryDTO,
    UpdateDealerGroupDTO,
} from './dealer-groups.dto';

@ApiTags('Dealer')
@UseGuards(AuthGuard(ServiceCodes.DEALERGROUP))
@Controller('dealerGroups')
export class DealerGroupController extends BaseController {
    constructor(private dealerService: DealerGroupService) {
        super();
    }

    @Post()
    @UseInterceptors(FileInterceptor('logo'))
    @ApiFile('logo')
    @ApiConsumes('multipart/form-data')
    async addDealerGroup(@CurrentUser() user: TokenDTO, @Body() dto: AddDealerGroupDTO, @UploadedFile() file: any,): Promise<any> {
        // console.log('dto : ', file);
        await this.verifyAccess(ServiceCodes.DEALERGROUP, user, 'write');
        return new SuccessResponse(await this.dealerService.create(user, dto, file));
    }

    @Get()
    @ApiQuery({ name: 'filter', type: DealerGroupQueryDTO })
    async getDealerGroups(
        @CurrentUser() user: TokenDTO,
        @Query() query: RequestQuery<DealerGroupFilterDTO>,
    ): Promise<any> {
        await this.verifyAccess(ServiceCodes.DEALERGROUP, user, 'read');
        return new SuccessResponse(await this.dealerService.getDealerGroups(query));
    }

    @Delete('/:dealerGroupId')
    async decativate(
        @CurrentUser() user: TokenDTO,
        @Param('dealerGroupId') dealerGroupId: string,
    ): Promise<any> {
        await this.verifyAccess(ServiceCodes.DEALERGROUP, user, 'delete');
        await this.dealerService.deactivate(dealerGroupId);
        return new SuccessResponse();
    }

    @Get('/gms')
    @ApiQuery({ name: 'dealerGroup', type: 'string', required: false })
    @ApiQuery({ name: 'dealership', type: 'string', required: false })
    async getGMs(
        @CurrentUser() user: TokenDTO,
        @Query() reqQuery: any,
    ): Promise<any> {
        await this.verifyAccess(ServiceCodes.DEALERSHIP, user, 'read', user.dealership);
        let dealerGroup: string;
        if (user.userLevel == Level.ROOT && reqQuery.dealerGroup) {
            dealerGroup = reqQuery.dealerGroup;
        }
        if (user.userLevel == Level.DEALERGROUP) {
            dealerGroup = user.dealerGroup;
        }
        return new SuccessResponse(
            await this.dealerService.getGeneralManagers(reqQuery),
        );
    }

    @Get('/:id')
    async getById(@CurrentUser() user: TokenDTO, @Param('id') id: string): Promise<any> {
        await this.verifyAccess(ServiceCodes.DEALERGROUP, user, 'read');
        return new SuccessResponse(await this.dealerService.getById(user, id));
    }

    @Put('/:id')
    @UseInterceptors(FileInterceptor('logo'))
    @ApiFile('logo')
    @ApiConsumes('multipart/form-data')
    async update(@CurrentUser() user: TokenDTO, @Body() dto: UpdateDealerGroupDTO, @Param('id') id: string, @UploadedFile() file: any,): Promise<any> {
        await this.verifyAccess(ServiceCodes.DEALERGROUP, user, 'update');
        return new SuccessResponse(await this.dealerService.update(user, dto, id, file));
    }

    @Put('logo/:id')
    @UseInterceptors(FileInterceptor('logo'))
    @ApiFile('logo')
    @ApiConsumes('multipart/form-data')
    async uploadLogo(
        @CurrentUser() user: TokenDTO,
        @UploadedFile() file: any,
        @Param('id') id: string,
    ): Promise<any> {

        // await this.verifyAccess(ServiceCodes.DEALERSHIP, user, 'update', id);
        // return new SuccessResponse(await this.dealerService.uploadLogo(id, file));
    }
}

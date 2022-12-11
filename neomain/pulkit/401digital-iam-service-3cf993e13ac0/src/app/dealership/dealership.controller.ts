import { RequestQuery, SuccessResponse } from '@401_digital/xrm-core';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DealershipService } from './dealership.service';
import { DealershipDTO, DealershipFilterDTO, DealershipQueryDTO, UpdateGMDTO, UpdateOpeningHoursDTO } from './dto';
import { ApiFile, CurrentUser } from '../../decorators';
import { DealershipEntity } from './dealership.entity';
import { AuthGuard } from 'src/core/auth.guard';
import { Level, ServiceCodes } from 'src/constants';
import { TokenDTO } from '../auth/auth.dto';
import { BaseController } from 'src/core/base.controller';

@ApiTags('Dealer')
@UseGuards(AuthGuard(ServiceCodes.DEALERSHIP))
@Controller('dealerships')
export class DealershipController extends BaseController {
    constructor(private dealerService: DealershipService) {
        super();
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    async create(@CurrentUser() user: TokenDTO, @Body() data: any): Promise<any> {
        await this.verifyAccess(
            ServiceCodes.DEALERSHIP,
            user,
            'write',
            user.dealership,
        );
        let dealership = Object.assign(new DealershipEntity(), data);
        dealership = this.dealerService.setDealerGroup(dealership, user);
        dealership = await this.dealerService.create(dealership);
        data.id = dealership.id;
        return new SuccessResponse(data);
    }

    @Put('/changeGeneralManager/:dealershipId')
    async changeGeneralManager(
        @CurrentUser() user: TokenDTO,
        @Body() data: UpdateGMDTO,
        @Param('dealershipId') dealershipId: string,
    ): Promise<any> {
        await this.verifyAccess(
            ServiceCodes.DEALERSHIP,
            user,
            'update',
            dealershipId,
        );
        await this.dealerService.changeGeneralManager(dealershipId, data, user);
        return new SuccessResponse();
    }

    @Put('/:id')
    async update(
        @CurrentUser() user: TokenDTO,
        @Body() data: any,
        @Param('id') id: string,
    ): Promise<any> {
        await this.verifyAccess(ServiceCodes.DEALERSHIP, user, 'update', id);
        data = await this.dealerService.update(user, id, data);
        return new SuccessResponse(data);
    }

    @Post('save/:id')
    @HttpCode(HttpStatus.OK)
    async submit(
        @CurrentUser() user: TokenDTO,
        @Body() data: DealershipDTO,
        @Param('id') id: string,
    ): Promise<any> {
        this.verifyAccess(ServiceCodes.DEALERSHIP, user, 'write', id);
        const response = await this.dealerService.submit(id, data, user);
        return new SuccessResponse(response);
    }

    @Get()
    @ApiQuery({ name: 'filter', type: DealershipQueryDTO })
    async get(
        @CurrentUser() user: TokenDTO,
        @Query() query: RequestQuery<DealershipFilterDTO>,
    ): Promise<any> {
        if (user.userLevel != Level.DEALERSHIP) {
            await this.verifyAccess(ServiceCodes.DEALERSHIP, user, 'read');
        }
        return new SuccessResponse(await this.dealerService.get(user, query));
    }

    @Get('/:id')
    async getById(
        @CurrentUser() user: TokenDTO,
        @Param('id') id: string,
    ): Promise<any> {
        await this.verifyAccess(ServiceCodes.DEALERSHIP, user, 'read', id);
        return new SuccessResponse(await this.dealerService.getById(user, id));
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
        await this.verifyAccess(ServiceCodes.DEALERSHIP, user, 'update', id);
        return new SuccessResponse(await this.dealerService.uploadLogo(id, file));
    }

    @Get('logo/:id')
    async getLogo(@CurrentUser() user: TokenDTO, @Param('id') id: string): Promise<any> {
        return new SuccessResponse(await this.dealerService.getLogo(id));
    }

    @Put('images/:id')
    @UseInterceptors(FileInterceptor('image'))
    @ApiFile('image')
    @ApiConsumes('multipart/form-data')
    async uploadImages(
        @CurrentUser() user: TokenDTO,
        @UploadedFile() file: any,
        @Param('id') id: string,
    ): Promise<any> {
        await this.verifyAccess(ServiceCodes.DEALERSHIP, user, 'update', id);
        return new SuccessResponse(await this.dealerService.addImage(id, file));
    }


    @Put('overrideImage/:imageId')
    @UseInterceptors(FileInterceptor('image'))
    @ApiFile('image')
    @ApiConsumes('multipart/form-data')
    async overrideImage(@CurrentUser() user: TokenDTO, @UploadedFile() file: any, @Param('imageId') imageId: string): Promise<any> {
        return new SuccessResponse(await this.dealerService.overrideImage(Number.parseInt(imageId), file));
    }

    @Delete('images/:id')
    async deleteImage(@CurrentUser() user: TokenDTO, @Param('id') id: string): Promise<any> {
        await this.verifyAccess(ServiceCodes.DEALERSHIP, user, 'update', id);
        return new SuccessResponse(await this.dealerService.deleteImage(Number.parseInt(id)));
    }

    @Put('openingHours/:id')
    async updateOpeningHours(
        @CurrentUser() user: TokenDTO,
        @Param('id') id: string,
        @Body() data: UpdateOpeningHoursDTO,
    ): Promise<any> {
        await this.verifyAccess(ServiceCodes.DEALERSHIP, user, 'update', id);
        const result = await this.dealerService.updateOpeningHours(id, data.openingHours);
        return new SuccessResponse(result);
    }


    @Delete('leadSetting/:id')
    async deleteLeadSetting(@CurrentUser() user: TokenDTO, @Param('id') id: string): Promise<any> {
        await this.verifyAccess(ServiceCodes.DEALERSHIP, user, 'update', id);
        await this.dealerService.deleteLeadSetting(Number.parseInt(id));
        return new SuccessResponse();
    }

    @Delete('/:id')
    async deactivate(
        @CurrentUser() user: TokenDTO,
        @Param('id') id: string,
    ): Promise<any> {
        await this.verifyAccess(ServiceCodes.DEALERSHIP, user, 'delete', id);
        await this.dealerService.deactivate(user, id);
        return new SuccessResponse();
    }

    @Post('/getDealershipIds')
    @HttpCode(HttpStatus.OK)
    async getDealershipByIds(
        @CurrentUser() user: TokenDTO,
        @Body() data: any
    ): Promise<any> {
        return new SuccessResponse(await this.dealerService.getDealershipByIds(user, data));
    }
}

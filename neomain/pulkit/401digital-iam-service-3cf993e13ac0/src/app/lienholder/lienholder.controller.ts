import { RequestQuery, SuccessResponse } from '@401_digital/xrm-core';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/core/auth.guard';
import { CurrentUser } from 'src/decorators';
import { TokenDTO } from '../auth/auth.dto';
import { AddLienholderDTO, LienholderQueryDTO, LienholderFilterDTO } from './lienholder.dto';
import { LienholderEntity } from './lienholder.entity';
import { LienholderService } from './lienholder.service';

@ApiTags('Lienholder')
@UseGuards(AuthGuard())
@Controller('lienholder')
export class LienholderController {
  constructor(private lienholderService: LienholderService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    description: 'Add lienhoder',
    type: AddLienholderDTO,
  })
  async addLienholder(
    @CurrentUser() user: TokenDTO,
    @Body() data: AddLienholderDTO,
  ) {
    const entity = Object.assign(
      new LienholderEntity(),
      data,
    ) as LienholderEntity;
    entity.dealerGroup = user.dealerGroup;
    entity.createdBy = user.id;
    entity.updatedBy = user.id;
    return this.lienholderService.save(entity);
  }

  @Get('/')
  @ApiQuery({ name: 'filter', type: LienholderQueryDTO })
  async getLienholders(
    @CurrentUser() user: TokenDTO,
    @Query() data: RequestQuery<LienholderFilterDTO>,
  ) {
    return new SuccessResponse(await this.lienholderService.getLienholders(user, data));
    //return this.lienholderService.getLienholders(user, data);
  }

  @Put('/:id')
  @ApiBody({
    description: 'Edit lienholder',
    type: AddLienholderDTO,
  })
  async editLienholders(
    @CurrentUser() user: TokenDTO,
    @Param('id') id: number,
    @Body() data,
  ) {
    const entity = Object.assign(
      new LienholderEntity(),
      data,
    ) as LienholderEntity;
    entity.id = id;
    entity.dealerGroup = user.dealerGroup;
    entity.updatedBy = user.id;
    return this.lienholderService.save(entity);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete lienholder' })
  async softDeletelienholder(@Param('id') id: number) {
    return this.lienholderService.softDeletelienholder(id);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get lienholder by id' })
  async getLienHolderById(@Param('id') id: number) {
    return this.lienholderService.getLienholderById(id);
  }
}

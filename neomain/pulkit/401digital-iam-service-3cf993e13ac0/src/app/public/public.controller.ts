import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SuccessResponse, BaseService } from '@401_digital/xrm-core';
import { ApiTags, ApiQuery, ApiBody } from '@nestjs/swagger';
import { PublicService } from './public.service';
import { PublicContactDTO } from './public.dto';

@ApiTags('Public')
@Controller('public')
export class PublicController {
  constructor(private publicService: PublicService) {}

  @ApiQuery({ name: 'filter' })
  @ApiQuery({ name: 'isVisible' })
  @Get('teams')
  async getTeams(@Query() query: any): Promise<any> {
    const base = new BaseService();
    const { filter } = base.getQuery(query)
    const response = await this.publicService.getTeams(filter,JSON.parse(query.isVisible));
    return new SuccessResponse(response);
  }

  @Get('locations')
  async getDealerships() {
    const dealerships = await this.publicService.getDealerships();
    return new SuccessResponse(dealerships);
  }

  @Post('contact')
  @ApiBody({ type: PublicContactDTO })
  async savePublicContact(@Body() payload: PublicContactDTO) {
    return new SuccessResponse(
      await this.publicService.savePublicContact(payload),
    );
  }

  @Get('province')
  async getProvince() {
    const province = await this.publicService.getProvince();
    return new SuccessResponse(province);
  }

  @Post('sendContactMail')
  async sendContactMail(@Body() payload: any) {
    return new SuccessResponse(
      await this.publicService.sendContactMail(payload),
    );
  }

}

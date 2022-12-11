import { Body, Controller, UseGuards, Post, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { SuccessResponse } from '@401_digital/xrm-core';
import { ResponseData } from '@model';
import { MessagingDTO } from './messaging.dto';
import { Messaging } from './messaging.service';
import { AuthGuard } from '../../core/auth.guard';
import { CurrentUser } from 'src/decorators';
import { TokenDTO } from '../auth/auth.dto';

@ApiTags('SMS')
@Controller('SMS')
export class MessagingController {
    constructor(private smsService: Messaging) { }
    @Post('sendSMS')
    @UseGuards(AuthGuard())
    async sendRequestForSMS(
        @CurrentUser() user: TokenDTO,
        @Body() data: MessagingDTO,
    ): Promise<any> {
        return await this.smsService.requestToSendSMS(user, data);
    }
    @Get('available-number')
    @UseGuards(AuthGuard())
    async getAvailableNumber(
        @CurrentUser() user: TokenDTO,
        @Query() query: any,
    ): Promise<any> {
        return await this.smsService.getAvailableNumber(user, query);
    }
    @Post('buy-number')
    @UseGuards(AuthGuard())
    async buyNumber(
        @CurrentUser() user: TokenDTO,
        @Body() body: any,
    ): Promise<any> {
        return await this.smsService.buyNumbers(user, body);
    }
}

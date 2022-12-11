import { RequestQuery, SuccessResponse } from '@401_digital/xrm-core';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';

import { CurrentUser } from 'src/decorators';

import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/core/auth.guard';

import { TokenDTO } from '../auth/auth.dto';
import { BaseController } from 'src/core/base.controller';
import { AppVersionService } from './app-version.service';
import { AppVersionDTO } from './app-version.dto';

import { UserAppLogsDTO } from './user-app-logs.dto';

@ApiTags('App Vesion')
@UseGuards(AuthGuard())
@Controller('app-version')
export class AppVersionController extends BaseController {
    constructor(private appVersionService: AppVersionService) {
        super();
    }

    @Post('/add/appVersion')
    public async createAppVersion(@CurrentUser() user: TokenDTO,@Body() dto: AppVersionDTO) {
        
        return new SuccessResponse(await this.appVersionService.createAppVersion(user, dto));
    }

    @Get('/get-all-active-versions')
    public async getAllAppVersion(@CurrentUser() user: TokenDTO) {
        
        return new SuccessResponse(await this.appVersionService.getAllAppVersion(user));
    }

    @Post('/user/checkAppVersion')
    public async checkUserApp(@CurrentUser() user: TokenDTO,@Body() dto: UserAppLogsDTO) {
        
        return new SuccessResponse(await this.appVersionService.checkUserApp(user, dto));
    }

    @Get('/get-all-user-logs')
    public async getAllUserLogs(@CurrentUser() user: TokenDTO) {
        
        return new SuccessResponse(await this.appVersionService.getAllUserLogs(user));
    }
}
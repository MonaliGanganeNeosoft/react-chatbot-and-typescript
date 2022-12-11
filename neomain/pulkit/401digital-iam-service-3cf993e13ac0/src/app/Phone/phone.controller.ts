import {Body, Controller, UseGuards, Post,Get,Param,Req } from '@nestjs/common';
import { ResponseData } from '@model';
import { SuccessResponse } from '@401_digital/xrm-core';
import { ApiTags } from '@nestjs/swagger/dist';
import {CallService} from './phone.service';
import { CurrentUser } from 'src/decorators';
import { AuthGuard } from '../../core/auth.guard';
import { TokenDTO } from '../auth/auth.dto';
import {PhoneDTO} from './phone.dto';


@ApiTags('phone')
@UseGuards(AuthGuard())
@Controller('phone')
export class PhoneController{
 constructor(private callService: CallService) {}
    
    @Get("sip")
    async senddata(@CurrentUser() user: TokenDTO):Promise<ResponseData>{
      const result=  await this.callService.getSipDetail(user)
        return  {"data": result}
    } 
    @Post('callingdata')
        async storecallogs(@Body() payload:PhoneDTO,@CurrentUser() user: TokenDTO):Promise<any>{
            const result =await this.callService.callLog(payload,user)
            return new SuccessResponse(result)
}
    @Get('calllogs')
    async getCallLog(@CurrentUser() user: TokenDTO):Promise<any>{
        const result=await this.callService.getLogs(user)
        return new SuccessResponse(result)
    }
}
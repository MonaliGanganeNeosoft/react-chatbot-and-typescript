import { SuccessResponse } from '@401_digital/xrm-core';
import { Body, Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/core/auth.guard';
import { CurrentUser } from 'src/decorators';
import { AuthDTO, ForgetPasswordDTO, PasswordUpdateDTO, SignOutDTO, TokenDTO, ResetPasswordDTO, changePasswordDTO, ZendeskPayloadDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { BaseController } from 'src/core/base.controller';
import { ServiceCodes } from 'src/constants';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController extends BaseController {
    constructor(private authService: AuthService) { super() }

    @Post('zendeskSSO')
    @HttpCode(200)
    async zendeskSSO(@Body() payload: ZendeskPayloadDTO) {
        const response = await this.authService.zendeskSSO(payload);
        return new SuccessResponse(response);
    }

    @Post('signin')
    @HttpCode(200)
    async signin(@Body() payload: AuthDTO) {
        const response = await this.authService.signin(payload);
        return new SuccessResponse(response);
    }

    @Post('signout')
    @HttpCode(200)
    async signout(@Request() req: Request) {
        const header = req.headers['authorization'];
        const payload = req.body as any as SignOutDTO;
        await this.authService.signout(header, payload);
        return new SuccessResponse("Logged Out Successfully");
    }

    @Post('forgetPassword')
    @HttpCode(200)
    async forgetPassword(@Body() payload: ForgetPasswordDTO) {
        const response = await this.authService.forgetPassword(payload);
        return new SuccessResponse(response);
    }

    @Post('updatePassword')
    @HttpCode(200)
    async updatePassword(@Body() payload: PasswordUpdateDTO) {
        const response = await this.authService.passwordUpdate(payload);
        return new SuccessResponse(response);
    }

    @Post('firstResetPassword')
    @HttpCode(200)
    @UseGuards(AuthGuard())
    async firstResetPassword(@CurrentUser() user: TokenDTO, @Body() payload: ResetPasswordDTO) {
        if (payload.isAdmin && payload.userId) {
            await this.verifyAccess(
                ServiceCodes.PASSWORD_UPDATE,
                user,
                'update'
            );
        }
        const response = await this.authService.firstResetPassword(user, payload);
        return new SuccessResponse(response);
    }

    @Post('changePassword')
    @HttpCode(200)
    @UseGuards(AuthGuard())
    async changePassword(@CurrentUser() user: TokenDTO, @Body() payload: changePasswordDTO) {
        const response = await this.authService.changePassword(user, payload);
        return new SuccessResponse(response);
    }
}

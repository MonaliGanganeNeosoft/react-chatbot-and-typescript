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
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ServiceCodes } from 'src/constants';
import { AuthGuard } from 'src/core/auth.guard';
import { BaseController } from 'src/core/base.controller';
import { CurrentUser } from 'src/decorators';
import { TokenDTO } from '../auth/auth.dto';
import {
    AddUsersDTO,
    CreateUserDTO,
    UpdateUserDTO,
    UserRoleDTO,
    UsersFilterDTO,
    UsersQueryDTO,
    UserImpersonationDTO,
    UpdateProfileDTO
} from './users.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@UseGuards(AuthGuard())
@Controller('users')
export class UsersController extends BaseController {
    constructor(private usersService: UsersService) {
        super();
    }

    @Get()
    @ApiQuery({ name: 'users', type: UsersQueryDTO })
    async get(@CurrentUser() user: TokenDTO, @Query() reqQuery: RequestQuery<UsersFilterDTO>): Promise<any> {
        await this.verifyAccess(ServiceCodes.USERS, user, 'read', reqQuery.filter && reqQuery.filter.dealershipId ? reqQuery.filter.dealershipId : user.dealership);
        return new SuccessResponse(await this.usersService.get(user, reqQuery));
    }

    @Post('/')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    async save(@UploadedFile() file: any, @CurrentUser() user: TokenDTO, @Body() payload: CreateUserDTO): Promise<any> {
        const data = JSON.parse(payload.data as any) as AddUsersDTO;
        const dtoClass = plainToClass(AddUsersDTO, data);
        const errors = await validate(dtoClass);
        if (errors.length) throw new BadRequestException(errors.map((el) => el.constraints));
        await this.verifyAccess(ServiceCodes.USERS, user, 'write', data.dealership && data.dealership.id ? data.dealership.id : user.dealership);
        return new SuccessResponse(await this.usersService.save(user, data, file));
    }

    @Put('/addRole')
    async addRole(@CurrentUser() user: TokenDTO, @Body() data: UserRoleDTO): Promise<any> {
        await this.verifyAccess(ServiceCodes.USERS, user, 'update', data.dealership ? data.dealership : user.dealership);
        await this.usersService.addRole(data);
        return new SuccessResponse();
    }

    @Get('/salesPerson')
    async getEmployee(@Query() query): Promise<any> {
        return new SuccessResponse(
            await this.usersService.getSalesPerson(query['employeeId'], query['serialNo']),
        );
    }

    @Get('/profile')
    async getProfile(@CurrentUser() user: TokenDTO): Promise<any> {
        return new SuccessResponse(await this.usersService.getProfile(user));
    }

    @Put('/profileImage')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    async updateProfileImage(@UploadedFile() file: any, @CurrentUser() user: TokenDTO): Promise<any> {
        if (!file) throw new BadRequestException('Image Not Found');
        this.usersService.updateProfileImage(user, file);
        return new SuccessResponse();
    }

    @Put('/profile')
    async updateProfile(@CurrentUser() user: TokenDTO, @Body() data: UpdateProfileDTO): Promise<any> {
        return new SuccessResponse(await this.usersService.updateProfile(user, data));
    }

    @Get('/:id')
    async getById(@CurrentUser() user: TokenDTO, @Param('id') id: string): Promise<any> {
        return new SuccessResponse(await this.usersService.getById(user, id));
    }

    @Put('/changeReportToUsers')
    async changeReportToUsers(@CurrentUser() user: TokenDTO, @Body() data: any): Promise<any> {
        await this.verifyAccess(ServiceCodes.DEALERSHIPTRANSFER, user, 'update');
        return new SuccessResponse(await this.usersService.changeReportToUsers(user, data));
    }

    @Put('/:id')
    async update(@CurrentUser() user: TokenDTO, @Param('id') id: string, @Body() data: UpdateUserDTO): Promise<any> {
        return new SuccessResponse(await this.usersService.update(user, id, data));
    }

    @Delete('/revokeRole/:id')
    async revokeRole(@CurrentUser() user: TokenDTO, @Param('id') id: string, @Query('dealershipId') dealership: string): Promise<any> {
        await this.verifyAccess(ServiceCodes.USERS, user, 'update', dealership ? dealership : user.dealership);
        return new SuccessResponse(await this.usersService.revokeRole(user, id));
    }

    @Put('image/:userId')
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    async uploadLogo(@CurrentUser() user: TokenDTO, @UploadedFile() file: any, @Param('userId') userId: string, @Query('dealershipId') dealership: string): Promise<any> {
        await this.verifyAccess(ServiceCodes.USERS, user, 'update', dealership ? dealership : user.dealership);
        if (!file) throw new BadRequestException('Image Not Found');
        await this.usersService.uploadImage(user, userId, file);
        return new SuccessResponse();
    }

    @Put('/userStatusUpdate/:id')
    async userStatusUpdate(@CurrentUser() user: TokenDTO, @Param('id') id: string, @Body() data: UpdateUserDTO): Promise<any> {
        return new SuccessResponse(await this.usersService.userStatusUpdate(user, id, data));
    }

    @Post('/impersonation')
    async userImpersonation(@CurrentUser() user: TokenDTO, @Body() data: UserImpersonationDTO): Promise<any> {
        await this.verifyAccess(ServiceCodes.IMPERSONATE, user, 'write');
        return new SuccessResponse(await this.usersService.userImpersonation(user, data));
    }

    @Post('/changeUserDealership')
    async changeUserDealership(@CurrentUser() user: TokenDTO, @Body() data: any): Promise<any> {
        await this.verifyAccess(ServiceCodes.DEALERSHIPTRANSFER, user, 'update');
        return new SuccessResponse(await this.usersService.changeUserDealership(user, data));
    }

}

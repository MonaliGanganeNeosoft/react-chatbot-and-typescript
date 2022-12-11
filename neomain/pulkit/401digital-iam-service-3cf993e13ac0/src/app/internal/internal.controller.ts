import { SuccessResponse } from '@401_digital/xrm-core';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TokenDTO } from '../auth/auth.dto';
import { EmployeeAccessDTO, SalesPersonDTO, UsersDTO } from './internal.dto';
import { BaseController } from 'src/core/base.controller';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { LeadmanagementService } from '../lead-management/lead-management.service';
import { InternalService } from './internal.service';
import { UsersService } from '../users/users.service';

@Controller('internal')
export class InternalController extends BaseController {
    constructor(
        private leadmanagementService: LeadmanagementService,
        private userService: UsersService,
        private internalService: InternalService,
    ) {
        super();
    }
    @Get('/employeeAccess')
    @ApiExcludeEndpoint()
    async employeeAccess(@Query() payload: EmployeeAccessDTO) {
        const accessReponse = await this.verifyAccess(
            payload.serviceType,
            {
                id: payload.userId,
                userLevel: payload.userLevel,
                dealership: payload.dealershipId,
            } as TokenDTO,
            payload.accessType as any,
        );
        return new SuccessResponse(accessReponse);
    }

    @Post('/salesPerson')
    @ApiExcludeEndpoint()
    async getSalesPerson(@Body() Payload: any) {
        console.log(Payload)
        const employee = await this.internalService.getSalesPerson(Payload);
        return new SuccessResponse(employee);
    }

    @Post('/getStaff')
    @ApiExcludeEndpoint()
    async get(@Body() payload: any): Promise<any> {
        const staffs = await this.leadmanagementService.getActiveStaff(
            payload.dealership,
        );
        return new SuccessResponse(staffs);
    }

    @Get('/getPhonebyid/:id')
    @ApiExcludeEndpoint()
    async getPhoneNumber(@Param() param: any) {
        return new SuccessResponse(
            await this.internalService.getPhoneNumber(param.id),
        );
    }

    @Get('/dealerGroupDetails/:id')
    @ApiExcludeEndpoint()
    async userDetails(@Param() Param: UsersDTO): Promise<any> {
        return new SuccessResponse(
            await this.internalService.getDealerGroupDetails(Param.id),
        );
    }


    @Get('/getStaffBy')
    @ApiExcludeEndpoint()
    async getStaffBy(@Query() Param: any): Promise<any> {
        const staff = await this.userService.getStaff(Param);
        return new SuccessResponse(staff);
    }

    @Get('/getHq')
    @ApiExcludeEndpoint()
    async getDealershipHq(): Promise<any> {
        const Hq = await this.userService.getDealershipHq();
        return new SuccessResponse(Hq);
    }

    @Get('/userRoles/:id')
    @ApiExcludeEndpoint()
    async getDealerships(@Param('id') userId: string): Promise<any> {
        return new SuccessResponse(await this.internalService.getUserRoles(userId));
    }

    @Post('/usersBydealerships')
    @ApiExcludeEndpoint()
    async usersByDealership(@Body() payload: any): Promise<any> {
        console.log('payload.employeeId :', payload.employeeId);
        return new SuccessResponse(await this.internalService.usersByDealership(payload.employeeId));
    }

    @Get('/getemployeeByDearship')
    @ApiExcludeEndpoint()
    async getemployeeByDearship(@Query() payload: any): Promise<any> {
        // console.log('payload >', payload);
        return new SuccessResponse(await this.internalService.getemployeeByDearship(payload));
    }

    @Get('/dealershipsByDealergroups')
    @ApiExcludeEndpoint()
    async dealershipsByDealergroups(@Query() payload: any): Promise<any> {
        // console.log('payload Lf : ', payload)
        return new SuccessResponse(await this.internalService.dealershipsByDealergroups(payload));
    }

    @Get('/users')
    @ApiExcludeEndpoint()
    async usersList(@Query() payload: any): Promise<any> {
        // console.log('payload Lf : ', payload)
        return new SuccessResponse(await this.internalService.usersList(payload));
    }

    @Get('/leadManager')
    @ApiExcludeEndpoint()
    async getLeadManager() {
        return new SuccessResponse(await this.internalService.getLeadManager());
    }


    @Get('/leadNotificationUsers')
    @ApiExcludeEndpoint()
    async getLeadNotificationUsers(@Query() query: any) {
        return new SuccessResponse(await this.internalService.getLeadNotificationUsers(query.dealershipId));
    }

    @Get('/getUserDetails/:userId')
    @ApiExcludeEndpoint()
    async getUserDetails(@Param() param: any) {
        return new SuccessResponse(await this.internalService.getUserDetails(param.userId));
    }

    @Post('/getPBSAndDabaduUsersBydealerships')
    @ApiExcludeEndpoint()
    async getUsersAsPerDealership(@Body() payload: any) {
        return new SuccessResponse(await this.internalService.getUsersAsPerDealership(payload));
    }

    @Post('/userProfiles')
    @ApiExcludeEndpoint()
    async getUserProfiles(@Body() payload: any) {
        return new SuccessResponse(await this.internalService.getUserProfiles(payload.reporters));
    }

    @Get('/reporters')
    @ApiExcludeEndpoint()
    async getReporters(@Query() query: any) {        
        return new SuccessResponse(await this.internalService.getReporters(query.id));
    }
}

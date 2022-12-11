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
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
    AddRoleDTO,
    DealershipRoleDTO,
    FormatRoleDTO,
    RoleDTO,
    RolesFilterDTO,
    RolesQueryDTO,
} from './roles.dto';
import { RolesService } from './roles.service';
import { RequestQuery, SuccessResponse } from '@401_digital/xrm-core';
import { RoleEntity } from './roles.entity';
import { AuthGuard } from 'src/core/auth.guard';
import { CurrentUser } from 'src/decorators';
import { TokenDTO } from '../auth/auth.dto';
import { Level, ServiceCodes } from 'src/constants';
import { BaseController } from 'src/core/base.controller';
import { PermissionsEntity } from './permission.entity';
import { RoleDealershipEntity } from './role-dealership.entity';

@ApiTags('Roles')
@UseGuards(AuthGuard())
@Controller('roles')
export class RolesController extends BaseController {
    constructor(private roleService: RolesService) {
        super();
    }


    private getRoleDealerships(dto: DealershipRoleDTO[]) {
        return this.roleService.getRoleDealership(dto);
    }

    private setDefault(user: TokenDTO, dto: AddRoleDTO) {
        const entity = Object.assign(new RoleEntity(), dto) as RoleEntity;

        if (user.userLevel == Level.ROOT) {
            if (dto.level == Level.ROOT) {
                if (dto.dealerships && dto.dealerships.length) {
                    entity.dealerships = this.getRoleDealerships(dto.dealerships)
                }
            }
            if (dto.level == Level.DEALERGROUP) {
                if (dto.dealerships && dto.dealerships.length) {
                    entity.dealerships = this.getRoleDealerships(dto.dealerships)
                } else {
                    throw new BadRequestException('at-least one dealerGroup is required');
                }
            }

            if (dto.level == Level.DEALERSHIP) {
                if (dto.dealerships && dto.dealerships.length) {
                    entity.dealerships = this.getRoleDealerships(dto.dealerships)
                } else {
                    throw new BadRequestException('at-least one dealership is required');
                }
            }
        }

        if (user.userLevel == Level.DEALERGROUP) {
            if (dto.level == Level.ROOT) throw new BadRequestException('Invalid Level');

            if (dto.level == Level.DEALERGROUP) {
                if (dto.dealerships && dto.dealerships.length) {
                    entity.dealerships = this.getRoleDealerships(dto.dealerships)
                }
            }

            if (dto.level == Level.DEALERSHIP) {
                if (dto.dealerships && dto.dealerships.length) {
                    entity.dealerships = this.getRoleDealerships(dto.dealerships)
                } else {
                    throw new BadRequestException('at-least one dealership is required');
                }
            }
        }

        if (user.userLevel == Level.DEALERSHIP) {
            if (dto.dealerships && dto.dealerships.length) {
                entity.dealerships = this.getRoleDealerships(dto.dealerships)
            }
            entity.level = Level.DEALERSHIP;
        }

        if ([Level.ROOT, Level.DEALERGROUP].includes(dto.level) && dto.canReceiveLeads) {
            throw new BadRequestException("Invalid Role: ROOT or DEALERGROUP level of user can't receive leads");
        }

        entity.createdBy = user.id;
        entity.updatedBy = user.id;
        entity.canReceiveLeads = dto.canReceiveLeads ? dto.canReceiveLeads : false;
        entity.isGM = dto.isGM ? dto.isGM : false;
        const permissions = [];

        dto.modules.forEach((el) => { permissions.push(...el.services) });

        if (permissions && permissions.length) entity.permissions = permissions.map((el) => Object.assign(new PermissionsEntity(), el));

        return entity;
    }

    @Post('/')
    public async create(@CurrentUser() user: TokenDTO, @Body() roleDTO: AddRoleDTO) {
        await this.verifyAccessByRoleDealership(ServiceCodes.ROLES, user, 'write', roleDTO.dealerships);
        const entity = this.setDefault(user, roleDTO);
        const dto = this.roleService.toDTO(await this.roleService.saveRole(user, entity));
        return new SuccessResponse(dto);
    }

    @Put('/:id')
    public async update(@CurrentUser() user: TokenDTO, @Body() roleDTO: RoleDTO, @Param('id') id: string) {
        await this.verifyAccessByRoleDealership(ServiceCodes.ROLES, user, 'update', roleDTO?.dealerships);
        return new SuccessResponse(await this.roleService.update(user, id, roleDTO));
    }

    @Get('/')
    @ApiQuery({ name: 'query', type: RolesQueryDTO })
    public async getAll(@CurrentUser() user: TokenDTO, @Query() reqQuery: RequestQuery<RolesFilterDTO>) {
        const dealership = reqQuery.filter && reqQuery.filter.dealershipId ? reqQuery.filter.dealershipId : user.dealership;
        await this.verifyAccess(ServiceCodes.ROLES, user, 'read', dealership);
        return new SuccessResponse(await this.roleService.getAll(user, reqQuery));
    }

    @Post('format')
    public async format(@CurrentUser() user: TokenDTO, @Body() dto: FormatRoleDTO) {
        if (!dto.level) throw new BadRequestException('Invalid level');
        await this.verifyAccessByRoleDealership(ServiceCodes.ROLES, user, 'read', dto.dealerships);
        return new SuccessResponse(await this.roleService.loadFormat(user, dto));
    }

    @Get('/:id')
    public async getById(@CurrentUser() user: TokenDTO, @Param('id') id: string) {
        return new SuccessResponse(await this.roleService.getById(user, id));
    }

    @Delete('/:id')
    public async deleteById(@CurrentUser() user: TokenDTO, @Param('id') id: string) {
        await this.verifyAccess(ServiceCodes.ROLES, user, 'delete', id);
        await this.roleService.deletetById(id);
        return new SuccessResponse();
    }
}

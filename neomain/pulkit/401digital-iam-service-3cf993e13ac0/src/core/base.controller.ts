/* eslint-disable prettier/prettier */
import { Level } from '@401_digital/xrm-core';
import { UnauthorizedException } from '@nestjs/common';
import { TokenDTO } from 'src/app/auth/auth.dto';
import { PermissionsEntity } from 'src/app/user-roles/permission.entity';
import { RoleEntity } from 'src/app/user-roles/roles.entity';
import { UserRoleEntity } from 'src/app/users/user-roles.entity';
import { Brackets, getRepository } from 'typeorm';
import { CoreService } from './core.service';
import * as lodash from 'lodash';
import { RoleDealershipEntity } from 'src/app/user-roles/role-dealership.entity';
import { DealershipRoleDTO } from 'src/app/user-roles/roles.dto';

export class BaseController extends CoreService {

    private throwException(userId: string, serviceType: string, accessType: string, dealership?: string) {
        let message = `AccessDenied: User ${userId} is not granted ${accessType.toUpperCase()} permission for service ${serviceType} `;
        if (dealership) message = message.concat(`for dealership ${dealership}`);
        throw new UnauthorizedException(message);
    }

    public async verifyAccess(serviceType: string, user: TokenDTO, accessType: 'read' | 'write' | 'update' | 'delete', dealership?: string, dealerGroup?: string) {
        const userRoleQb = getRepository(UserRoleEntity)
            .createQueryBuilder('userRole')
            .addSelect(['dealership.id', 'dealership.name', 'dealerGroup.id', 'dealerGroup.name'])
            .leftJoinAndSelect('userRole.role', 'role')
            .leftJoinAndSelect('role.dealerships', 'dealerships')
            .leftJoin('dealerships.dealership', 'dealership')
            .leftJoin('dealerships.dealerGroup', 'dealerGroup')
            .leftJoinAndSelect('role.permissions', 'permissions')
            .leftJoinAndSelect('userRole.user', 'user')
            .leftJoinAndSelect('user.dms', 'userDms')
            .leftJoinAndSelect('userDms.dms', 'dms')
            .where('userRole.user = :user', {
                user: user.id,
            });

        if (user.userLevel == Level.DEALERSHIP) {
            userRoleQb.andWhere('userRole.dealership = :dealership AND dealership.id = :dealership', {
                dealership: user.dealership
            })
        }

        if (dealerGroup && dealerGroup.trim()) {
            userRoleQb.andWhere((qp) => {
                qp.orWhere("role.level = 'ROOT' AND (role.isDefault = :isDefault OR dealeGroup.id = :dealerGroup)", {
                    dealerGroup: dealerGroup,
                    isDefault: true
                })
                qp.orWhere("role.level IN ('DEALERGROUP', 'DEALERSHIP') AND dealeGroup.id = :dealerGroup", {
                    dealerGroup: dealerGroup
                })
            })
        }

        if (dealership && dealership.trim()) {
            userRoleQb.andWhere(new Brackets((qb) => {
                qb.orWhere("role.level = 'ROOT' AND (role.isDefault = :isDefault OR dealership.id = :dealership)", {
                    dealership: dealership,
                    isDefault: true
                })

                qb.orWhere("role.level = 'DEALERGROUP' AND (role.isDefault = :isDefault OR dealership.id = :dealership)", {
                    dealership: dealership,
                    isDefault: true
                })
                qb.orWhere('userRole.dealership = :dealership', {
                    dealership: dealership
                })
            }))
        }


        const userRole = await userRoleQb.getOne();

        const invalidAccess = () => this.throwException(user.id, serviceType, accessType, dealership ? dealership : user.dealership);

        if (!userRole) invalidAccess();

        const role = userRole.role as RoleEntity;
        if (!role) invalidAccess();
        const permission = role.permissions;
        if (!permission) invalidAccess();

        const access = permission.find((per) => per.serviceType == serviceType);
        if (!access) invalidAccess()

        const invalidGranted = (accessType: string, access: PermissionsEntity) => (accessType == 'read' && !access.canRead) || (accessType == 'write' && !access.canWrite) || (accessType == 'update' && !access.canUpdate) || (accessType == 'delete' && !access.canDelete);
        if (invalidGranted(accessType, access)) invalidAccess();

        const reporters = await this.privateGetAllReporters(user.id);

        return {
            ...userRole,
            reporters: reporters
        };
    }


    public async verifyAccessByRoleDealership(serviceType: string, user: TokenDTO, accessType: 'read' | 'write' | 'update' | 'delete', dealerships: DealershipRoleDTO[]) {

        const userRoleQb = getRepository(UserRoleEntity)
            .createQueryBuilder('userRole')
            .leftJoinAndSelect('userRole.role', 'role')
            .leftJoinAndSelect('role.dealerships', 'dealerships')
            .leftJoinAndSelect('role.permissions', 'permissions')
            .where('userRole.user = :user', { user: user.id });

        //const m = lodash.chain(dealerships).groupBy('dealerGroup').map((value, key) => ({ dealerGroup: key, dealerships: value.map(q => q.dealership) })).value();

        const userRole = await userRoleQb.getOne();

        const invalidAccess = () => this.throwException(user.id, serviceType, accessType);

        if (!userRole) invalidAccess();

        const role = userRole.role as RoleEntity;
        if (!role) invalidAccess();

        let roleDealerships = role.dealerships;

        if (roleDealerships?.length) {
            const ids = roleDealerships.map(el => el.id);
            roleDealerships = await getRepository(RoleDealershipEntity)
                .createQueryBuilder('ds')
                .select('ds.id', 'id')
                .addSelect('ds.role', 'role')
                .addSelect('ds.dealership', 'dealership')
                .addSelect('ds.dealerGroup', 'dealerGroup')
                .whereInIds(ids)
                .andWhere('ds.dealership IS NOT NULL AND ds.dealerGroup IS NOT NULL')
                .getRawMany()
        }

        const dgs = dealerships?.map(p => p.dealerGroupId);

        if (user.userLevel == Level.ROOT) {
            if (roleDealerships && roleDealerships.length) {
                const all = roleDealerships.every(p => dgs.includes(p.dealerGroup.toString()))
                if (!all) invalidAccess();
            }
        }

        if (user.userLevel == Level.DEALERGROUP || user.userLevel == Level.DEALERSHIP) {
            if (dealerships.length > 1) invalidAccess();
            const targetDealerGroup = dealerships?.find(p => p.dealerGroupId == user.dealerGroup);
            if (targetDealerGroup && targetDealerGroup.dealerships && targetDealerGroup.dealerships.length) {
                const dls = roleDealerships.every(p => targetDealerGroup.dealerships.includes(p.dealership.toString()))
                if (!dls) invalidAccess();
            }
        }

        const permission = role.permissions;
        if (!permission) invalidAccess();

        const access = permission.find((per) => per.serviceType == serviceType);
        if (!access) invalidAccess()

        const invalidGranted = (accessType: string, access: PermissionsEntity) => (accessType == 'read' && !access.canRead) || (accessType == 'write' && !access.canWrite) || (accessType == 'update' && !access.canUpdate) || (accessType == 'delete' && !access.canDelete);
        if (invalidGranted(accessType, access)) invalidAccess();

        return userRole;
    }
}

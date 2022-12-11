import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { PermissionsEntity } from '../user-roles/permission.entity';
import { RoleDealershipEntity } from '../user-roles/role-dealership.entity';
import { RoleEntity } from '../user-roles/roles.entity';
import { RolesService } from '../user-roles/roles.service';
import { UsersEntity } from '../users/users.entity';

@Injectable()
export class DashboardService {
    constructor(private roleService: RolesService) { }
    async loadDashboard(userId: string) {
        const userRepo = getRepository(UsersEntity);
        const user = await userRepo.findOne({
            where: {
                id: userId,
            },
            relations: [
                'dealership',
                'department',
                'userRoles',
                'userRoles.dealership',
                'userRoles.role',
                'userRoles.role.permissions',
                'dealerGroup',
                'profile',
            ],
            select: [
                'id',
                'userLevel',
                'username',
                'dealership',
                'department',
                'dealerGroup',
                'profile',
            ],
        });

        const dashboardPermissions = [] as PermissionsEntity[];
        user.userRoles.forEach((el) => {
            const permission = (el.role as RoleEntity).permissions;
            permission.forEach((p) => {
                const has = dashboardPermissions.find(
                    (ds) => ds.serviceType == p.serviceType,
                );
                if (!has && p.canRead) {
                    dashboardPermissions.push(p);
                }
            });
        });


        const roleId = (user?.userRoles[0]?.role as RoleEntity)?.id;

        const dealerships = await getRepository(RoleDealershipEntity).createQueryBuilder('rd')
            .select('rd.id', 'id')
            .addSelect('dealerGroup.id', 'dealerGroupId')
            .addSelect('dealerGroup.name', 'dealerGroupName')
            .addSelect('dealership.id', 'dealershipId')
            .addSelect('dealership.name', 'dealershipName')
            .leftJoin('rd.dealerGroup', 'dealerGroup')
            .leftJoin('rd.dealership', 'dealership')
            .where('rd.role = :role AND rd.dealerGroup IS NOT NULL', { role: roleId })
            .getRawMany();

        const formatDealerships = [];

        dealerships.forEach(p => {
            const index = formatDealerships.findIndex(q => q.dealerGroupId == p.dealerGroupId);
            if (index == -1) {
                formatDealerships.push({
                    dealerGroupId: p.dealerGroupId,
                    dealerGroupName: p.dealerGroupName,
                    dealerships: p.dealershipId ? [
                        {
                            dealershipId: p.dealershipId,
                            dealershipName: p.dealershipName
                        }
                    ] : []
                })
            } else {
                if (formatDealerships[index] && (!formatDealerships[index].dealerships || formatDealerships[index].dealerships.length == 0)) {
                    formatDealerships[index].dealerships = [];
                } else {
                    if (p.dealershipId) {
                        formatDealerships[index].dealerships.push({
                            dealershipId: p.dealershipId,
                            dealershipName: p.dealershipName
                        })
                    }
                }
            }
        })

        const dashboard = {
            user: user,
            dealerships: formatDealerships,
            sideNav: this.roleService.getModules(dashboardPermissions),
        };

        return dashboard;
    }
}

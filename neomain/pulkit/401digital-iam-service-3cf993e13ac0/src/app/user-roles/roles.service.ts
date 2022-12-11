import { BadRequestException, Injectable } from '@nestjs/common';
import { getConnection, getManager, getRepository, ILike, In, Like, Not, QueryRunner } from 'typeorm';
import { PermissionsEntity } from './permission.entity';
import { RoleEntity } from './roles.entity';
import { UserRoleEntity } from '../users/user-roles.entity';
import { TokenDTO } from '../auth/auth.dto';
import {
    AppModuleList,
    Level,
} from 'src/constants';
import { BaseService, RequestQuery, DabaduServiceCodes as ServiceCodes, DabaduServiceNames as ServiceNames } from '@401_digital/xrm-core';
import { PermissionsDTO, RoleDTO, RolesFilterDTO, AddRoleDTO, DealershipRoleDTO, FormatRoleDTO } from './roles.dto';
import { paginateRaw, paginate } from 'nestjs-typeorm-paginate';
import { UsersEntity } from '../users/users.entity';
import { RoleDealershipEntity } from './role-dealership.entity';
import * as lodash from 'lodash';

@Injectable()
export class RolesService extends BaseService {
    saveUserRoles(userRole: UserRoleEntity) {
        return getRepository(UserRoleEntity)
            .createQueryBuilder()
            .insert()
            .values(userRole)
            .onConflict('ON CONSTRAINT uk_userroles DO NOTHING')
            .execute();
    }

    public getRoleDealership(dto: DealershipRoleDTO[]) {
        const dealerships: RoleDealershipEntity[] = [];
        dto.forEach(p => {
            if (p.dealerGroupId && !isNaN(p.dealerGroupId as any)) {
                if (!p.dealerships || p.dealerships.length == 0) {
                    dealerships.push({
                        dealerGroup: p.dealerGroupId,
                        dealership: null,
                    } as RoleDealershipEntity)
                } else {
                    p.dealerships.forEach(dealership => {
                        dealerships.push({
                            dealerGroup: p.dealerGroupId,
                            dealership: dealership,
                        } as RoleDealershipEntity)
                    })
                }
            }

        });
        return dealerships;
    }

    async validate(roleEntity: RoleEntity, id = null) {
        const roleQB = getRepository(RoleEntity).createQueryBuilder('role')
            .leftJoin('role.dealerships', 'dealerships')


        if (roleEntity.name) {
            roleQB.andWhere('role.name ILIKE :roleName', { roleName: roleEntity.name })
        }

        if (roleEntity.level) {
            roleQB.andWhere('role.level = :roleLevel', { roleLevel: roleEntity.level })
        };

        if (id) {
            roleQB.andWhere('role.id IS NOT :id', { id })
        }

        const dealerships = roleEntity.dealerships;
        const dgs = new Set(dealerships.map(el => el.dealerGroup));
        const dealershipIds = new Set(dealerships.map(el => el.dealership));

        if (dgs.size) {
            roleQB.andWhere('dealerships.dealerGroup IN (:...dealerGroupIds)', { dealerGroupIds: Array.from(dgs) })
        }

        if (dealershipIds.size) {
            roleQB.andWhere('dealerships.dealership IN (:...dealerships)', { dealerships: Array.from(dealershipIds) })
        }

        const exists = await roleQB.getRawOne();

        if (exists) throw new BadRequestException('Invalid Role: Duplicate Role')
    }

    async saveRole(user: TokenDTO, role: RoleEntity) {
        await this.validate(role);
        if (user.userLevel != Level.ROOT) {
            const userPermissions = await this.getCurrentUserPermissions(user, (role?.dealerships as any[])?.map(el => el?.dealership));
            role.permissions = this.validatePermissions(role.permissions, userPermissions);
        }
        return getRepository(RoleEntity).save(role);
    }

    async validateAndSavePermissions(id: string, rest: any, user: TokenDTO, modules: any[]) {
        if (modules && modules.length) {
            let permissions = [];
            modules.forEach((el) => {
                permissions.push(...el.services);
            });
            if (permissions && permissions.length) {
                if (user.userLevel != Level.ROOT) {
                    const userPermissions = await this.getCurrentUserPermissions(user, rest?.dealerships?.map(el => el.dealership));
                    permissions = this.validatePermissions(permissions, userPermissions);
                }
                await this.savePermissions(
                    permissions.map((permission) => {
                        permission.role = id;
                        return permission;
                    }),
                );
            }
        }
    }

    async update(user: TokenDTO, id: string, dto: RoleDTO) {
        const { modules, ...rest } = dto;

        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const found = await queryRunner.manager.getRepository(RoleEntity).findOne({
                where: { id: id },
                relations: ['dealerships']
            });

            if (!found) throw new BadRequestException('Invalid Role Id');

            const entity = new RoleEntity();
            entity.id = id;
            entity.updatedBy = user.id;

            if (found?.dealerships?.length) {
                found.dealerships = await this.getRoleDealershipsByIds(found.dealerships.map(p => p.id));
            }

            if (rest.name) {
                if (!found.isDefault) entity.name = dto.name;
                else delete entity.name;
            }

            if (typeof rest.active == 'boolean') entity.active = dto.active;

            if (dto?.dealerships?.length) {
                const dealerships = this.getRoleDealership(dto?.dealerships).map((el) => ({ role: id, ...el } as RoleDealershipEntity));
                await this.saveDealerships(queryRunner, dealerships, found.dealerships);
            }

            const roleData = await queryRunner.manager.getRepository(RoleEntity).save(entity);
            /** Save Permissions */

            await this.validateAndSavePermissions(id, rest, user, modules);

            dto.id = roleData.id;
            await queryRunner.commitTransaction();
            return dto;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getAll(user: TokenDTO, reqQuery: RequestQuery<RolesFilterDTO>) {
        const { filter, sort, pagination } = this.getQuery(reqQuery);
        const active = typeof filter.active == 'boolean' && filter.active != undefined ? filter.active : true;

        const repo = getRepository(RoleEntity)
            .createQueryBuilder('role')
            .select('role.id', 'roleId')
            .addSelect('role.name', 'roleName')
            .addSelect('role.level', 'level')
            .addSelect('role.canReceiveLeads', 'canReceiveLeads')
            .addSelect('role.active', 'active')
            .addSelect('role.createdAt', 'createdAt')
            .addSelect('role.updatedAt', 'updatedAt')
            .addSelect((qb) => {
                return qb.subQuery().select('count(distinct(users.id))', 'userCount')
                    .from(UserRoleEntity, 'userRoles')
                    .innerJoin(UsersEntity, 'users', 'users.active = :active AND users.id = userRoles.userId', { active: active })
                    .where('role.id = userRoles.roleId')
            }, 'userCount')
            .leftJoin('role.dealerships', 'dealerships')
            .leftJoin('dealerships.dealership', 'dealership')
            .leftJoin('dealerships.dealerGroup', 'dealerGroup')

        /** Core Filters */

        const roleDealershipsQB = getRepository(RoleDealershipEntity)
            .createQueryBuilder('rd')
            .select('rd.id', "id")
            .addSelect('rd.role', 'role')
            .addSelect('dealership.id', 'dealershipId')
            .addSelect('dealership.name', 'dealershipName')
            .addSelect('dealerGroup.id', 'dealerGroupId')
            .addSelect('dealerGroup.name', 'dealerGroupName')
            .leftJoin('rd.dealership', 'dealership')
            .leftJoin('rd.dealerGroup', 'dealerGroup')


        repo.where('role.active = :active', { active: active });

        // repo.andWhere('users.active = :active', { active: active });

        repo.andWhere('role.id NOT IN (:...ids)', {
            ids: user.roles
        })

        if (user.userLevel == Level.DEALERGROUP) {
            filter.dealerGroupId = user.dealerGroup;
        }

        if (user.userLevel == Level.DEALERSHIP) {
            filter.dealerGroupId = user.dealerGroup;
            filter.dealershipId = filter.dealershipId
                ? filter.dealershipId
                : user.dealership;
        }

        if (filter.level) {
            repo.andWhere('role.level = :level', {
                level: filter.level,
            });
        }

        if (filter.dealerGroupId) {
            repo.andWhere('dealerGroup.id = :dealerGroupId', {
                dealerGroupId: filter.dealerGroupId,
            });
            roleDealershipsQB.andWhere('dealerGroup.id = :dealerGroupId', {
                dealerGroupId: filter.dealerGroupId,
            })
        }

        if (filter.dealershipId) {
            repo.andWhere('dealership.id = :dealershipId', {
                dealershipId: filter.dealershipId,
            });
            roleDealershipsQB.andWhere('dealership.id = :dealershipId', {
                dealershipId: filter.dealershipId,
            });
        }

        /** Other Filters */
        if (filter.dealershipName) {
            repo.andWhere('dealership.name ILIKE :dealershipName', {
                dealershipName: `%${filter.dealershipName}%`,
            });
            roleDealershipsQB.andWhere('dealership.name ILIKE :dealershipName', {
                dealershipName: `%${filter.dealershipName}%`,
            });
        }
        if (filter.dealerGroupName) {
            repo.andWhere('dealerGroup.name ILIKE :dealerGroupName', {
                dealerGroupName: `%${filter.dealerGroupName}%`,
            });
            roleDealershipsQB.andWhere('dealerGroup.name ILIKE :dealerGroupName', {
                dealerGroupName: `%${filter.dealerGroupName}%`,
            });
        }

        if (filter.name) {
            repo.andWhere('role.name ILIKE :roleName', {
                roleName: `%${filter.name}%`,
            });
        }
        if (typeof filter.active == 'boolean' && filter.active != undefined) {
            repo.andWhere('role.active = :active', {
                active: filter.active,
            });
        }

        /** Sorting */
        if (!Object.keys(sort).length) {
            repo.orderBy('role.createdAt', 'DESC');
        }

        if (sort.roleName) {
            repo.orderBy('role.name', sort.roleName.toUpperCase());
        }

        if (sort.userCount) {
            repo.orderBy('"userCount"', sort.userCount.toUpperCase());
        }

        repo.groupBy('role.id')

        const response = await paginateRaw(repo, pagination);


        const roleIds = response.items.map((el: any) => el.roleId);

        let groupByDealerships = [];

        if (roleIds?.length) {
            roleDealershipsQB.andWhere('rd.role IN (:...roleIds)', { roleIds: roleIds })

            const dealerships = await roleDealershipsQB.getRawMany();

            groupByDealerships = lodash.chain(dealerships).groupBy('role').map((value, key) => ({ role: key, dealerships: value })).value()
        }


        const items: Array<{
            roleId: string,
            roleName: string,
            active: boolean,
            createdAt: Date,
            updatedAt: Date,
            userCount: number,
            level: string,
            canReceiveLeads: boolean,
            dealerships: Array<{
                dealershipId: string,
                dealershipName: string,
                dealerGroupId: string,
                dealerGroupName: string,
            }>
        }> = [];

        response.items.map((el: any) => {
            const item = items.findIndex(i => i.roleId == el.roleId);
            const dealerships = groupByDealerships.find(gd => gd.role == el.roleId)?.dealerships;
            if (item == -1) {
                items.push({
                    roleId: el.roleId,
                    roleName: el.roleName,
                    level: el.level,
                    active: el.active,
                    createdAt: el.createdAt,
                    updatedAt: el.updatedAt,
                    userCount: el.userCount,
                    canReceiveLeads: el.canReceiveLeads,
                    dealerships: dealerships ? dealerships : []
                })
            } else {
                items[item].dealerships.push(dealerships ? dealerships : [])
            }
        })

        return {
            items,
            meta: response.meta,
        };
    }


    async getRoleDealershipsByIds(ids: number[], filter = null) {
        const qb = getRepository(RoleDealershipEntity)
            .createQueryBuilder('ds')
            .select('ds.id', 'id')
            .addSelect('ds.role', 'role')
            .addSelect('ds.dealership', 'dealership')
            .addSelect('ds.dealerGroup', 'dealerGroup')
            .andWhere('ds.dealerGroup IS NOT NULL AND ds.dealership IS NOT NULL')
            .whereInIds(ids)
        if (filter?.role) {
            qb.andWhere('ds.role = :role', {
                role: filter.role
            })
        }
        if (filter?.dealerGroup) {
            qb.andWhere('ds.dealerGroup = :dealerGroup', {
                dealerGroup: filter.dealerGroup
            })
        }

        if (filter?.dealership) {
            qb.andWhere('ds.dealership = :dealership', {
                dealership: filter.dealership
            })
        }

        return qb.getRawMany();
    }

    async getById(user: TokenDTO, id: string) {
        const qb = getRepository(RoleEntity).createQueryBuilder('role')
            .leftJoinAndSelect('role.dealerships', 'd')
            .leftJoinAndSelect('role.permissions', 'permissions')
            .where('role.id = :roleId', { roleId: id });

        const entity = await qb.getOne();

        if (!entity) {
            throw new BadRequestException('Invalid Role Id');
        }

        const dealerships = entity.dealerships.map(el => el.id);

        let filter = { role: id } as any;

        if (user.userLevel == Level.DEALERGROUP) {
            filter.dealerGroup = user.dealerGroup
        }

        if (user.userLevel == Level.DEALERSHIP) {
            filter.dealership = user.dealership
        }

        const ds = await this.getRoleDealershipsByIds(dealerships, filter);

        if ([Level.DEALERGROUP, Level.DEALERSHIP].includes(user.userLevel as Level) && !ds.length) {
            throw new BadRequestException('Invalid Role: Invalid Role Selected');
        }

        entity.dealerships = ds;

        return this.toDTO(entity);
    }

    toDTO(entity: RoleEntity) {
        const dto = new RoleDTO();
        dto.id = entity.id;
        dto.name = entity.name;
        dto.active = entity.active;
        dto.level = entity.level;
        dto.isDefault = entity.isDefault;
        dto.modules = this.getModules(entity.permissions);
        dto.dealerships = this.toRoleDealershipDTO(entity.dealerships);
        dto.canReceiveLeads = entity.canReceiveLeads;
        dto.isGM = entity.isGM;
        return dto;
    }

    toRoleDealershipDTO(entities: RoleDealershipEntity[]) {
        const dto = lodash.chain(entities).groupBy('dealerGroup').map((value, key) => ({
            dealerGroupId: key,
            dealerships: value.filter(p => p.dealership).map(q => q.dealership)
        })).value()

        return dto as any as DealershipRoleDTO[];
    }

    async deletetById(id: string) {
        return getRepository(RoleEntity).update({ id: id }, { active: false });
    }

    async saveDealerships(queryRunner: QueryRunner, newRoleDealerships: RoleDealershipEntity[], foundRoleDealerships: RoleDealershipEntity[]) {
        let addedDealerships = [], removedDealerships = [];
        console.log("newRoleDealerships  == ", newRoleDealerships);
        newRoleDealerships.forEach(p => {
            const found = foundRoleDealerships.findIndex(q => p.dealerGroup == q.dealerGroup && p.dealership == q.dealership);
            if (found == -1) {
                addedDealerships.push(p)
            }
        })

        foundRoleDealerships.forEach(p => {
            const found = newRoleDealerships.findIndex(q => p.dealerGroup == q.dealerGroup && p.dealership == q.dealership);


            console.log("found ===== " ,found);
            if (found == -1) {
                removedDealerships.push(p)
            }
        })

        if (addedDealerships.length || removedDealerships.length) {
            if (addedDealerships.length) {
                await queryRunner.manager.getRepository(RoleDealershipEntity).save(addedDealerships);
            }

            if (removedDealerships.length) {
                await queryRunner.manager.getRepository(RoleDealershipEntity).delete({ id: In(removedDealerships.map(el => el.id)) });
            }
        }
    }

    async savePermissions(permissions: PermissionsEntity[]) {
        permissions = permissions.map((p) =>
            Object.assign(new PermissionsEntity(), p),
        );
        const permissionsRepo = getRepository(PermissionsEntity);
        const dontUpdate = ['id'];
        const keys = permissionsRepo.metadata.ownColumns
            .map((column) => column.databaseName)
            .filter((key) => !dontUpdate.includes(key));
        const updateStr = keys
            .map((key) => `"${key}" = EXCLUDED."${key}"`)
            .join(',');
 
        console.log(" permissions ===",permissions);    
        console.log("updateStr ===== ", updateStr);    
        return permissionsRepo
            .createQueryBuilder()
            .insert()
            .values(permissions)
            .onConflict(`ON CONSTRAINT uk_permissions DO UPDATE SET ${updateStr}`)
            .execute();
    }

    private getCommonPermissions(allPermissions: PermissionsEntity[][]) {
        let merge = allPermissions.reduce((a, b) => a.concat(b));
        const groupBy = (x, f) => x.reduce((a, b) => ((a[f(b)] ||= []).push(b), a), {});
        merge.sort((a, b) => {
            const countA = Object.keys(a).filter(aK => a[aK] === true).length;
            const countB = Object.keys(b).filter(aK => b[aK] === true).length;
            if ((a.serviceType >= b.serviceType) && (countA <= countB)) {
                return 1
            }
            return -1
        })
        merge = groupBy(merge, v => v.role);
        const final = []
        Object.keys(merge).forEach(key => {
            final.push(merge[key])
        })
        const permission = final.reduce((acc, arr) => acc.filter(i => arr.some(j => i.serviceType == j.serviceType)));

        return permission;
    }

    private async getCurrentUserPermissions(user: TokenDTO, dealershipIds?: string[]) {
        const qb = getRepository(UserRoleEntity).createQueryBuilder('userRole')
            .innerJoinAndSelect('userRole.role', 'role')
            .leftJoinAndSelect('role.permissions', 'permissions')
            .where('userRole.user = :userId', {
                userId: user.id
            })

        if (user.userLevel == Level.DEALERSHIP) {
            qb.andWhere('userRole.user = :userId AND userRole.dealership IN (:...ids)', { userId: user.id, ids: dealershipIds && dealershipIds.length ? dealershipIds : [user.dealership] })
        }

        const currentUserRole = await qb.getMany();
        const allPermissions = currentUserRole.map(el => (el.role as RoleEntity).permissions);

        return this.getCommonPermissions(allPermissions);
    }

    private validatePermissions(payloadPermissions: PermissionsEntity[], userPermissions: PermissionsEntity[]) {
        const services = Object.values(ServiceCodes);
        payloadPermissions.forEach((p1, index) => {
            if (!services.includes(p1.serviceType as ServiceCodes)) {
                throw new BadRequestException(
                    `Invalid Service Type : ${p1.serviceType}`,
                );
            }
            const up = userPermissions.find((up) => up.serviceType == p1.serviceType);
            if (!up) {
                // throw new BadRequestException(
                //     `You dont have Access for Granting Permissions of ${p1.serviceType}`,
                // );
                delete payloadPermissions[index]
            }
            if (
                (p1.canRead && !up.canRead) ||
                (p1.canWrite && !up.canWrite) ||
                (p1.canUpdate && !up.canUpdate) ||
                (p1.canDelete && !up.canDelete)
            ) {
                throw new BadRequestException(
                    `You dont have Access for Granting Permissions of ${p1.serviceType}`,
                );
            }
        });

        return payloadPermissions.filter(el => el);
    }

    public getModules(permissions) {
        const appModuleList = [];
        const serviceCodes = Object.values(ServiceCodes);
        AppModuleList.forEach((m: any) => {
            const obj = {
                name: m.name,
                code: m.code,
            } as any;
            const services = serviceCodes
                .filter((p) => m.serviceCodes.includes(p))
                .map((code) => {
                    const found = permissions.find((el) => el.serviceType == code);
                    const dto = new PermissionsDTO();
                    dto.serviceType = code;
                    dto.serviceName = ServiceNames[code];
                    if (found) {
                        dto.canRead = found.canRead;
                        dto.canWrite = found.canWrite;
                        dto.canUpdate = found.canUpdate;
                        dto.canDelete = found.canDelete;
                    } else {
                        dto.canRead = false;
                        dto.canWrite = false;
                        dto.canUpdate = false;
                        dto.canDelete = false;
                    }
                    return dto;
                });
            obj.services = services;
            obj.isEnabled = services.findIndex((s) => s.canRead) != -1;
            appModuleList.push(obj);
        });
        return appModuleList;
    }

    private validateRoleLevel(user: TokenDTO, role: any, level, dealerships) {
        if (user.userLevel == Level.ROOT) {
            if (level == Level.DEALERSHIP) {
                if (!Array.isArray(dealerships) || !dealerships.length) {
                    throw new BadRequestException(
                        'dealerGroupId and at-least one dealership is required',
                    );
                }
            }
        }
        if (user.userLevel == Level.DEALERGROUP) {
            if (level == Level.ROOT) {
                throw new BadRequestException('Invalid Level');
            }

            if (level == Level.DEALERSHIP) {
                if (!Array.isArray(dealerships) || !dealerships.length) {
                    throw new BadRequestException(
                        'at-least one dealership is required',
                    );
                }
            }
        }
        if (user.userLevel == Level.DEALERSHIP) {
            if (level == Level.ROOT || level == Level.DEALERGROUP) {
                throw new BadRequestException('Invalid Level');
            }
        }
        return role;
    }

    async loadFormat(user: TokenDTO, dto: FormatRoleDTO) {
        let role = new RoleDTO();
        const level = dto.level;
        role = this.validateRoleLevel(user, role, level, dto.dealerships);
        role.name = dto.name;
        role.active = true;
        role.level = level;
        role.canReceiveLeads = false;
        role.dealerships = dto.dealerships;
        if(dto.copiedFrom){
            const qb = getRepository(RoleEntity).createQueryBuilder('role')
            .leftJoinAndSelect('role.dealerships', 'd')
            .leftJoinAndSelect('role.permissions', 'permissions')
            .where('role.id = :roleId', { roleId: dto.copiedFrom });

        const entity = await qb.getOne();

        if (!entity) {
            throw new BadRequestException('Invalid Role Id');
        }
        role.modules = this.getModules(entity.permissions);
        return role;
        }
        const permissions = await this.getCurrentUserPermissions(user, this.getRoleDealership(dto.dealerships).map(el => el?.dealership?.toString()));
        if (user.userLevel == Level.ROOT) {
            Object.values(ServiceCodes).forEach((serviceType) => {
                const service = permissions.find((p) => p.serviceType == serviceType);
                if (!service) {
                    permissions.push({
                        serviceType: serviceType,
                        canRead: false,
                        canWrite: false,
                        canDelete: false,
                        canUpdate: false,
                    } as any);
                }
            });
        }
        role.modules = this.getModules(permissions);
        return role;
    }
}

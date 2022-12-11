import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountStatus, DataSources, Level } from 'src/constants';
import { AwsService } from 'src/configs';

import {
    DefaultDealerGroupUser,
    DefaultDepartment,
    GeneralManagerRole,
} from 'src/configs/default';
import { SecurityHelper } from 'src/helpers/security';
import { Brackets, getConnection, getRepository, ILike, Not, Repository } from 'typeorm';
import { RoleEntity } from '../user-roles/roles.entity';
import { UsersEntity } from '../users/users.entity';
import { DealerGroupEntity } from './dealers-group.entity';
import { UsersDTO } from '../users/users.dto';
import { EmployeeEntity } from 'src/entities/employee';
import { DepartmentEntity } from '../departments/departments.entity';
import { UserRoleEntity } from '../users/user-roles.entity';
import { AddDealerGroupDTO, BaseDealerGroup, DealerGroupFilterDTO, UpdateDealerGroupDTO } from './dealer-groups.dto';
import { TokenDTO } from '../auth/auth.dto';
import { PermissionsEntity } from '../user-roles/permission.entity';
import { BaseService, HttpHelper, RequestQuery } from '@401_digital/xrm-core';
import { paginate } from 'nestjs-typeorm-paginate';
import { InternalOrgDTO, InternalUserDTO } from '../internal/internal.dto';
import { MICROSERVICES } from '@environments';
import { InternalHelper } from 'src/helpers/internal';
import { RoleDealershipEntity } from '../user-roles/role-dealership.entity';

@Injectable()
export class DealerGroupService extends BaseService {
    constructor(
        @InjectRepository(DealerGroupEntity)
        private readonly dealerGroupRepository: Repository<DealerGroupEntity>,
        private s3: AwsService,
    ) {
        super();
    }

    public async create(user: TokenDTO, data: AddDealerGroupDTO | any, file: File) {
        let { admin, ...dealerGroup } = data;
        let adminUser: any = data.admin;

        const entity = Object.assign(
            new DealerGroupEntity(),
            dealerGroup,
        ) as DealerGroupEntity;
        entity.createdBy = user.id;
        entity.updatedBy = user.id;
        entity.status = AccountStatus.ACTIVE;
        admin = JSON.parse(adminUser);

        /** verify dealergroup  */
        await this.validateDealerGroup(entity);

        /** verify admin */
        await this.validateAdmin(admin.email);

        /** set up transaction  */
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            /** create dealergroup */
            if (file) {
                const logo = await this.s3.uploadSingle(file, 'dealergroup-logos');
                entity.logoUrl = logo.Location ? logo.Location : '';
            }
            const dealerGroup = await queryRunner.manager.save(entity);
            data.id = dealerGroup.id;

            /** create department  */
            await queryRunner.manager.save(
                this.createDepartment(dealerGroup.id, user.id),
            );

            /** create admin role */
            const adminRole = await queryRunner.manager.save(
                this.createAdminRole(dealerGroup.id, user.id),
            );

            await queryRunner.manager.save(this.createGMRole(dealerGroup.id, user.id));

            /** set up admin profile with login */
            let adminUser = this.getUserCopy(admin, dealerGroup.id, user.id);
            let profile = await queryRunner.manager.findOne(EmployeeEntity, {
                where: { email: ILike(admin.email) },
            });

            let profileId: string;
            if (profile) {
                profileId = profile.id;
                await queryRunner.manager.update(
                    EmployeeEntity,
                    { id: profileId },
                    { isEnrolled: true },
                );
            } else {
                profile = (await queryRunner.manager.save(
                    EmployeeEntity,
                    this.copyAdmin(admin),
                )) as EmployeeEntity;
                profileId = profile.id;
            }
            adminUser.profile = profileId;
            adminUser = await queryRunner.manager.save(adminUser);

            await queryRunner.manager.getRepository(DealerGroupEntity).save({
                id: dealerGroup.id,
                admin: adminUser.id
            })

            /** set admin permission */
            const roles = {
                dealership: null,
                user: adminUser.id,
                role: adminRole.id,
            }
            await queryRunner.manager.getRepository(UserRoleEntity).save(roles);
            InternalHelper.setupMessaging(adminUser, [roles])
            /** set up lead management for dealergroup */
            data.logo = dealerGroup.logoUrl;
            await this.setupLead(
                this.copyLeadOrg(data, dealerGroup.id, adminUser.id),
            );
            // await this.setupDeal(
            //     this.copyLeadOrg(data, dealerGroup.id, adminUser.id),
            // );
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
        return data;
    }

    private detectChanges(dto: BaseDealerGroup, entity: DealerGroupEntity) {
        return dto.name != entity.name || dto.status != entity.status || dto.email != entity.status || dto.phone != entity.phone
    }
    public async update(user: TokenDTO, dto: UpdateDealerGroupDTO | any, id: string, file: File) {
        /** set up transaction  */
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();


        try {
            const dealergroup = await this.dealerGroupRepository.findOne({ id });
            if (!dealergroup) throw new BadRequestException("Invalid Dealergroup");

            const entity = new DealerGroupEntity();

            entity.email = dto.email;
            entity.name = dto.name;
            entity.id = Number.parseInt(id) as any;
            entity.phone = dto.phone;
            entity.principleFirstName = dto.principleFirstName;
            entity.principleLastName = dto.principleLastName;
            entity.country = dto.country;
            entity.province = dto.province;
            entity.postalCode = dto.postalCode;
            entity.city = dto.city;
            entity.fax = dto.fax;
            entity.latitude = dto.latitude;
            entity.longitude = dto.longitude;
            entity.addressLine1 = dto.addressLine1;
            entity.addressLine2 = dto.addressLine2;
            entity.updatedBy = user.id;
            entity.domainUrl = dto.domainUrl;
            if (file) {
                entity.logoUrl = await this.uploadLogo(id, file);
            } else {
                entity.logoUrl = dealergroup.logoUrl;
            }

            // console.log(entity)
            await this.validateDealerGroup(entity, id);
            await queryRunner.manager.save(entity);

            const admin = JSON.parse(dto.admin);
            dto = { ...dto, admin }
            // console.log(dto)
            // process.exit(0)
            let profile = await queryRunner.manager.findOne(EmployeeEntity, {
                where: { email: ILike(admin.email) },
            });

            if (profile) {
                await queryRunner.manager.update(
                    EmployeeEntity,
                    { id: profile.id },
                    { firstName: admin.firstName, lastName: admin.lastName },
                );
            }
            /** set up lead management for dealergroup */
            dto.logo = entity.logoUrl;
            if (this.detectChanges(dto, entity)) {
                await InternalHelper.setupLead(this.copyLeadOrg(dto as any, id, null), 'put');
                // await InternalHelper.setupDeal(this.copyLeadOrg(dto as any, id, null), 'put');
            }
            await queryRunner.commitTransaction();
            return dto;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release()
        }
    }

    public async getById(user: TokenDTO, id: string) {
        const filter = { id: id };

        if ([Level.DEALERGROUP, Level.DEALERSHIP].includes(user.userLevel as Level)) {
            if (id != user.dealerGroup) {
                throw new BadRequestException('Invalid DealerGroup: Incorrect dealergroup selected')
            }
            filter.id = user.dealerGroup
        }

        const dealergroup = await this.dealerGroupRepository.findOne({ where: filter, relations: ["admin", "admin.profile"] });
        return dealergroup;
    }

    private copyLeadOrg(p: AddDealerGroupDTO & UpdateDealerGroupDTO, dealerGroupId: string, userId: string) {
        const q = new InternalOrgDTO();
        q.name = p.name;
        q.countryCode = p.country;
        q.email = p.email;
        q.phoneNumber = p.phone;
        q.type = 2;
        q.uniqueId = dealerGroupId;
        q.fax = p.fax;
        q.logo = p.logo;
        q.postalCode = p.postalCode;
        q.addressLine1 = p.addressLine1;
        q.addressLine2 = p.addressLine2;
        q.city = p.city;
        q.province = p.province;
        if (userId) {
            q.user = {
                dealergroupId: dealerGroupId,
                dealershipId: null,
                userLevel: Level.DEALERGROUP,
                email: p.admin.email,
                firstName: p.admin.firstName,
                lastName: p.admin.lastName,
                middleName: null,
                phoneNumber: p.admin.phone,
                uniqueId: userId,
            } as InternalUserDTO;
        }
        return q;
    }

    private copyAdmin(admin: UsersDTO) {
        return {
            email: admin.email,
            firstName: admin.firstName,
            lastName: admin.lastName,
            phone: admin.phone,
            phoneExtension: admin.phoneExtension,
            isVisible: true,
            source: DataSources.PORTAL,
            isEnrolled: true,
            isInactive: false,
        } as EmployeeEntity;
    }

    async setupLead(payload: InternalOrgDTO) {
        const http = new HttpHelper(MICROSERVICES.LEAD.HOST);
        const data = await http.post('api/internal/organization', payload);
        return data;
    }



    private async validateDealerGroup(payload: DealerGroupEntity, id: string = null) {
        const qb = this.dealerGroupRepository.createQueryBuilder();
        if (payload.name || payload.email) {
            qb.andWhere(new Brackets((bqb) => {
                if (payload.name) bqb.orWhere('name ILIKE :name', { name: payload.name })
                if (payload.email) bqb.orWhere('email ILIKE :email', { email: payload.email })
            }))
        }
        if (id) {
            qb.andWhere('id != :id', { id })
        }
        const exists = await qb.getOne();
        if (exists) {
            throw new BadRequestException('dealergroup already exists');
        }
    }

    public deactivate(id: string) {
        return this.dealerGroupRepository.update(
            { id },
            { status: AccountStatus.INACTIVE },
        );
    }

    public async addDealerGroup(data: DealerGroupEntity) {
        return this.dealerGroupRepository.save(data);
    }

    public async getDealerGroups(query: RequestQuery<DealerGroupFilterDTO>) {
        const { filter, pagination, sort } = this.getQuery(query);
        const dealerGroupQb = this.dealerGroupRepository
            .createQueryBuilder('dealerGroup')
            .select('dealerGroup.id')
            .addSelect('dealerGroup.name')
            .addSelect('dealerGroup.status')
            .addSelect('dealerGroup.email')
            .addSelect('dealerGroup.principleFirstName')
            .addSelect('dealerGroup.principleLastName')
            .addSelect('dealerGroup.phone')
            .addSelect('dealerGroup.addressLine1')
            .addSelect('dealerGroup.addressLine2')
            .addSelect('dealerGroup.city')
            .addSelect('dealerGroup.province')
            .addSelect('dealerGroup.country')
            .addSelect('dealerGroup.logoUrl')
            .addSelect('dealerGroup.postalCode');

        const status = filter.status ? filter.status : AccountStatus.ACTIVE;
        if (status) {
            dealerGroupQb.where(`dealerGroup.status = :status`, { status: status })
        }

        if (filter.keyword) {
            const keywordfilter = {
                keyword: `%${filter.keyword}%`,
            };
            dealerGroupQb.andWhere(
                new Brackets((qb) => {
                    qb.orWhere('dealerGroup.name ILIKE :keyword', keywordfilter);
                    qb.orWhere('dealerGroup.principleFirstName ILIKE :keyword', keywordfilter);
                    qb.orWhere('dealerGroup.principleLastName ILIKE :keyword', keywordfilter);
                    qb.orWhere('dealerGroup.phone ILIKE :keyword', keywordfilter);
                    qb.orWhere('dealerGroup.addressLine1 ILIKE :keyword', keywordfilter);
                    qb.orWhere('dealerGroup.addressLine2 ILIKE :keyword', keywordfilter);
                    qb.orWhere('dealerGroup.city ILIKE :keyword', keywordfilter);
                    qb.orWhere('dealerGroup.province ILIKE :keyword', keywordfilter)
                }),
            );
        } else {
            if (filter.name) {
                dealerGroupQb.andWhere('dealerGroup.name ILIKE :name', {
                    name: `%${filter.name}%`,
                });
            }
            if (filter.phone) {
                dealerGroupQb.andWhere('dealerGroup.phone ILIKE :phone', {
                    phone: `%${filter.phone}%`,
                });
            }
            if (filter.email) {
                dealerGroupQb.andWhere('dealerGroup.email ILIKE :email', {
                    email: `%${filter.email}%`,
                });
            }
            if (filter.principleFirstName) {
                dealerGroupQb.andWhere('dealerGroup.principleFirstName ILIKE :principleFirstName', {
                    principleFirstName: `%${filter.principleFirstName}%`,
                });
            } if (filter.principleLastName) {
                dealerGroupQb.andWhere('dealerGroup.principleLastName ILIKE :principleLastName', {
                    principleLastName: `%${filter.principleLastName}%`,
                });
            }
            if (filter.address) {
                const addressQuery = {
                    address: `%${filter.address}%`,
                };
                dealerGroupQb.andWhere(
                    '(dealerGroup.addressLine1 ILIKE :address OR dealerGroup.addressLine2 ILIKE :address)',
                    addressQuery,
                );
            }
            if (filter.city) {
                dealerGroupQb.andWhere('dealerGroup.city ILIKE :city', {
                    city: `%${filter.city}%`,
                });
            }
            if (filter.province) {
                dealerGroupQb.andWhere('dealerGroup.province ILIKE :province', {
                    province: `%${filter.province}%`,
                });
            }
            if (filter.country) {
                dealerGroupQb.andWhere('dealerGroup.country ILIKE :country', {
                    country: `%${filter.country}%`,
                });
            }
            // if (filter.status) {
            //     dealerGroupQb.andWhere('dealerGroup.status = :status', {
            //         status: filter.status,
            //     });
            // }
        }

        if (!Object.keys(sort).length) {
            dealerGroupQb.orderBy('dealerGroup.createdAt', 'DESC');
        } else {
            if (sort.name) {
                dealerGroupQb.orderBy('dealerGroup.name', sort.name.toUpperCase());
            }
            if (sort.email) {
                dealerGroupQb.orderBy('dealerGroup.email', sort.email.toUpperCase());
            }
            if (sort.phone) {
                dealerGroupQb.orderBy('dealerGroup.phone', sort.phone.toUpperCase());
            }
            if (sort.status) {
                dealerGroupQb.orderBy('dealerGroup.status', sort.status.toUpperCase());
            }
            if (sort.address) {
                dealerGroupQb.orderBy('dealerGroup.addressLine1', sort.address.toUpperCase());
            }
            if (sort.province) {
                dealerGroupQb.orderBy('dealerGroup.province', sort.province.toUpperCase());
            }
            if (sort.city) {
                dealerGroupQb.orderBy('dealerGroup.city', sort.city.toUpperCase());
            }
            if (sort.country) {
                dealerGroupQb.orderBy('dealerGroup.country', sort.country.toUpperCase());
            }
            if (sort.principleFirstName) {
                dealerGroupQb.orderBy('dealerGroup.principleFirstName', sort.principleFirstName.toUpperCase());
            }
            if (sort.principleLastName) {
                dealerGroupQb.orderBy('dealerGroup.principleLastName', sort.principleLastName.toUpperCase());
            }
        }

        return paginate(dealerGroupQb, pagination);
    }

    public async validateAdmin(email: string) {
        const userRepo = getRepository(UsersEntity);
        const user = await userRepo.findOne({
            where: {
                username: email,
            },
        });
        if (user) {
            throw new BadRequestException('User Already Exists');
        }
    }

    private getUserCopy(
        userDTO: UsersDTO,
        dealerGroup: string,
        currentUserId: string,
    ) {
        const user = new UsersEntity();
        user.username = userDTO.email;
        user.dealerGroup = dealerGroup;
        user.userLevel = Level.DEALERGROUP;
        user.password = SecurityHelper.getHash(userDTO.password);
        user.loginEnabled = true;
        user.createdBy = currentUserId;
        user.updatedBy = currentUserId;
        return user;
    }

    public async createAdmin(
        userDTO: UsersDTO,
        dealerGroup: string,
        role: string,
        currentUserId: string,
    ) {
        const userRepo = getRepository(UsersEntity);
        let user = this.getUserCopy(userDTO, dealerGroup, currentUserId);
        const profileRepo = getRepository(EmployeeEntity);
        let profile = await profileRepo.findOne({
            email: ILike(userDTO.email),
        });

        let profileId: string;
        if (profile) {
            profileId = profile.id;
            await profileRepo.update({ id: profileId }, { isEnrolled: true });
        } else {
            profile = await profileRepo.save({
                email: userDTO.email,
                firstName: userDTO.firstName,
                lastName: userDTO.lastName,
                phone: userDTO.phone,
                phoneExtension: userDTO.phoneExtension,
                isVisible: true,
                source: DataSources.PORTAL,
                isEnrolled: true,
                isInactive: false,
            });
            profileId = profile.id;
        }
        user.profile = profileId;
        user = await userRepo.save(user);

        await getRepository(UserRoleEntity).save({
            dealership: null,
            user: user.id,
            role: role,
        });
    }

    public createDepartment(dealerGroup: string, currentUserId: string) {
        const department = new DepartmentEntity();
        department.name = DefaultDepartment.name;
        department.dealerGroup = dealerGroup;
        department.active = true;
        department.isDefault = true;
        department.createdBy = currentUserId;
        department.updatedBy = currentUserId;
        return department;
    }

    public async createRoles(dealerGroup: string, currentUserId: string) {
        const roleRepo = getRepository(RoleEntity);
        const payload = [
            this.createAdminRole(dealerGroup, currentUserId),
            this.createGMRole(dealerGroup, currentUserId),
        ];
        const results = await roleRepo.save(payload);
        return results.find((el) => el.name == DefaultDealerGroupUser.role.name);
    }

    private createAdminRole(dealerGroup: string, currentUserId: string) {
        const role = new RoleEntity();
        role.name = DefaultDealerGroupUser.role.name;
        const permissions = DefaultDealerGroupUser.role.permissions;
        role.permissions = permissions.map((el) =>
            Object.assign(new PermissionsEntity(), el),
        );
        role.isDefault = true;
        role.dealerships = [
            {
                dealerGroup: dealerGroup,
                dealership: null
            }
        ] as RoleDealershipEntity[]
        role.active = true;
        role.level = Level.DEALERGROUP;
        role.createdBy = currentUserId;
        role.updatedBy = currentUserId;
        return role;
    }

    private createGMRole(dealerGroup: string, user: string) {
        const role = new RoleEntity();
        role.name = GeneralManagerRole.name;
        role.createdBy = user;
        role.updatedBy = user;
        role.isGM = true;
        role.isDefault = true;
        role.dealerships = [
            {
                dealerGroup: dealerGroup,
                dealership: null
            }
        ] as RoleDealershipEntity[]
        role.level = Level.DEALERSHIP;
        role.active = true;
        const permission = GeneralManagerRole.permissions;
        role.permissions = permission.map((el) =>
            Object.assign(new PermissionsEntity(), el),
        );
        return role;
    }

    async getGeneralManagers(query: any) {
        const userRepo = getRepository(UserRoleEntity);
        const gmsQB = userRepo.createQueryBuilder('userRole');
        gmsQB.select('role.id', 'roleId')
            .addSelect('role.name', 'roleName')
            .addSelect('user.id', 'userId')
            .addSelect('dealership.id', 'dealershipId')
            .addSelect('dealership.name', 'dealershipName')
            .addSelect('profile.firstName', 'firstName')
            .addSelect('profile.lastName', 'lastName')
            .innerJoin('userRole.role', 'role')
            .innerJoin('userRole.user', 'user')
            .innerJoin('userRole.dealership', 'dealership')
            .innerJoin('user.profile', 'profile')
            .where('user.active = :isActive AND role.isGM = :isGM', { isGM: true, isActive: true })
        if (query.dealerGroup) {
            gmsQB.andWhere('user.dealerGroup = :dealerGroup AND dealership.dealerGroup = :dealerGroup', { dealerGroup: query.dealerGroup })
        }

        if (query.dealership) {
            gmsQB.andWhere('user.dealership = :dealership AND dealership.id = :dealership', { dealership: query.dealership })
        }
        return await gmsQB.getRawMany();
    }

    async getDealerGroupDetails(dealerGroup: string) {
        return await this.dealerGroupRepository.findOne({
            where: { id: dealerGroup },
            select: ['id', 'name'],
        });
    }

    public async uploadLogo(id: string, file: any) {
        let dealership = await this.getLogo(id);
        if (dealership && dealership.logoUrl) {
            await this.s3.deleteFile(this.s3.getKeyFromUrl(dealership.logoUrl))
        }
        const data = await this.s3.uploadSingle(file, 'dealergroup-logos');
        return data.Location;
        // return this.dealerGroupRepository.update({ id: id }, { logoUrl: data.Location });
    }

    public async getLogo(dealergroupId: string) {
        let dealership = await this.dealerGroupRepository.findOne({ where: { id: dealergroupId }, select: ['id', 'logoUrl'] });
        if (!dealership) throw new BadRequestException('Invalid DealerGroup');
        return dealership;
    }

    async setupDeal(payload: InternalOrgDTO,) {
        const http = new HttpHelper(MICROSERVICES.DEAL.HOST);
        return http.post('api/internal/organization', payload);
    }
}

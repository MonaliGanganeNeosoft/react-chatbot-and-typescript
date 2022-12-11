import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginateRaw } from 'nestjs-typeorm-paginate';
import { AwsService, DefaultSalesAgentRole, GeneralManagerRole } from 'src/configs';
import { EmployeeEntity } from 'src/entities/employee';
import { Brackets, getConnection, getRepository, ILike, Not, QueryRunner, Repository, In } from 'typeorm';
import { DepartmentEntity } from '../departments/departments.entity';
import { RoleEntity } from '../user-roles/roles.entity';
import { UsersDTO } from '../users/users.dto';
import { UsersEntity } from '../users/users.entity';
import { DealershipImageEntity } from './dealership-image.entity';
import { DealershipOpeningEntity } from './dealership-openinghours.entity';
import { DealershipEntity } from './dealership.entity';
import { DealershipDTO, DealershipFilterDTO, DealershipOpeningDTO, UpdateGMDTO } from './dto';
import { SecurityHelper } from 'src/helpers/security';
import { AccountStatus, DataSources, Level } from 'src/constants';
import { BaseService, RequestQuery } from '@401_digital/xrm-core';
import { DealerGroupEntity } from '../dealer-groups/dealers-group.entity';
import { UserRoleEntity } from '../users/user-roles.entity';
import { TokenDTO } from '../auth/auth.dto';
import { UsersService } from '../users/users.service';
import { InternalOrgDTO, InternalUserDTO } from '../internal/internal.dto';
import { DealershipLeadSettingsEntity } from './dealership-leadsettings.entity';
import { InternalHelper } from 'src/helpers/internal';
import { MailHelper } from 'src/helpers/mail';
import { DmsEntity } from '../dms/dms.entity';
import { DealershipDmsEntity } from '../dealership-dms-mapping/dealership-dms.entity';

@Injectable()
export class DealershipService extends BaseService {
    constructor(
        @InjectRepository(DealershipEntity)
        private readonly dealershipRepo: Repository<DealershipEntity>,
        @InjectRepository(DealershipImageEntity)
        private readonly dealershipImageRepo: Repository<DealershipImageEntity>,
        @InjectRepository(DealershipOpeningEntity)
        private readonly dealershipOpeningHours: Repository<DealershipOpeningEntity>,
        @InjectRepository(DealershipLeadSettingsEntity)
        private readonly dealershipLeadSettings: Repository<DealershipLeadSettingsEntity>,
        @InjectRepository(DmsEntity)
        private dmsRepo: Repository<DmsEntity>,
        @InjectRepository(DealershipDmsEntity)
        private dealershipDmsRepo: Repository<DealershipDmsEntity>,
        private s3: AwsService,
        private userService: UsersService,
        private mailHelper: MailHelper,
    ) {
        super();
    }
    public setDealerGroup(dealership: any, user: TokenDTO) {
        let dealerGroupId: string;
        if (
            user.userLevel == Level.ROOT &&
            (!dealership.dealerGroup || !dealership.dealerGroup.id)
        ) {
            throw new BadRequestException('dealerGroup Required');
        }
        if (user.userLevel == Level.ROOT && dealership.dealerGroup.id) {
            dealerGroupId = dealership.dealerGroup.id;
        }
        if (user.userLevel == Level.DEALERGROUP) {
            dealerGroupId = user.dealerGroup.toString();
        }
        dealership.dealerGroup = dealerGroupId;
        dealership.createdBy = user.id;
        dealership.updatedBy = user.id;
        return dealership;
    }

    private async isExists(name: string, dealerGroup: string, id: string = null) {
        if (name) {
            const filter = {
                dealerGroup,
                name: ILike(name),
            } as any;
            if (id) {
                filter.id = Not(id);
            }
            const department = await this.dealershipRepo.findOne(filter);
            if (department) {
                throw new BadRequestException('dealership already exists');
            }
        }
    }

    public async create(data: DealershipEntity | any) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        
        const { openingHours, leadSettings: leadLimits, generalManager, dmsIds, ...rest } = data;
        await this.isExists(data.name, data.dealerGroup as string);
        const dealership = await this.dealershipRepo.save(rest);
        if (openingHours && openingHours.length) {
            await this.updateOpeningHours(dealership.id, openingHours);
        }
        if (leadLimits && leadLimits.length) {
            data.leadSettings = await this.updateDealershipLeadSettings(dealership.id, leadLimits);
        }
       
        if (dmsIds?.length) {
            this.dealershipDmsMapping(dmsIds, dealership.id)
        }

        data.id = dealership.id;
        return data;
    }

    public async update(user: TokenDTO, id: string, dto: DealershipDTO) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const found = await this.dealershipRepo.findOne({ where: { id: id }, relations: ["dealerGroup"] });
        console.log({ found })
        if (!found) throw new BadRequestException('Invalid Dealership');

        if (found.status == AccountStatus.DRAFT) delete dto.status;

        const { dealerGroup, generalManager, ...rest } = dto;
        const entity = Object.assign(new DealershipEntity(), rest);
        await this.isExists(entity.name, entity.dealerGroup as string, id);
        entity.id = id;
        entity.updatedBy = user.id;

        const { openingHours, leadSettings, ...dealership } = entity;
        await this.dealershipRepo.save(dealership);

        if (openingHours && openingHours.length) {
            await this.updateOpeningHours(id, openingHours);
        }

        if (leadSettings && leadSettings.length) {
            dto.leadSettings = await this.updateDealershipLeadSettings(dealership.id, leadSettings);
        }
      
        if (dto?.dmsIds?.length) {
            this.dealershipDmsMapping(dto.dmsIds, dealership.id)
        }

        if (found.status != AccountStatus.DRAFT) {
            const { generalManager, ...sendToLead } = dto;
            await InternalHelper.setupLead(
                await this.copyLeadOrg(sendToLead as any, (found.dealerGroup as DealerGroupEntity).id, id, user.id), 'put'
            )
            // await InternalHelper.setupDeal(
            //     await this.copyLeadOrg(sendToLead as any, (found.dealerGroup as DealerGroupEntity).id, id, user.id), 'put'
            // )
        }
        dto.id = id;
        return dto;
    }

    public async submit(id: string, data: DealershipDTO, user: TokenDTO) {
        if (!data.generalManager) {
            throw new BadRequestException('generalManager is required');
        }

        if (data.generalManager && !data.generalManager.id && !data.generalManager.email) {
            throw new BadRequestException('generalManager id or email is required');
        }

        let entity = Object.assign(new DealershipEntity(), data);
        entity = this.setDealerGroup(entity, user);
        entity.id = id;

        await this.isExists(entity.name, entity.dealerGroup as string, id);

        entity.status = AccountStatus.ACTIVE;

        const dealership = await this.dealershipRepo.findOne({ where: { id: id }, relations: ['generalManager'] });

        if (!dealership) {
            throw new BadRequestException('Invalid Dealership');
        }

        if (dealership.generalManager) {
            throw new BadRequestException('General Manager Already Configured');
        }

        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let gmData: UsersEntity;

            if (dealership && !dealership.generalManager) {

                if (data.generalManager.id) {
                    gmData = await this.userService.getUserForDealership(entity.dealerGroup.toString(), data.generalManager.id);
                } else {
                    gmData = await this.validateUser(entity.dealerGroup.toString(), entity.id, data.generalManager.email);
                }

                if (gmData && gmData.userLevel != Level.DEALERSHIP) {
                    throw new BadRequestException('Only Dealership Level User Can be General Manager');
                }

                const defaultData = await this.getDefaults(entity.dealerGroup.toString());

                if ((data.generalManager.id && gmData) || (data.generalManager.email && gmData)) {
                    await queryRunner.manager.getRepository(UserRoleEntity).createQueryBuilder().insert()
                        .values({ dealership: dealership, role: defaultData.role.id, user: gmData.id })
                        .onConflict('ON CONSTRAINT uk_userroles DO NOTHING').execute();
                    entity.generalManager = gmData.id as any;
                } else {
                    gmData = await this.saveGeneralManager(queryRunner, data.generalManager, entity.dealerGroup.toString(), id, defaultData.department.id, defaultData.role.id, user);
                    entity.generalManager = gmData.id as any;
                }
                data.generalManager.roles = [{ dealership: id, role: defaultData.role.id, user: gmData.id }];
            }

            const { openingHours, leadSettings, ...rest } = entity;

            const response = await queryRunner.manager.getRepository(DealershipEntity).save(rest);

            data.id = response.id;

            if (openingHours && openingHours.length) {
                const dontUpdate = ['id', 'created_at'];
                const openingHoursToUpdate = openingHours.map((el: any) => { el.dealership = id; return el });
                const keys = queryRunner.manager.getRepository(DealershipOpeningEntity).metadata.ownColumns.map((column) => column.databaseName).filter((key) => !dontUpdate.includes(key));
                const updateStr = keys.map((key) => `"${key}" = EXCLUDED."${key}"`).join(',');
                await queryRunner.manager.getRepository(DealershipOpeningEntity).createQueryBuilder().insert().values(openingHoursToUpdate).onConflict(`ON CONSTRAINT uk_openinghours DO UPDATE SET ${updateStr}`).execute();
            }

            if (leadSettings && leadSettings.length) {
                const dontUpdate = ['id', 'created_at'];
                const provincesToUpdate = leadSettings.map((el: any) => { el.dealership = id; return el });
                const keys = queryRunner.manager.getRepository(DealershipLeadSettingsEntity).metadata.ownColumns.map((column) => column.databaseName).filter((key) => !dontUpdate.includes(key));
                const updateStr = keys.map((key) => `"${key}" = EXCLUDED."${key}"`).join(',');
                await queryRunner.manager.getRepository(DealershipLeadSettingsEntity).createQueryBuilder().insert().values(provincesToUpdate).onConflict(`ON CONSTRAINT uk_dealership_lead_settings DO UPDATE SET ${updateStr}`).execute();
            }


            const gmProfile = gmData.profile as EmployeeEntity;

            const payload = { ...data };

            if (!data.generalManager.id && !data.generalManager.email) {
                payload.generalManager = {
                    email: gmProfile.email,
                    firstName: gmProfile.firstName,
                    lastName: gmProfile.lastName,
                    phoneNumber: gmProfile.phone,
                    roles: gmData.userRoles.map(el => el.role) as any,
                    departmentId: (gmData?.department as any)?.id,
                    assignedPhoneNumber: gmProfile.assignedPhoneNumber
                } as any
            } else {
                delete payload.generalManager;
            }

            await InternalHelper.setupLead(
                await this.copyLeadOrg(payload, entity.dealerGroup.toString(), id, entity.generalManager.toString())
            );
            // await InternalHelper.setupDeal(
            //     await this.copyLeadOrg(payload, entity.dealerGroup.toString(), id, entity.generalManager.toString())
            // );
            InternalHelper.setupMessaging(gmData, data.generalManager.roles);
            await queryRunner.commitTransaction();
        } catch (error) {
            console.error(error);
            queryRunner.rollbackTransaction();
            throw error;
        } finally {
            queryRunner.release();
        }

        return data;
    }

    private async copyLeadOrg(p: DealershipDTO, dealerGroupId: string, dealershipId: string, userId: string) {
        console.log("p", p);
        const q = new InternalOrgDTO();
        q.type = 1;
        if (p.name) q.name = p.name;
        if (p.status) q.isActive = p.status == AccountStatus.ACTIVE ? true : false;
        if (p.email) q.email = p.email;
        if (p.phone) q.phoneNumber = p.phone;
        if (p.fax) q.fax = p.fax;
        if (p.logo) q.logo = q.logo;
        if (p.postalCode) q.postalCode = p.postalCode;
        if (p.addressLine1) q.addressLine1 = p.addressLine1;
        if (p.addressLine2) q.addressLine2 = p.addressLine2;
        if (p.city) q.city = p.city;
        if (p.province) q.province = p.province;
        q.parentId = dealerGroupId;
        q.uniqueId = dealershipId;
        q.leadSettings = p.leadSettings;
        const generalManager = p.generalManager as any;
        if (generalManager) {
            q.user = {
                dealergroupId: dealerGroupId,
                dealershipId: dealershipId,
                userLevel: Level.DEALERSHIP,
                email: generalManager.email,
                firstName: generalManager.firstName,
                lastName: generalManager.lastName,
                phoneNumber: generalManager.phone,
                uniqueId: userId,
                roles: generalManager.roles,
                communicationEmail: await this.userService.getCommunicationEmail(generalManager.email, dealershipId, Level.DEALERSHIP),
                departmentId: generalManager.department,
                assignedPhoneNumber: generalManager.assignedPhoneNumber
            } as InternalUserDTO;
        }
        return q;
    }

    private async getGmRoleForDealership(dealerGroupId: string) {
        const repository = getRepository(RoleEntity);
        const qb = repository.createQueryBuilder('role')
            .addSelect(['dealerGroup.id'])
            .leftJoinAndSelect('role.dealerships', 'dealerships')
            .leftJoin('dealerships.dealerGroup', 'dealerGroup')
            .where('role.isDefault = true AND role.isGM = true AND dealerGroup.id = :dealerGroupId', {
                dealerGroupId: dealerGroupId
            })
        return qb.getOne();
    }

    async changeGeneralManager(
        dealershipId: string,
        dto: UpdateGMDTO,
        user: TokenDTO,
    ) {
        if (!dto.userId) {
            throw new BadRequestException('userId is required');
        }

        if (!dto.dealershipId) {
            throw new BadRequestException('dealershipId is required');
        }

        if (!dto.userFromAnotherDealership) {
            throw new BadRequestException('userFromAnotherDealership is required');
        }

        if (dto.userFromAnotherDealership == 'YES') {
            if (!dto.roleId) {
                throw new BadRequestException('role for selected user is required');
            }

            const gm = await getRepository(UserRoleEntity)
                .createQueryBuilder('userRole')
                .innerJoin(
                    'userRole.role',
                    'role',
                    'userRole.role = role.id AND role.isGM = :isGM',
                    {
                        isGM: true,
                    },
                )
                .where(
                    'userRole.user = :user AND userRole.dealership = :dealership AND userRole.role = :role',
                    {
                        user: dto.userId,
                        dealership: dto.dealershipId,
                        role: dto.roleId,
                    },
                )
                .getRawOne();
            if (!gm) {
                throw new BadRequestException('Invalid GM Selected');
            }
        }
        if (dto.userFromAnotherDealership == 'NO') {
            const vUser = await getRepository(UsersEntity).findOne({
                dealership: dealershipId,
                id: dto.userId,
            });
            if (!vUser) {
                throw new BadRequestException('Invalid User Selected');
            }
        }

        const oldGm = await this.dealershipRepo
            .createQueryBuilder('dealership')
            .select('dealership.generalManager', 'gmId')
            .addSelect('dealership.dealer_group_id', 'dealergroup')
            .where('dealership.id = :id', { id: dealershipId })
            .getRawOne();

        console.log("oldGm", oldGm);

        if (!oldGm || oldGm.gmId != dto.userId) {
            const gmRole = await this.getGmRoleForDealership(oldGm.dealergroup);

            if (!gmRole || !gmRole.id) throw new BadRequestException('GM Role Missing In Selected Dealership');

            await this.userService.revokeRoleAndDealership(dealershipId, dto.userId);

            await this.userService.addRoleAndDealership(dealershipId, gmRole.id, dto.userId);

            await this.dealershipRepo.update({ id: dealershipId }, { generalManager: dto.userId, updatedBy: user.id });

            if (oldGm && oldGm.gmId) {
                await this.userService.revokeRoleAndDealership(
                    dealershipId,
                    oldGm.gmId,
                );
            }
        }
    }

    async updateOpeningHours(
        dealershipId: string,
        openingHours: DealershipOpeningDTO[],
    ) {
        const dontUpdate = ['id', 'created_at'];
        const openingHoursToUpdate = openingHours.map((el: any) => {
            el.dealership = dealershipId;
            return el;
        });
        const keys = this.dealershipOpeningHours.metadata.ownColumns
            .map((column) => column.databaseName)
            .filter((key) => !dontUpdate.includes(key));
        const updateStr = keys
            .map((key) => `"${key}" = EXCLUDED."${key}"`)
            .join(',');
        await this.dealershipOpeningHours
            .createQueryBuilder()
            .insert()
            .values(openingHoursToUpdate)
            .onConflict(`ON CONSTRAINT uk_openinghours DO UPDATE SET ${updateStr}`)
            .execute();
        return {
            dealershipId,
            openingHours
        }
    }

    async updateDealershipLeadSettings(dealershipId: string, limits: DealershipLeadSettingsEntity[]) {
        const result = [];
        for (const limit of limits) {
            const limitId = limit.id;
            if (limitId) {
                const isExists = await this.dealershipLeadSettings.findOne({
                    id: Not(limitId),
                    country: limit.country,
                    leadTypeId: limit.leadTypeId,
                    leadTierId: limit.leadTierId,
                    province: limit.province,
                    dealership: dealershipId,
                })
                if (isExists) throw new BadRequestException(
                    `invalid lead setting while updating: lead setting for country ${limit.country}, province ${limit.province}, leadType ${limit.leadTierName}, leadTier ${limit.leadTierName} already exists`
                );
                const { id, ...rest } = limit;
                await this.dealershipLeadSettings.update({ id: limitId }, rest)
                result.push(limit)
            } else {
                const isExists = await this.dealershipLeadSettings.findOne({
                    country: limit.country,
                    leadTypeId: limit.leadTypeId,
                    leadTierId: limit.leadTierId,
                    province: limit.province,
                    dealership: dealershipId,
                })
                if (isExists) throw new BadRequestException(
                    `invalid lead setting while creating: lead setting for country ${limit.country}, province ${limit.province}, leadType ${limit.leadTierName}, leadTier ${limit.leadTierName} already exists`
                );
                const setting = await this.dealershipLeadSettings.save({
                    ...limit,
                    dealership: dealershipId
                });

                result.push(setting)
            }
        }
        return result;
        // const dontUpdate = ['id', 'created_at'];
        // const toUpdate = limits.map((el: any) => {
        //     el.dealership = dealershipId;
        //     return el;
        // });
        // const keys = this.dealershipLeadSettings.metadata.ownColumns
        //     .map((column) => column.databaseName)
        //     .filter((key) => !dontUpdate.includes(key));
        // const updateStr = keys
        //     .map((key) => `"${key}" = EXCLUDED."${key}"`)
        //     .join(',');
        // return this.dealershipLeadSettings
        //     .createQueryBuilder()
        //     .insert()
        //     .values(toUpdate)
        //     .onConflict(`ON CONSTRAINT uk_dealership_lead_settings DO UPDATE SET ${updateStr}`)
        //     .execute();
    }

    async deleteLeadSetting(id: number) {
        const leadSetting = await this.dealershipLeadSettings.createQueryBuilder('leadSetting')
            .select("leadSetting.id", "id")
            .addSelect("leadSetting.dealership", "dealership")
            .addSelect("leadSetting.country", "country")
            .addSelect("leadSetting.leadTypeId", "leadTypeId")
            .addSelect("leadSetting.leadTierId", "leadTierId")
            .addSelect("leadSetting.province", "province")
            .where("leadSetting.id = :id", { id: id })
            .getRawOne();
        if (!leadSetting) throw new BadRequestException("invalid leadsetting id");
        if (leadSetting) {
            const payload = {
                uniqueId: leadSetting.dealership,
                country: leadSetting.country,
                leadTypeId: leadSetting.leadTypeId,
                leadTierId: leadSetting.leadTierId,
                province: leadSetting.province
            }
            await InternalHelper.removeLeadSetting(payload).catch(error => console.error(error));
            await this.dealershipLeadSettings.delete({ id: id });
        }
        return leadSetting;
    }

    public async uploadLogo(id: string, file: any) {
        let dealership = await this.getLogo(id);
        if (dealership && dealership.logoUrl) {
            await this.s3.deleteFile(this.s3.getKeyFromUrl(dealership.logoUrl))
        }
        const data = await this.s3.uploadSingle(file, 'dealership-logos');
        return this.dealershipRepo.update({ id: id }, { logoUrl: data.Location });
    }

    public async getLogo(dealershipId: string) {
        let dealership = await this.dealershipRepo.findOne({ where: { id: dealershipId }, select: ['id', 'logoUrl'] });
        if (!dealership) throw new BadRequestException('Invalid Dealership');
        return dealership;
    }

    public async addImage(id: string, file: any) {
        const data = await this.s3.uploadSingle(file, 'dealership-images');
        return this.dealershipImageRepo.insert({
            dealership: id,
            originalName: file.originalname,
            url: data.Location,
            key: data.Key
        });
    }

    public async overrideImage(imageId: number, file: any) {
        if (!file) {
            throw new BadRequestException('invalid image');
        }
        const image = await this.dealershipImageRepo.findOne({ where: { id: imageId }, select: ["id", "key", "dealership"] });
        if (image && image.key) {
            await this.s3.deleteFile(image.key);
        }
        const data = await this.s3.uploadSingle(file, 'dealership-images');
        if (data) {
            await this.dealershipImageRepo.update({ id: imageId }, { originalName: file.originalname, url: data.Location, key: data.Key });
        }
        image.key = data.Key;
        image.originalName = file.originalname;
        image.url = data.Location;
        return image;
    }

    public async deleteImage(id: number) {
        const image = await this.dealershipImageRepo.findOne({ id: id });
        if (image) {
            await Promise.all([this.s3.deleteFile(image.key), this.dealershipImageRepo.delete({ id })])
        }
        return this.dealershipImageRepo.find({ dealership: image.dealership });
    }

    public async get(user: TokenDTO, query: RequestQuery<DealershipFilterDTO>) {
        const { filter, pagination, sort } = this.getQuery(query);
        const dealershipQB = this.dealershipRepo
            .createQueryBuilder('dealership')
            .select('dealership.id', 'id')
            .addSelect('dealership.name', 'name')
            .addSelect('dealership.status', 'status')
            .addSelect('dealership.phone', 'phone')
            .addSelect('dealership.addressLine1', 'addressLine1')
            .addSelect('dealership.addressLine2', 'addressLine2')
            .addSelect('dealership.longitude', 'longitude')
            .addSelect('dealership.latitude', 'latitude')
            .addSelect('dealership.city', 'city')
            .addSelect('dealership.province', 'province')
            .addSelect('dealership.omvicLicense', 'omvicLicense')
            .addSelect('dealership.email', 'email')
            .addSelect('dealership.logo', 'logo')
            .addSelect('dealerGroup.id', 'dealerGroupId')
            .addSelect('dealerGroup.name', 'dealerGroupName')
            .addSelect('profile.firstName', 'gmFirstName')
            .addSelect('profile.lastName', 'gmLastName')
            .leftJoin('dealership.dealerGroup', 'dealerGroup')
            .leftJoin('dealership.generalManager', 'generalManager')
            .leftJoin('generalManager.profile', 'profile');


        const status = filter.status ? filter.status : AccountStatus.ACTIVE;
        if (status) {
            dealershipQB.where(`dealership.status = :status`, { status: status })
        }

        if (user.userLevel == Level.ROOT && (!filter.dealerGroupId && !filter?.dealerGroupIds?.length)) {
            throw new BadRequestException('dealerGroupId is required');
        }

        if (user.userLevel == Level.ROOT && filter.dealerGroupId) {
            dealershipQB.andWhere('dealership.dealerGroup = :dealerGroupId', {
                dealerGroupId: filter.dealerGroupId,
            });
        }

        if (user.userLevel == Level.DEALERGROUP) {
            dealershipQB.andWhere('dealership.dealerGroup = :dealerGroupId', {
                dealerGroupId: user.dealerGroup,
            });
        }

        if (user.userLevel == Level.DEALERSHIP) {
            const userRoles = await getRepository(UserRoleEntity)
                .createQueryBuilder('userRoles')
                .select('userRoles.dealershipId')
                .where('userRoles.user = :user', { user: user.id })
                .getRawMany();
            const dealerships = userRoles.map((el) => el.dealershipId);
            dealershipQB.whereInIds(dealerships);
        }

        if (filter.dealerGroupIds && filter.dealerGroupIds.length) {
            dealershipQB.andWhere('dealership.dealerGroup IN (:...dealerGroupIds)', {
                dealerGroupIds: filter.dealerGroupIds,
            });
        }
        if (user.userLevel != Level.DEALERSHIP && filter.dealershipIds) {
            const dealershipIds = filter.dealershipIds.map((el) => el);
            dealershipQB.whereInIds(dealershipIds);
        }

        if (filter.keyword) {
            const keywordfilter = {
                keyword: `%${filter.keyword}%`,
            };
            dealershipQB.andWhere(
                new Brackets((qb) => {
                    qb.orWhere('dealership.name ILIKE :keyword', keywordfilter);
                    qb.orWhere('dealership.phone ILIKE :keyword', keywordfilter);
                    qb.orWhere('dealership.addressLine1 ILIKE :keyword', keywordfilter);
                    qb.orWhere('dealership.addressLine2 ILIKE :keyword', keywordfilter);
                    qb.orWhere('dealership.city ILIKE :keyword', keywordfilter);
                    qb.orWhere('dealership.province ILIKE :keyword', keywordfilter);
                    qb.orWhere('profile.firstName ILIKE :keyword', keywordfilter);
                    qb.orWhere('profile.lastName ILIKE :keyword', keywordfilter);
                }),
            );
        } else {
            if (filter.name)
                dealershipQB.andWhere('dealership.name ILIKE :name', {
                    name: `%${filter.name}%`,
                });
            // if (filter.status)
            //     dealershipQB.andWhere('dealership.status = :status', {
            //         status: filter.status,
            //     });
            if (filter.generalManager) {
                dealershipQB.andWhere('profile.firstName ILIKE :name', {
                    name: `%${filter.generalManager}%`,
                });
            }
            if (filter.phone) {
                dealershipQB.andWhere('dealership.phone ILIKE :phone', {
                    phone: `%${filter.phone}%`,
                });
            }
            if (filter.city) {
                dealershipQB.andWhere('dealership.city ILIKE :city', {
                    city: `%${filter.city}%`,
                });
            }
            if (filter.province) {
                dealershipQB.andWhere('dealership.province ILIKE :province', {
                    province: `%${filter.province}%`,
                });
            }
            if (filter.address) {
                const addressQuery = {
                    address: `%${filter.address}%`,
                };
                dealershipQB.andWhere(
                    'dealership.addressLine1 ILIKE :address OR dealership.addressLine2 ILIKE :address',
                    addressQuery,
                );
                // dealershipQB.orWhere(
                //     'dealership.addressLine2 ILIKE :address',
                //     addressQuery,
                // );
            }
            if (!Object.keys(sort).length) {
                dealershipQB.orderBy('dealership.createdAt', 'DESC');
            }
            if (sort.name) {
                dealershipQB.addOrderBy('dealership.name', sort.name.toUpperCase());
            }
            if (sort.address) {
                dealershipQB.addOrderBy('dealership.addressLine1', sort.address.toUpperCase());
            }
            if (sort.city) {
                dealershipQB.addOrderBy('dealership.city', sort.city.toUpperCase());
            }
            if (sort.province) {
                dealershipQB.addOrderBy('dealership.province', sort.province.toUpperCase());
            }
            if (sort.generalManager) {
                dealershipQB.addOrderBy('profile.firstName', sort.generalManager.toUpperCase());
            }
        }
        return paginateRaw(dealershipQB, pagination);
    }

    public async getById(user: TokenDTO, id: string) {

        const dealershipQB = this.dealershipRepo.createQueryBuilder('dealerships');
        dealershipQB.leftJoinAndSelect('dealerships.dealerGroup', 'dealerGroup')
            .leftJoinAndSelect('dealerships.images', 'images')
            .leftJoinAndSelect('dealerships.openingHours', 'openingHours')
            .leftJoinAndSelect('dealerships.leadSettings', 'leadSettings')
            .leftJoinAndSelect('dealerships.generalManager', 'generalManager')
            .leftJoinAndSelect('generalManager.profile', 'profile')
            .where('dealerships.id = :id', { id: id })


        if ([Level.DEALERGROUP, Level.DEALERSHIP].includes(user.userLevel as Level)) {
            dealershipQB.andWhere('dealerships.dealerGroup = :dealerGroup', { dealerGroup: user.dealerGroup })
        }

        if (user.userLevel == Level.DEALERSHIP && (id != user.dealership)) {
            throw new BadRequestException('Invalid Dealership: Incorrect Dealership Selected');
        }

        const dealership = await dealershipQB.getOne();

        if (!dealership) {
            throw new NotFoundException('Invalid Dealership');
        }

        dealership.openingHours.sort((a, b) => {
            if (a.id > b.id) return 1;
            return -1;
        });
        const generalManager = dealership.generalManager as any;
        if (dealership.generalManager) {
            const profile = generalManager.profile;
            dealership.generalManager = {
                id: generalManager.id,
                imageUrl: profile?.imageUrl,
                imageKey: profile?.imageKey,
                firstName: profile?.firstName,
                lastName: profile?.lastName,
                email: profile?.email,
                phone: profile?.phone,
                phoneExtension: profile?.phoneExtension,
                roleName: 'General Manager',
            } as any;
        }
        return dealership;
    }

    // public async getGeneralManager(dealershipId: string) {
    //   const qb = await getRepository(UserRoleEntity)
    //     .createQueryBuilder('userRole')
    //     .select('profile.firstName', 'firstName')
    //     .addSelect('user.id', 'userId')
    //     .addSelect('profile.lastName', 'lastName')
    //     .addSelect('profile.email', 'email')
    //     .addSelect('profile.phone', 'phone')
    //     .addSelect('profile.phoneExtension', 'phoneExtension')
    //     .addSelect('role.name', 'roleName')
    //     .innerJoin('userRole.user', 'user')
    //     .innerJoin('userRole.role', 'role')
    //     .innerJoin('user.profile', 'profile')
    //     .where('userRole.dealership = :id AND role.isGM = :isGM', {
    //       id: dealershipId,
    //       isGM: true,
    //     })
    //     .getRawOne();
    //   return qb;
    // }

    public async validateUser(
        dealerGroupId: string,
        dealershipId: string,
        email: string,
    ) {
        const user = await getRepository(UsersEntity).findOne({
            where: { username: email },
            relations: ['dealerGroup', 'dealership', 'userRoles', 'userRoles.role', 'profile', 'department'],
        });

        if (user) {
            const isGM = (user.userRoles as UserRoleEntity[]).find(
                (ur) => (ur.role as RoleEntity).isGM,
            );
            const dealerGroup = user.dealerGroup as DealerGroupEntity;
            const dealership = user.dealership as DealershipEntity;
            if (
                user.userLevel == Level.DEALERSHIP &&
                dealerGroup.id == dealerGroupId &&
                dealership.id != dealershipId &&
                !isGM
            ) {
                throw new BadRequestException(
                    'User Already Exists: Invalid User, Need General Manager',
                );
            }
        }

        return user;
    }

    public async isUserExistsForDealership(userDTO: UsersDTO) {
        const userRepo = getRepository(UsersEntity);
        if (userDTO.id) {
            const user = await userRepo.findOne({ id: userDTO.id });
            return user;
        }
        if (userDTO.email) {
            const user = await userRepo.findOne({ username: userDTO.email });
            if (user) {
                throw new BadRequestException('User Already Exists');
            }
        }
    }

    public async getDefaults(dealerGroup: string) {
        /** Create Department called sales  */

        const department = await getRepository(DepartmentEntity).findOne({ dealerGroup });

        /** Create Role Called General Manager Inside Sales Department */
        const role = await this.getGmRoleForDealership(dealerGroup);

        if (!department || !role) throw new BadRequestException('Department or role is not configured for general manager');

        return { department, role };
    }

    private getGmCopy(userDTO: UsersDTO) {
        return {
            firstName: userDTO.firstName,
            birthDate: userDTO.birthDate,
            lastName: userDTO.lastName,
            email: userDTO.email,
            gender: userDTO.gender,
            isInactive: false,
            isVisible: userDTO.isVisible,
            omvicLicense: userDTO.omvicLicense,
            omvicLicenseExpiry: userDTO.omvicLicenseExpiry,
            phone: userDTO.phone,
            phoneExtension: userDTO.phoneExtension,
            assignedPhoneNumber: userDTO.assignedPhoneNumber,
            source: DataSources.PORTAL,
        } as EmployeeEntity
    }

    public async saveGeneralManager(queryRunner: QueryRunner, userDTO: UsersDTO, dealerGroup: string, dealership: string, department: string, role: string, currentUser: TokenDTO) {
        let user = new UsersEntity();
        user.isDefault = true;
        user.createdBy = currentUser.id;
        user.dealerGroup = dealerGroup;
        user.department = department;
        user.dealership = dealership;
        user.userLevel = Level.DEALERSHIP;
        user.username = userDTO.email;
        user.loginEnabled = true;
        user.active = true;

        let employee = await queryRunner.manager.findOne(EmployeeEntity, { email: userDTO.email });
        if (employee && employee.id) {
            user.profile = { id: employee.id } as EmployeeEntity;
        } else {
            if (!userDTO.firstName || !userDTO.lastName || !userDTO.email || !userDTO.phone) {
                throw new BadRequestException('Missing Required Details for General Manager');
            }
            employee = this.getGmCopy(userDTO);
            user.profile = employee;
        }
        user.profile.isEnrolled = true;
        user.profile.communicationEmail = await this.userService.getCommunicationEmail(userDTO.email, dealership, Level.DEALERSHIP);

        const textPassword = userDTO.password ? userDTO.password : SecurityHelper.getPassword()

        user.password = SecurityHelper.getHash(textPassword);

        user = await queryRunner.manager.save(user);

        await queryRunner.manager.getRepository(UserRoleEntity).createQueryBuilder().insert().values({
            dealership: dealership,
            role: role,
            user: user.id
        }).onConflict('ON CONSTRAINT uk_userroles DO NOTHING').execute();

        /** sending welcome email */
        this.mailHelper.sendNewUserEmail({
            name: `${employee.firstName} ${employee.lastName}`,
            password: textPassword,
            username: user.username,
            to: userDTO.email
        }).catch((error) => {
            console.error(error);
        })

        return user;
    }

    public async deactivate(user: TokenDTO, id: string) {
        const dealership = await this.dealershipRepo.update(
            { id: id },
            { status: AccountStatus.INACTIVE, updatedBy: user.id },
        );
        await InternalHelper.deleteDealershipInDeal(id);
        return dealership
    }

    public async getDealershipByIds(user: TokenDTO, data) {

        const dealershipQB = this.dealershipRepo
            .createQueryBuilder('dealership')
            .select('dealership.id', 'id')
            .addSelect('dealership.name', 'name')
            .addSelect('dealership.status', 'status')
            .addSelect('dealership.phone', 'phone')
            .addSelect('dealership.addressLine1', 'addressLine1')
            .addSelect('dealership.addressLine2', 'addressLine2')
            .addSelect('dealership.longitude', 'longitude')
            .addSelect('dealership.latitude', 'latitude')
            .addSelect('dealership.city', 'city')
            .addSelect('dealership.province', 'province')
            .addSelect('dealership.omvicLicense', 'omvicLicense')
            .addSelect('dealership.email', 'email')
            .addSelect('dealership.logo', 'logo')
            .addSelect('dealership.country', 'country')
            .addSelect('dealership.postalCode', 'postalCode')
            .where(`dealership.status = :status`, { status: AccountStatus.ACTIVE })

        if (data.dealershipIds && data.dealershipIds.length > 0) {
            const dealershipIds = data.dealershipIds.map((el) => el);
            dealershipQB.whereInIds(dealershipIds);
        }
        return paginateRaw(dealershipQB, data.pagination);
    }

    public async dealershipDmsMapping(dmsIds: any, dealershipId: any) {
        const dmsFromDb : any = await this.dmsRepo.find({ where: { id: In(dmsIds) } })
            
        let dms = dmsIds.filter(dmsId => dmsFromDb.some(dms => dmsId == dms.id))
        if (dms?.length) {
            let dealershipDms = await this.dealershipDmsRepo.find({ where: { dealershipId: dealershipId}})
            if (dealershipDms?.length) await this.dealershipDmsRepo.delete({ dealershipId: dealershipId })
               
            let dealershipDmsPromise = []    
            for (let i = 0; i < dms?.length; i++) {
                dealershipDmsPromise.push(
                    this.dealershipDmsRepo.save({ dealershipId: dealershipId, dms: dms[i]})
                )
            }
                
            await Promise.all(dealershipDmsPromise)
        }
    }

}

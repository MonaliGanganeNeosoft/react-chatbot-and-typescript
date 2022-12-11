import { HttpHelper, RequestQuery } from '@401_digital/xrm-core';
import { difference, identity, isEqual } from 'lodash';
import { MICROSERVICES } from '@environments';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginateRaw } from 'nestjs-typeorm-paginate';
import { AwsService } from 'src/configs';
import { DataSources, Level } from 'src/constants';
import { EmployeeEntity } from 'src/entities/employee';
import { InternalHelper } from 'src/helpers/internal';
import { MailHelper } from 'src/helpers/mail';
import { SecurityHelper } from 'src/helpers/security';
import { Brackets, Db, getConnection, getManager, getRepository, In, Repository } from 'typeorm';
import { TokenDTO } from '../auth/auth.dto';
import { DealershipEntity } from '../dealership/dealership.entity';
import { InternalUserDTO } from '../internal/internal.dto';
import { RoleEntity } from '../user-roles/roles.entity';
import { UserRoleEntity } from './user-roles.entity';
import { SkillSetEntity } from './users-skillset.entity';
import { AddUsersDTO, UpdateUserDTO, UserRoleDTO, UsersDTO, UsersFilterDTO, UserImpersonationDTO, UpdateProfileDTO } from './users.dto';
import { UsersEntity } from './users.entity';
import { isEmail } from 'class-validator';
import { DealerGroupEntity } from '../dealer-groups/dealers-group.entity';
import { WEB_ACCESS_TOKEN_EXPIRY, PUBLIC_CALENDAR_URL_ENCRYPT } from '../../environment';
import { CryproHelper, TokensHelper } from '@401_digital/xrm-core';
import moment from 'moment';
import { CoreService } from 'src/core/core.service';
import { DmsEntity } from '../dms/dms.entity';
import { UserDmsEntity } from '../user-dms-mapping/userDms.entity';

@Injectable()
export class UsersService extends CoreService {
    protected logger = new Logger(UsersService.name);
    constructor(
        @InjectRepository(EmployeeEntity)
        private readonly employeeRepo: Repository<EmployeeEntity>,
        @InjectRepository(DmsEntity)
        private readonly dmsRepo: Repository<DmsEntity>,
        @InjectRepository(UserDmsEntity)
        private readonly userDmsRepo: Repository<UserDmsEntity>,
        private mailHelper: MailHelper,
        private s3: AwsService,
    ) {
        super();
    }

    private checkUserExists(email: string) {
        const user = this.employeeRepo
            .createQueryBuilder('employee')
            .select('employee.id', 'id')
            .addSelect('employee.email', 'email')
            .addSelect('employee.isEnrolled', 'isEnrolled')
            .addSelect('user.username', 'username')
            .leftJoinAndSelect(UsersEntity, 'user', 'user.profile = employee.id')
            .where('employee.email = :email OR user.username = :email', {
                email: email,
            })
            .getRawOne();
        return user;
    }

    private async checkAssignedPhoneNumber(assignedPhoneNumber: string) {
        const exists = await this.employeeRepo.findOne({ assignedPhoneNumber: assignedPhoneNumber });
        if (exists) throw new BadRequestException('phone number is already assigned to other staff')
    }

    private copyEmployee(userDTO: AddUsersDTO) {
        const employeeEntity = new EmployeeEntity();
        employeeEntity.isInactive = false;
        employeeEntity.source = DataSources.PORTAL;
        if (userDTO.firstName) employeeEntity.firstName = userDTO.firstName;
        if (userDTO.lastName) employeeEntity.lastName = userDTO.lastName;
        if (userDTO.gender) employeeEntity.gender = userDTO.gender;
        if (userDTO.birthDate) employeeEntity.birthDate = userDTO.birthDate;
        if (typeof userDTO.isVisible == 'boolean') employeeEntity.isVisible = userDTO.isVisible;
        if (userDTO.omvicLicense) employeeEntity.omvicLicense = userDTO.omvicLicense;
        if (userDTO.omvicLicenseExpiry) employeeEntity.omvicLicenseExpiry = userDTO.omvicLicenseExpiry;
        if (userDTO.email) employeeEntity.email = userDTO.email;
        if (userDTO.phone) employeeEntity.phone = userDTO.phone;
        if (userDTO.assignedPhoneNumber) employeeEntity.assignedPhoneNumber = userDTO.assignedPhoneNumber;
        if (userDTO.phoneExtension) employeeEntity.phoneExtension = userDTO.phoneExtension;
        return employeeEntity;
    }

    private copyUser(userDTO: AddUsersDTO) {
        const userEntity = new UsersEntity();
        userEntity.username = userDTO.email;
        if (typeof userDTO.loginEnabled == 'boolean') {
            userEntity.loginEnabled = userDTO.loginEnabled;
        }
        userEntity.department = userDTO?.department?.id;
        userEntity.reportsTo = userDTO?.reportsTo?.id;
        if (userDTO.skillSet) {
            userEntity.skillSet = Object.assign(
                new SkillSetEntity(),
                userDTO.skillSet,
            );
        }
        return userEntity;
    }

    public async update(currentUser: TokenDTO, userId: string, userDTO: UpdateUserDTO) {
        const user = await this.getUserDetails(userId);

        const currentUserDetails = await this.getUserDetails(currentUser.id);

        const currentUserRole = (currentUserDetails?.userRoles[0]?.role as RoleEntity);

        if (!user) throw new BadRequestException('Invalid user id');

        if (!user.active && !userDTO.active) throw new BadRequestException('user is not active');

        const userEntity = new UsersEntity();
        const employee = new EmployeeEntity();

        if (userDTO.assignedPhoneNumber) {
            if (currentUserRole.isDefault && currentUserRole.name == "System Admin") {
                employee.assignedPhoneNumber = userDTO.assignedPhoneNumber;
            } else {
                throw new BadRequestException('Only System Admin can update assigned phone number of user')
            }
        }

        userEntity.id = userId;

        if (typeof userDTO.loginEnabled == 'boolean') userEntity.loginEnabled = userDTO.loginEnabled;

        if (userDTO.skillSet) {
            userEntity.skillSet = Object.assign(
                new SkillSetEntity(),
                userDTO.skillSet,
            );
            if (user.skillSet) {
                userEntity.skillSet.id = (user.skillSet as SkillSetEntity).id;
            }
        }

        userEntity.reportsTo = userDTO?.reportsTo?.id;
        userEntity.updatedBy = currentUser.id;

        if (user.profile) employee.id = (user.profile as EmployeeEntity).id;
        if (userDTO.firstName) employee.firstName = userDTO.firstName;
        if (userDTO.lastName) employee.lastName = userDTO.lastName;
        if (userDTO.gender) employee.gender = userDTO.gender;
        if (userDTO.birthDate) employee.birthDate = userDTO.birthDate;
        if (typeof userDTO.isVisible == 'boolean') employee.isVisible = userDTO.isVisible;
        if (userDTO.omvicLicense) employee.omvicLicense = userDTO.omvicLicense;
        if (typeof userDTO.isLicenseInProgress == 'boolean') employee.isLicenseInProgress = userDTO.isLicenseInProgress;
        if (userDTO.omvicLicenseExpiry) employee.omvicLicenseExpiry = userDTO.omvicLicenseExpiry;
        if (userDTO.phone) employee.phone = userDTO.phone;
        if (userDTO.phoneExtension) employee.phoneExtension = userDTO.phoneExtension;
        if (userDTO.dailyLimit) employee.dailyLimit = userDTO.dailyLimit;
        if (userDTO.monthlyLimit) employee.monthlyLimit = userDTO.monthlyLimit;
        if (userDTO?.department?.id) user.department = userDTO.department.id;

        userEntity.profile = employee;

        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const promises = [];
            let roles = [];
            if (userDTO.roles) {
                if (Array.isArray(userDTO.roles)) {
                    roles = userDTO.roles;
                } else {
                    roles.push(userDTO.roles);
                }
            }

            const newRoles = roles.map(el => el?.role);
            const oldRoles = user.userRoles.map(el => (el?.role as RoleEntity)?.id).filter(item => item);

            const roleId = newRoles[0] ? newRoles[0] : oldRoles[0];

            let rolesToAdd;

            if (roles && roles.length) {

                const added = difference(newRoles, oldRoles);
                const removed = difference(oldRoles, newRoles);
                const isSame = isEqual(oldRoles, newRoles);

                if (!isSame) {
                    if (added && added.length) {
                        const allAddedRoles = await getRepository(RoleEntity).find({ id: In(added) });

                        const hasDifferentLevel = allAddedRoles.find(rl => rl.level != user.userLevel);

                        if (hasDifferentLevel) {
                            throw new BadRequestException(`userLevel ${user.userLevel} cant have roles of level ${hasDifferentLevel.level}`);
                        }
                        rolesToAdd = added.map((roleId) => ({
                            dealership: (user?.dealership as DealershipEntity)?.id,
                            role: roleId,
                            user: userId,
                        }));
                        await queryRunner.manager.getRepository(UserRoleEntity).save(rolesToAdd);
                    }

                    if (removed && removed.length) {
                        await queryRunner.manager.getRepository(UserRoleEntity).delete({ role: In(removed), user: userId })
                    }
                }
            }

            const role = await getRepository(RoleEntity).findOne({ id: roleId });

            if (!role) throw new BadRequestException('Invalid Role Selected');

            const dealerGroup = user.dealerGroup as DealerGroupEntity;
            const dealership = user.dealership as DealershipEntity;

            const userResponse = await queryRunner.manager.getRepository(UsersEntity).save(userEntity);
         
            if (userDTO?.dmsIds?.length) {
                this.userDmsMapping(userDTO.dmsIds, userResponse.id)
            }

            /** Update in leads */
            await this.setupLead(
                this.copyStaffForLeadSettings({ ...userDTO as any, userLevel: user.userLevel }, dealerGroup?.id, dealership?.id, userId, role.canReceiveLeads),
                "put"
            )

            /** update in communications */
            await InternalHelper.setupMessaging({
                id: userId,
                userRoles: rolesToAdd,
                profile: {
                    assignedPhoneNumber: userDTO.assignedPhoneNumber,
                    phone: userDTO.phone
                } as any
            } as UsersEntity);

            /** update in deals */
            const http = new HttpHelper(MICROSERVICES.DEAL.HOST);
            await http['put'](`api/internal/updateStat/${userId}`);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }



        return userDTO;
    }


    private validateUserLevel(userLevel: Level, currentUserLevel: Level) {
        if (userLevel) {
            // if (userLevel == Level.DEALERGROUP && currentUserLevel != Level.ROOT) {
            //     throw new BadRequestException('userLevel Invalid');
            // }
            return userLevel;
        }
        return Level.DEALERSHIP;
    }

    private validate(user: TokenDTO, userDTO: UsersDTO) {
        let dealerGroup, dealership;
        if (user.userLevel == Level.ROOT) {
            if ([Level.DEALERGROUP, Level.DEALERSHIP].includes(userDTO.userLevel) && (!userDTO?.dealerGroup || !userDTO?.dealerGroup?.id)) {
                throw new BadRequestException('dealerGroup Required');
            } else {
                dealerGroup = userDTO?.dealerGroup?.id;
            }

            if (userDTO.userLevel == Level.DEALERSHIP && (!userDTO?.dealership || !userDTO?.dealership?.id)) {
                throw new BadRequestException('dealership Required');
            } else {
                dealership = userDTO?.dealership?.id;
            }
        }
        if (user.userLevel == Level.DEALERGROUP) {
            if (userDTO.userLevel == Level.ROOT) throw new BadRequestException('Unauthorized to create user at ROOT level');
            dealerGroup = user.dealerGroup;
            if (userDTO.userLevel == Level.DEALERSHIP && (!userDTO?.dealership || !userDTO?.dealership?.id)) {
                throw new BadRequestException('dealership Required');
            } else {
                dealership = userDTO?.dealership?.id;
            }

        }

        if (user.userLevel == Level.DEALERSHIP) {
            dealerGroup = user.dealerGroup;
            dealership = userDTO.dealership && userDTO.dealership.id ? userDTO.dealership.id : user.dealership;
        }

        if (userDTO.userLevel == Level.DEALERSHIP && !userDTO.assignedPhoneNumber) throw new BadRequestException('assignedPhoneNumber is required');

        return { dealerGroup, dealership }

    }

    public async save(user: TokenDTO, userDTO: AddUsersDTO, file?: any) {

        const role = userDTO?.roles[0]?.role;
        if (!role) throw new BadRequestException('At-least one role is required');

        const { dealerGroup, dealership } = this.validate(user, userDTO as any);        

        if (userDTO.assignedPhoneNumber) await this.checkAssignedPhoneNumber(userDTO.assignedPhoneNumber);

        const employeeEntity = this.copyEmployee(userDTO);
        const userEntity = this.copyUser(userDTO);
        userEntity.createdBy = user.id;
        userEntity.updatedBy = user.id;
        userEntity.userLevel = this.validateUserLevel(userDTO.userLevel, user.userLevel as Level);

        userEntity.dealerGroup = dealerGroup;
        // dealership id added
        userEntity.dealership = dealership;

        if (userDTO.userLevel == Level.DEALERSHIP) {
            employeeEntity.communicationEmail = userDTO.communicationEmail && isEmail(userDTO.communicationEmail) ? userDTO.communicationEmail : await this.getCommunicationEmail(userDTO.email, dealership, Level.DEALERSHIP);
        }
        if (userDTO.userLevel == Level.DEALERGROUP) {
            employeeEntity.communicationEmail = userDTO.communicationEmail && isEmail(userDTO.communicationEmail) ? userDTO.communicationEmail : await this.getCommunicationEmail(userDTO.email, dealerGroup, Level.DEALERGROUP);
        }

        let profile = new EmployeeEntity();
        const userRole = await getRepository(RoleEntity).findOne({ id: role, level: userEntity.userLevel as Level });
        if (!userRole) throw new BadRequestException('Invalid Role: User level and role level should be same.');

        if (userRole.canReceiveLeads && (!userDTO.skillSet || !userDTO.skillSet.leadTypes || !userDTO.skillSet.leadTypes.length)) {
            throw new BadRequestException('Invalid Skillset: User Cant receive leads')
        }

        const userData = await this.checkUserExists(userDTO.email);

        if (userData) {
            if (userData.isEnrolled || userData.username) throw new BadRequestException('User Already Exists');
            profile = employeeEntity;
            profile.id = userData.id;
        } else {
            profile = employeeEntity;
        }

        /** transaction */
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            if (file) {
                const imageData = await this.s3.uploadSingle(file, 'user-images');
                if (!imageData) throw new InternalServerErrorException('Image Processing Error');
                profile.imageKey = imageData.Key;
                profile.imageUrl = imageData.Location;
            }

            profile.slug = await this.getSlug(userDTO.firstName); //func call
            profile.isEnrolled = true;
            userEntity.profile = profile;
            const password = SecurityHelper.getPassword();
            userEntity.password = SecurityHelper.getHash(password);

            const userResponse = await queryRunner.manager.getRepository(UsersEntity).save(userEntity);            
            userDTO.id = userResponse.id;
            
            if (userDTO?.dmsIds?.length) {
                this.userDmsMapping(userDTO.dmsIds, userResponse.id)
            }

            const userRoles = userDTO.roles.map((userRole) => ({
                dealership: userRole.dealership ? userRole.dealership : userEntity.dealership,
                role: userRole.role,
                user: userResponse.id,
            }))            
            userDTO.communicationEmail = employeeEntity.communicationEmail;

            let extraFields: any = {};
            extraFields.imageUrl = profile.imageUrl;
            extraFields.slug = profile.slug;

            await queryRunner.manager.getRepository(UserRoleEntity).save(userRoles);            
            await this.setupLead(this.copyStaffForLeadSettings(
                userDTO as any,
                userEntity?.dealerGroup?.toString(),
                userEntity?.dealership?.toString(),
                userResponse.id,
                userRole.canReceiveLeads,
                extraFields
            ));
            await InternalHelper.setupMessaging(userResponse, userRoles);
            await queryRunner.commitTransaction();

            this.mailHelper.sendNewUserEmail({
                name: employeeEntity.firstName,
                password: password,
                username: employeeEntity.email,
                to: employeeEntity.email
            }).then(() => {
                console.log("New User Email Sent")
            }).catch((error) => {
                console.error(error);
            })
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release()
        }

        return userDTO;

    }

    public async getCommunicationEmail(primaryEmail: string, id: string, domainUrlFor: string) {
        let datasetForDomain;        
        if (domainUrlFor == Level.DEALERSHIP) {
            datasetForDomain = await getRepository(DealershipEntity).findOne({ id });            
            if (!datasetForDomain.domainUrl) throw new Error("Dealership domain required")
        }
        if (domainUrlFor == Level.DEALERGROUP) {
            datasetForDomain = await getRepository(DealerGroupEntity).findOne({ id });
            if (!datasetForDomain.domainUrl) throw new Error("Dealergroup domain required")
        }

        const salesDomain = datasetForDomain.domainUrl /*DEFAULT_SALES_DOMAIN;*/
        const split = primaryEmail.split('@');
        const leftPart = split[0];
        const communicationEmail = leftPart.concat(`@${salesDomain}`);
        return communicationEmail;
    }

    private copyStaffForLeadSettings(p: UsersDTO, dealerGroupId: string, dealershipId: string, userId: string, isSalesAgent: boolean = false, extraFields: any = {}) {
        const q = new InternalUserDTO();
        q.uniqueId = userId;
        q.userLevel = p.userLevel ? p.userLevel : Level.DEALERSHIP;
        q.isSalesAgent = isSalesAgent;
        q.canReceiveLeads = isSalesAgent;
        if (dealerGroupId) q.dealergroupId = dealerGroupId;
        if (dealershipId) q.dealershipId = dealershipId;
        if (p.email) q.email = p.email;
        if (p.communicationEmail) q.communicationEmail = p.communicationEmail;
        if (p.firstName) q.firstName = p.firstName;
        if (p.lastName) q.lastName = p.lastName;
        if (p.active != undefined) q.isActive = p.active;
        if (p.phone) q.phoneNumber = p.phone;
        if (p.skillSet) q.skillSet = { leadTypeId: p.skillSet.leadTypes, languages: p.skillSet.languages };
        if (p.assignedPhoneNumber) q.assignedPhoneNumber = p.assignedPhoneNumber;
        if (p.dailyLimit != undefined) q.dailyLimit = p.dailyLimit;
        if (p.monthlyLimit != undefined) q.monthlyLimit = p.monthlyLimit;
        if (p.department != undefined) q.departmentId = p.department.id;
        if (p.roles != undefined && Array.isArray(p.roles)) q.roles = p.roles.map(el => el.role);
        if (extraFields) {
            q.imageUrl = extraFields.imageUrl;
            q.slug = extraFields.slug;
        }
        if (p?.department?.id) q.departmentId = p.department.id        
        return q;
    }

    async setupLead(payload: InternalUserDTO, type: 'post' | 'put' | 'delete' = 'post') {
        const http = new HttpHelper(MICROSERVICES.LEAD.HOST);
        const data = await http[type]('api/internal/staff', payload);
        return data;
    }

    public async get(user: TokenDTO, reqQuery: RequestQuery<UsersFilterDTO>) {
        const { filter, pagination, sort, ...otherInfo } = this.getQuery(reqQuery);
        let responseType = reqQuery['responseType'];

        let users = getRepository(UsersEntity).createQueryBuilder('user');
        const userLevel = filter.userLevel ? filter.userLevel : user.userLevel;



        if (userLevel == Level.DEALERSHIP) {
            users.select('user.id', 'userId')
                .addSelect('user.active', 'active')
                .addSelect('user.userLevel', 'userLevel')
                .addSelect('user.createdAt', 'createdAt')
                .addSelect('dealership.id', 'dealershipId')
                .addSelect('department.id', 'departmentId')
                .addSelect('department.name', 'departmentName')
                .addSelect('dealership.name', 'dealershipName')
                .addSelect('dealerGroup.id', 'dealerGroupId')
                .addSelect('dealerGroup.name', 'dealerGroupName')
                .addSelect('profile.firstName', 'firstName')
                .addSelect('profile.lastName', 'lastName')
                .addSelect('profile.email', 'email')
                .addSelect('profile.imageUrl', 'imageUrl')
                .addSelect('profile.assignedPhoneNumber', 'assignedPhoneNumber')
                .addSelect('role.name', 'roleName')
                .addSelect('role.id', 'roleId')
                .leftJoin('user.dealerGroup', 'dealerGroup')
                .leftJoin('user.dealership', 'dealership')
                .leftJoin('user.department', 'department')
                .leftJoin('user.profile', 'profile')
                .leftJoin('user.userRoles', 'userRole', "user.dealership = userRole.dealership")
                .leftJoin('userRole.role', 'role')
        } else {
            users.select('user.id', 'userId')
                .addSelect('user.active', 'active')
                .addSelect('user.userLevel', 'userLevel')
                .addSelect('user.createdAt', 'createdAt')
                .addSelect('dealership.id', 'dealershipId')
                .addSelect('dealership.name', 'dealershipName')
                .addSelect('department.id', 'departmentId')
                .addSelect('department.name', 'departmentName')
                .addSelect('dealerGroup.id', 'dealerGroupId')
                .addSelect('dealerGroup.name', 'dealerGroupName')
                .addSelect('profile.firstName', 'firstName')
                .addSelect('profile.lastName', 'lastName')
                .addSelect('profile.email', 'email')
                .addSelect('profile.imageUrl', 'imageUrl')
                .addSelect('profile.assignedPhoneNumber', 'assignedPhoneNumber')
                .addSelect('profile.phone', 'phone')
                .addSelect('profile.isLicenseInProgress', 'isLicenseInProgress')
                .addSelect('profile.omvicLicense', 'omvicLicense')
                .addSelect('profile.omvicLicenseExpiry', 'omvicLicenseExpiry')
                .addSelect('reportsToProfile.firstName', 'reportsToFirstName')
                .addSelect('reportsToProfile.lastName', 'reportsToLastName')
                .addSelect('role.name', 'roleName')
                .addSelect('role.id', 'roleId')
                .leftJoin('user.department', 'department')
                .leftJoin('user.dealerGroup', 'dealerGroup')
                .leftJoin('user.dealership', 'dealership')
                .leftJoin('user.profile', 'profile')
                .leftJoin('user.userRoles', 'userRole')
                .leftJoin('userRole.role', 'role')
                .leftJoin('user.reportsTo', 'reportsTo')
                .leftJoin('reportsTo.profile', 'reportsToProfile')
        }


        users.distinct(true);

        //users
        //    .select('"user"."id" as "userId", "user"."active" as "active", "user"."created_at" as "createdAt", "dealership"."id" as "dealershipId", "dealership"."name" as "dealershipName", "department"."id" as "departmentId", "department"."name" as "departmentName", "dealerGroup"."id" as "dealerGroupId", "dealerGroup"."name" as "dealerGroupName", "profile"."first_name" as "firstName", "profile"."last_name" as "lastName", "profile"."email" as "email", "profile"."image_url" as "imageUrl", "profile"."assigned_phone_number" as "assignedPhoneNumber", "role"."name" as "roleName", "role"."id" as "roleId"')

        // .addSelect('user.active', 'active')
        // .addSelect('user.userLevel', 'userLevel')
        // .addSelect('user.createdAt', 'createdAt')
        // .addSelect('dealership.id', 'dealershipId')
        // .addSelect('dealership.name', 'dealershipName')
        // .addSelect('department.id', 'departmentId')
        // .addSelect('department.name', 'departmentName')
        // .addSelect('dealerGroup.id', 'dealerGroupId')
        // .addSelect('dealerGroup.name', 'dealerGroupName')
        // .addSelect('profile.firstName', 'firstName')
        // .addSelect('profile.lastName', 'lastName')
        // .addSelect('profile.email', 'email')
        // .addSelect('profile.imageUrl', 'imageUrl')
        // .addSelect('profile.assignedPhoneNumber', 'assignedPhoneNumber')
        // .addSelect('role.name', 'roleName')
        // .addSelect('role.id', 'roleId')

        /**
         * we can map user by dealership
        user.dealership = userRole.dealership
         */
        const active = typeof filter.active == 'boolean' ? filter.active : true;

        users.andWhere('user.active = :active', { active: active });

        /** Hide self from list */
        users.andWhere('user.id != :id', { id: user.id });
        if (filter.currentUserId) {
            users.andWhere('user.id != :id', { id: filter.currentUserId });
        }

        /** Core Filters */
        if (user.userLevel == Level.DEALERGROUP) {
            filter.dealerGroupId = user.dealerGroup;
        }

        if (user.userLevel == Level.DEALERSHIP) {
            filter.dealerGroupId = user.dealerGroup;
            filter.dealershipId = filter.dealershipId ? filter.dealershipId : user.dealership;
            const reporters = await this.privateGetAllReporters(user.id);
            if (reporters.length) {
                users.andWhere('user.id IN (:...reporters)', {
                    reporters: reporters,
                });
            }
        }

        if (filter.userLevel) {
            users.andWhere('user.userLevel = :userLevel', {
                userLevel: filter.userLevel,
            });
        }

        if (filter.dealerGroupId) {
            users.andWhere('user.dealerGroup = :dealerGroup', {
                dealerGroup: filter.dealerGroupId,
            });
        }

        if (filter.dealershipId) {
            users.andWhere('user.dealership = :dealership', {
                dealership: filter.dealershipId,
            });
        }


        // if (!filter.dealerGroupId && !filter.dealershipId) {
        //     users.andWhere('user.userLevel = :level', {
        //         level: user.userLevel,
        //     });
        // }

        /** Manual Filters */
        if (filter.keyword) {
            const keywordfilter = {
                keyword: `%${filter.keyword}%`,
            };
            users.andWhere(
                new Brackets((qb) => {
                    qb.orWhere('profile.firstName ILIKE :keyword', keywordfilter);
                    qb.orWhere('profile.lastName ILIKE :keyword', keywordfilter);
                    qb.orWhere('profile.email ILIKE :keyword', keywordfilter);
                    qb.orWhere('profile.phone ILIKE :keyword', keywordfilter);
                    qb.orWhere('profile.assignedPhoneNumber ILIKE :keyword', keywordfilter);
                    qb.orWhere('profile.omvicLicense ILIKE :keyword', keywordfilter);
                    qb.orWhere('role.name ILIKE :keyword', keywordfilter);
                }),
            );
        } else {

            if (filter.departmentId) {
                users.andWhere('user.department = :departmentId', {
                    departmentId: filter.departmentId,
                });
            }

            if (filter.assignedPhoneNumber) {
                users.andWhere('profile.assignedPhoneNumber = :assignedPhoneNumber', {
                    assignedPhoneNumber: filter.assignedPhoneNumber,
                });
            }


            if (filter.roleId) {
                users.andWhere('userRole.role = :roleId AND role.id = :roleId', {
                    roleId: filter.roleId,
                });
            }

            if (filter.firstName) {
                users.andWhere('profile.firstName ILIKE :firstName', {
                    firstName: `%${filter.firstName}%`,
                });
            }

            if (filter.lastName) {
                users.andWhere('profile.lastName ILIKE :lastName', {
                    lastName: `%${filter.lastName}%`,
                });
            }

            if (filter.dealershipName) {
                users.andWhere('dealership.name ILIKE :dealershipName', {
                    dealershipName: `%${filter.dealershipName}%`,
                });
            }

            if (filter.dealerGroupName) {
                users.andWhere('dealerGroup.name ILIKE :dealerGroupName', {
                    dealerGroupName: `%${filter.dealerGroupName}%`,
                });
            }

            if (filter.roleName) {
                users.andWhere('role.name ILIKE :roleName', {
                    roleName: `%${filter.roleName}%`,
                });
            }
            if (filter.startDate && filter.endDate) {

                const sDate = moment(filter.startDate, 'DD-MM-YYYY').format('YYYY-MM-DD 00:00:00');
                const eDate = moment(filter.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD 23:59:00');

                users.andWhere(`(user.createdAt BETWEEN '${sDate}' AND '${eDate}')`)
            }
        }

        /** Sorting */
        if (!Object.keys(sort).length) {
            users.orderBy('user.createdAt', 'DESC');
        }

        if (sort.firstName) {
            users.addOrderBy('profile.firstName', sort.firstName.toUpperCase());
        }

        if (sort.lastName) {
            users.addOrderBy('profile.lastName', sort.lastName.toUpperCase());
        }

        if (sort.dealershipName) {
            users.addOrderBy('dealership.name', sort.dealershipName.toUpperCase());
        }

        if (sort.roleName) {
            users.addOrderBy('role.name', sort.roleName.toUpperCase());
        }

        if (sort.createdAt) {
            users.addOrderBy('user.createdAt', sort.createdAt.toUpperCase());
        }

        if (sort.assignedPhoneNumber) {
            users.addOrderBy('profile.assignedPhoneNumber', sort.assignedPhoneNumber.toUpperCase());
        }

        if (responseType === 'EXPORT') {
            return paginateRaw(users, {
                limit: 50000,
                page: 1
            });
        }
        else {
            return paginateRaw(users, pagination);
        }
    }

    public async getById(tokenPayload: TokenDTO, id: string) {

        const qb = getRepository(UsersEntity).createQueryBuilder('user')
            .addSelect([
                'user.id', 'user.dealerGroup', 'dealerGroup.id', 'dealerGroup.name',
                'user.dealership', 'dealership.id', 'dealership.name',
                'user.department', 'department.id', 'department.name',
                'userRoles.id', 'userRoles.user', 'userRoles.role', 'role.id', 'role.name',
                'reportsTo.id', 'reportsTo.profile', 'reportsToProfile.id', 'reportsToProfile.firstName', 'reportsToProfile.lastName', 'reportsToProfile.email'
            ])
            .leftJoin('user.dealerGroup', 'dealerGroup')
            .leftJoin('user.dealership', 'dealership')
            .leftJoin('user.department', 'department')
            .leftJoinAndSelect('user.skillSet', 'skillSet')
            .leftJoinAndSelect('user.profile', 'profile')
            .leftJoin('user.userRoles', 'userRoles')
            .leftJoin('userRoles.role', 'role')
            .leftJoin('user.reportsTo', 'reportsTo')
            .leftJoin('reportsTo.profile', 'reportsToProfile')

            .where('user.id = :userId', { userId: id })
        if (tokenPayload.userLevel == Level.DEALERGROUP) {
            qb.andWhere('user.dealerGroup = :dealerGroup', { dealerGroup: tokenPayload.dealerGroup })
        }

        if (tokenPayload.userLevel == Level.DEALERSHIP) {
            qb.andWhere('user.dealership = :dealership', { dealership: tokenPayload.dealership })
        }
        const user = await qb.getOne() as any;

        if (!user) {
            throw new BadRequestException('Invalid User: User Not Found');
        }

        //let slugName = CryproHelper.encryptWithGlobalKey(id, PUBLIC_CALENDAR_URL_ENCRYPT);

        user.profile.publicAppointmentSlug = (user.profile.slug) ? user.profile.slug : '';

        user.roles = user.userRoles.map((el) => ({ user: id, role: el.role && el.role.id ? el.role.id : null, dealership: el.dealership && el.dealership.id ? el.dealership.id : null }));

        return user;
    }

    public async isUserExistsForDealership(email: string) {
        const data = await getManager()
            .createQueryBuilder(EmployeeEntity, 'employee')
            .select('user.dealership', 'dealership')
            .addSelect('dealers.name', 'dealername')
            .innerJoin(UsersEntity, 'user', 'employee.id = user.profile')
            .innerJoin(DealershipEntity, 'dealers', 'dealership = dealers.id')
            .where('employee.email = :email', { email: email })
            .getRawOne();
        return data;
    }

    public async getSalesPerson(id: string, serialNumber: string) {
        const employee = await this.employeeRepo.find({
            where: {
                PbsEmployeeId: id,
                SerialNumber: serialNumber,
            },
        });
        return employee;
    }

    public addRoleAndDealership(
        dealership: string,
        role: string,
        userId: string,
    ) {
        const rolePermissionRepo = getRepository(UserRoleEntity);
        return rolePermissionRepo
            .createQueryBuilder()
            .insert()
            .values({
                dealership: dealership,
                role: role,
                user: userId,
            })
            .onConflict('ON CONSTRAINT uk_userroles DO NOTHING')
            .execute();
    }

    public revokeRoleAndDealership(dealership: string, userId: string) {
        return getRepository(UserRoleEntity).delete({ user: userId, dealership });
    }

    public async revokeRole(currentUser: TokenDTO, id: string) {
        if (isNaN(id as any)) {
            throw new BadRequestException('Invalid id');
        }
        const userRole = await getRepository(UserRoleEntity)
            .createQueryBuilder('userRole')
            .select('userRole.user', 'user')
            .where('userRole.id = :id', { id: Number.parseInt(id) })
            .getRawOne();
        if (!userRole) {
            throw new BadRequestException('Invalid User Role Id');
        }
        if (userRole.user == currentUser.id) {
            throw new UnauthorizedException(`Can't Revoke Self Role`);
        }
        return getRepository(UserRoleEntity).delete({
            id: Number.parseInt(id),
        });
    }

    public async addRole(dto: UserRoleDTO) {
        const user = await getRepository(UsersEntity).findOne({
            where: { id: dto.user },
            select: ['userLevel'],
        });
        if (!user) {
            throw new BadRequestException('Invalid User');
        }
        if (user.userLevel == Level.DEALERGROUP) {
            await this.addRoleAndDealership(null, dto.role, dto.user);
        }

        if (user.userLevel == Level.DEALERSHIP && !dto.dealership) {
            throw new BadRequestException('Invalid Dealership Id');
        }
        return this.addRoleAndDealership(dto.dealership, dto.role, dto.user);
    }

    public async getUserForDealership(dealerGroup: string, id: string) {
        const user = await getRepository(UsersEntity).findOne({
            where: {
                dealerGroup: dealerGroup,
                id: id,
            },
            relations: ['dealerGroup', 'dealership', 'userRoles', 'profile', 'department'],
        });
        return user;
    }

    async uploadImage(user: TokenDTO, id: string, file: any) {
        const data = await this.s3.uploadSingle(file, 'user-images');
        const userRepo = getRepository(UsersEntity);
        const userData = await userRepo.findOne({
            where: { id },
            relations: ['profile'],
        });
        if (!userData) {
            throw new BadRequestException('Invalid User Id');
        }

        const profie = userData.profile as EmployeeEntity;
        const promises = [];
        if (profie && profie.id) {
            promises.push(
                this.employeeRepo.update(
                    { id: profie.id },
                    { imageUrl: data.Location, imageKey: data.Key },
                ),
            );
            promises.push(userRepo.update({ id }, { updatedBy: user.id }));
        }
        if (profie && profie.imageKey) {
            promises.push(this.s3.deleteFile(profie.imageKey));
        }
        promises.push(this.setupLead(
            this.copyStaffForLeadSettings({} as any, null, null, id, null, { imageUrl: data.Location }), "put")
        )
        return Promise.all(promises);
    }

    public async getStaffBySkillSet(parameter) {
        const skillSets = await getRepository(SkillSetEntity).find({
            where: {
                leadTypes: In([parameter]),
            },
            select: ['leadTypes', 'id'],
        });
        const usersWithSkillSet = await skillSets.map(async (row) => {
            const user = await getRepository(UsersEntity).findOne({
                where: {
                    skillSet: row.id,
                },
            });
            return { ...row, ...user };
        });
        return await Promise.all(usersWithSkillSet);
    }

    public async getStaffById(id) {
        const staffs = await getRepository(UsersEntity).findOne({
            where: {
                id,
            },
            relations: ['skillSet'],
        });
        return staffs;
    }

    public async getStaff(Param) {
        if (Param.whereclause === 'SkillSet') {
            return this.getStaffBySkillSet(Param.id);
        } else if (Param.whereclause === 'byId') {
            return this.getStaffById(Param.id);
        }
    }

    public async getDealershipHq() {
        const dealerShipHq = await getRepository(DealershipEntity).findOne({
            where: { isHQ: true, status: 'ACTIVE' },
        });
        return dealerShipHq;
    }
    async getStaffLeads(staffId) {
        const http = new HttpHelper(MICROSERVICES.LEAD.HOST);
        const data: any = await http.get(`api/internal/getStaffLeadData/${staffId}`);
        return data;
    }
    async updateUserDealership(userData) {
        const http = new HttpHelper(MICROSERVICES.LEAD.HOST);
        const data: any = await http.put(`api/internal/updateStaffDealership`, userData);
        return data;
    }
    async updateCommunicationSettings(userData) {
        const http = new HttpHelper(MICROSERVICES.MESSAGING.HOST);
        const data: any = await http.put(`internal/updateDealership`, userData);
        return data;
    }
    async userStatusUpdate(currentUser: TokenDTO, userId: string, userDTO: any) {
        const user = await this.getUserDetails(userId);

        if (!user) throw new BadRequestException('Invalid user id');

        if (!user.active && !userDTO.active) throw new BadRequestException('user is not active');

        const userRoles = user.userRoles;
        const roleId = userRoles.map(e => (e?.role as RoleEntity)?.id)

        const canReceiveLeads = (userRoles[0]?.role as RoleEntity)?.canReceiveLeads;

        const userEntity = new UsersEntity();
        userEntity.id = userId;

        if (typeof userDTO.active == 'boolean') userEntity.active = userDTO.active;

        let leadData;
        if (canReceiveLeads && typeof userDTO.active == 'boolean' && userDTO.active === false)
            leadData = await this.getStaffLeads(userId);

        if (!leadData || !leadData.message.length) {
            const queryRunner = getConnection().createQueryRunner();
            try {
                await queryRunner.connect();
                await queryRunner.startTransaction();
                await queryRunner.manager.getRepository(UsersEntity).save(userEntity);
                await this.setupLead(
                    this.copyStaffForLeadSettings(userDTO as any, '', '', userId, canReceiveLeads),
                    "put"
                );
                await queryRunner.commitTransaction();
            }
            catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
            } finally {
                await queryRunner.release();
            }
        }

        if (leadData && leadData.message)
            return leadData.message;

        return [];
    }

    public async getUserDetails(userId: string) {
        return getRepository(UsersEntity)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'profile')
            .leftJoinAndSelect('user.dealerGroup', 'dealerGroup')
            .leftJoinAndSelect('user.dealership', 'dealership')
            .leftJoinAndSelect('user.skillSet', 'skillSet')
            .leftJoinAndSelect('user.userRoles', 'userRoles')
            .leftJoinAndSelect('userRoles.role', 'role')
            .where('user.id = :id', { id: userId })
            .getOne();
    }

    public async userImpersonation(currentUser: TokenDTO, data: UserImpersonationDTO) {
        const userId = data.userId;
        const userData = await this.getUserDetails(userId)
        if (!userData)
            throw new BadRequestException('Invalid userId');

        const dealershipId = (userData.dealership as DealershipEntity).id;
        const dealerGroupId = (userData.dealerGroup as DealerGroupEntity).id;

        if (dealerGroupId.toString() !== data.dealergroupId || dealershipId !== data.dealershipId) {
            throw new BadRequestException('Invalid dealergroup or dealership');
        }
        const profile = userData.profile as EmployeeEntity;

        const roleIds = userData.userRoles.map(e => {
            const role = e.role as RoleEntity;
            return role.id as string
        });
        const tokenPayload = new TokenDTO();
        tokenPayload.id = userData.id;
        tokenPayload.name = `${profile.firstName} ${profile.lastName}`;
        tokenPayload.email = userData.username;
        tokenPayload.userLevel = userData.userLevel;
        tokenPayload.roles = roleIds;

        if (userData.userLevel == Level.DEALERGROUP) {
            tokenPayload.dealerGroup = dealerGroupId;
        }

        if (userData.userLevel == Level.DEALERSHIP) {
            tokenPayload.dealerGroup = (userData.dealerGroup as DealerGroupEntity).id;
            tokenPayload.dealership = dealershipId;
            tokenPayload.profile = profile.id;
        }
        const jwt = TokensHelper.generateEmployeeToken(
            { ...tokenPayload },
            {
                expiresIn: Number.parseInt(WEB_ACCESS_TOKEN_EXPIRY) * 60,
            },
        );
        const accessToken = CryproHelper.encrypt(jwt);
        return {
            accessToken,
            userData
        }
    }

    public async getSlug(userName: string) {
        let slug: string = '';
        const users = await this.employeeRepo
            .createQueryBuilder('employee')
            .select('employee.id', 'id')
            .where('employee.first_name = :firstName', {
                firstName: userName,
            }).getRawMany();

        slug = userName + "-" + (users.length + 1);

        return slug;
    }
    public async changeUserDealership(currentUser: TokenDTO, data: any) {
        const userId = data.userId;
        const userData = await this.getUserDetails(userId)
        if (!userData)
            throw new BadRequestException('Invalid userId');

        const dealershipId = (userData.dealership as DealershipEntity).id;
        const dealerGroupId = (userData.dealerGroup as DealerGroupEntity).id;
        const newDealership = await getRepository(DealershipEntity).findOne({
            where: {
                id: data.dealershipId,
            },
            relations: ['dealerGroup']
        });

        if (!newDealership)
            throw new BadRequestException('Invalid dealership');

        const dgId = (newDealership.dealerGroup as DealerGroupEntity).id;

        if (dealerGroupId.toString() !== dgId.toString()) {
            throw new BadRequestException('Invalid dealergroup');
        }
        const checkIfGm = await getRepository(RoleEntity).findOne({
            where: {
                id: data.roleId,
            }
        });
        if (!checkIfGm.isGM && !data.reportsTo) throw new BadRequestException('ReportsTo is missing');
        const staffLeads = await this.getStaffLeads(userId)
        if (staffLeads.message.length) {
            return staffLeads
        } else {
            const reportedUsers = await getRepository(UsersEntity).find({
                where: {
                    reportsTo: userId,
                },
                relations: ['profile'],
                select: [
                    'id',
                    'userLevel',
                    'username',
                    'profile'
                ]
            });

            let users = getRepository(UsersEntity).createQueryBuilder('user');
            users.select('user.id', 'userId')
                .addSelect('user.active', 'active')
                .addSelect('user.userLevel', 'userLevel')
                .addSelect('user.createdAt', 'createdAt')
                .addSelect('profile.firstName', 'firstName')
                .addSelect('profile.lastName', 'lastName')
                .addSelect('profile.email', 'email')
                .leftJoin('user.dealerGroup', 'dealerGroup')
                .leftJoin('user.dealership', 'dealership')
                .leftJoin('user.profile', 'profile')
                .leftJoin('user.userRoles', 'userRole')
                .leftJoin('userRole.role', 'role')

            users.distinct(true)

            users.andWhere('user.active = :active', { active: true });
            // users.andWhere('user.id NOT IN :id', { id: reportedUsers.map(e=>e.id) });
            users.andWhere("user.id NOT IN(:...ids)", { ids: [...reportedUsers.map(e => e.id), userId] })
            users.andWhere('user.dealerGroup = :dealerGroup', {
                dealerGroup: dealerGroupId,
            });
            users.andWhere('user.dealership = :dealership', {
                dealership: dealershipId,
            });

            const otherUsers = await users.execute();

            if (reportedUsers.length) {
                return { userData: reportedUsers, dealershipId: dealershipId, reports: otherUsers, firstName: (userData.profile as EmployeeEntity).firstName, lastName: (userData.profile as EmployeeEntity).lastName };
            }
            const queryRunner = getConnection().createQueryRunner();
            try {
                userData.dealership = data.dealershipId;
                userData.reportsTo = data.reportsTo;
                await queryRunner.connect();
                await queryRunner.startTransaction();
                const domainUrl = newDealership.domainUrl;
                const profile = (userData.profile as EmployeeEntity);
                const commEmail = profile.communicationEmail;
                const userEmail = commEmail ? `${commEmail.split("@")[0]}@${domainUrl}` : '';
                profile.communicationEmail = userEmail;
                userData.profile = profile;

                await this.updateUserDealership({ staffId: userId, newDealershipId: data.dealershipId, changedEmail: userEmail });

                if (userEmail)
                    await this.updateCommunicationSettings({ userId: userId, dealershipId: data.dealershipId, changedEmail: userEmail }) // call to messaging service
                await queryRunner.manager.getRepository(UsersEntity).save(userData);
                await queryRunner.manager.getRepository(UserRoleEntity)
                    .createQueryBuilder()
                    .insert()
                    .values({
                        dealership: data.dealershipId,
                        role: data.roleId,
                        user: userId,
                    })
                    .onConflict('ON CONSTRAINT uk_userroles DO NOTHING')
                    .execute();

                await queryRunner.manager.getRepository(UserRoleEntity).delete({ user: userId, dealership: dealershipId });
                await queryRunner.commitTransaction();
            }
            catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
            } finally {
                await queryRunner.release();
            }
        }
        return "Successfully Updated."
    }
    public async changeReportToUsers(currentUser: TokenDTO, data: any) {
        const queryRunner = getConnection().createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            for (let user of data.userData) {
                await queryRunner.manager.getRepository(UsersEntity)
                    .createQueryBuilder()
                    .update()
                    .set({ reportsTo: user.reportsTo })
                    .where({ id: In(user.userIds) })
                    .execute();
            }
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
        return "Successfully Updated."
    }

    public async getProfile(tokenPayload: TokenDTO) {
        const qb = getRepository(UsersEntity).createQueryBuilder('user')
            .addSelect([
                'user.id', 'user.dealerGroup', 'dealerGroup.id', 'dealerGroup.name',
                'user.dealership', 'dealership.id', 'dealership.name',
                'user.department', 'department.id', 'department.name',
                'userRoles.id', 'userRoles.user', 'userRoles.role', 'role.id', 'role.name',
                'reportsTo.id', 'reportsTo.profile', 'reportsToProfile.id', 'reportsToProfile.firstName', 'reportsToProfile.lastName', 'reportsToProfile.email', 'reportsToProfile.preferredName'
            ])
            .leftJoin('user.dealerGroup', 'dealerGroup')
            .leftJoin('user.dealership', 'dealership')
            .leftJoin('user.department', 'department')
            .leftJoinAndSelect('user.skillSet', 'skillSet')
            .leftJoinAndSelect('user.profile', 'profile')
            .leftJoin('user.userRoles', 'userRoles')
            .leftJoin('userRoles.role', 'role')
            .leftJoin('user.reportsTo', 'reportsTo')
            .leftJoin('reportsTo.profile', 'reportsToProfile')

            .where('user.id = :userId', { userId: tokenPayload.id })
        if (tokenPayload.userLevel == Level.DEALERGROUP) {
            qb.andWhere('user.dealerGroup = :dealerGroup', { dealerGroup: tokenPayload.dealerGroup })
        }

        if (tokenPayload.userLevel == Level.DEALERSHIP) {
            qb.andWhere('user.dealership = :dealership', { dealership: tokenPayload.dealership })
        }
        const user = await qb.getOne() as any;

        if (!user) {
            throw new BadRequestException('Invalid User: User Not Found');
        }

        user.profile.publicAppointmentSlug = (user.profile.slug) ? user.profile.slug : '';

        user.roles = user.userRoles.map((el) => ({ user: tokenPayload.id, role: el.role && el.role.id ? el.role.id : null, dealership: el.dealership && el.dealership.id ? el.dealership.id : null }));

        return user;
    }

    public async updateProfile(currentUser: TokenDTO, profileDTO: UpdateProfileDTO) {

        const currentUserDetails = await this.getUserDetails(currentUser.id);
        const userId = currentUser.id;

        if (!currentUserDetails) throw new BadRequestException('Invalid user');

        if (!currentUserDetails.active) throw new BadRequestException('user is not active');

        const userEntity = new UsersEntity();
        const employee = new EmployeeEntity();

        userEntity.id = userId;
        userEntity.updatedBy = currentUser.id;

        if (currentUserDetails.profile) employee.id = (currentUserDetails.profile as EmployeeEntity).id;
        if (profileDTO.firstName) employee.firstName = profileDTO.firstName;
        if (profileDTO.lastName) employee.lastName = profileDTO.lastName;
        if (profileDTO.preferredName) employee.preferredName = profileDTO.preferredName;
        if (profileDTO.birthDate) employee.birthDate = profileDTO.birthDate;
        if (profileDTO.omvicLicense) employee.omvicLicense = profileDTO.omvicLicense;
        if (profileDTO.omvicLicenseExpiry) employee.omvicLicenseExpiry = profileDTO.omvicLicenseExpiry;
        if (profileDTO.phone) employee.phone = profileDTO.phone;
        if (profileDTO.phoneExtension) employee.phoneExtension = profileDTO.phoneExtension;
        if(profileDTO.themes) employee.themes = profileDTO.themes;
        if(profileDTO.leadDetailsView) employee.leadDetailsView = profileDTO.leadDetailsView;
        if(profileDTO.masterCalendarView) employee.masterCalendarView = profileDTO.masterCalendarView;
        if(profileDTO.noOfRecordsShow) employee.noOfRecordsShow = profileDTO.noOfRecordsShow;
        if(profileDTO.languagePreference) employee.languagePreference = profileDTO.languagePreference;
        if(profileDTO.defaultDashboardView) employee.defaultDashboardView = profileDTO.defaultDashboardView;
        if(profileDTO.defaultNewsletter) employee.defaultNewsletter = profileDTO.defaultNewsletter;
        if(profileDTO.defaultReleaseNotes) employee.defaultReleaseNotes = profileDTO.defaultReleaseNotes;
        if(profileDTO.assignedPhoneNumber) employee.assignedPhoneNumber = profileDTO.assignedPhoneNumber;
        if(profileDTO.gender) employee.gender = profileDTO.gender;
        if(profileDTO.communicationEmail) employee.communicationEmail = profileDTO.communicationEmail;

        userEntity.profile = employee;

        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const promises = [];

            await queryRunner.manager.getRepository(UsersEntity).save(userEntity);

            /** Update in leads */
            // await this.setupLead(
            //     this.copyStaffForLeadSettings({ ...profileDTO as any, userLevel: currentUserDetails.userLevel }, dealerGroup?.id, dealership?.id, userId, role.canReceiveLeads),
            //     "put"
            // )

            /** update in communications */
            // await InternalHelper.setupMessaging({
            //     id: userId,
            //     userRoles: rolesToAdd,
            //     profile: {
            //         assignedPhoneNumber: profileDTO.assignedPhoneNumber,
            //         phone: profileDTO.phone
            //     } as any
            // } as UsersEntity);

            // /** update in deals */
            // const http = new HttpHelper(MICROSERVICES.DEAL.HOST);
            // await http['put'](`api/internal/updateStat/${userId}`);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
        return profileDTO;
    }

    async updateProfileImage(user: TokenDTO, file: any) {
        const data = await this.s3.uploadSingle(file, 'user-images');
        const userRepo = getRepository(UsersEntity);
        const userData = await userRepo.findOne({
            where: { id:user.id },
            relations: ['profile'],
        });

        if (!userData) {
            throw new BadRequestException('Invalid User');
        }

        const profie = userData.profile as EmployeeEntity;
        const promises = [];
        if (profie && profie.id) {
            promises.push(
                this.employeeRepo.update(
                    { id: profie.id },
                    { imageUrl: data.Location, imageKey: data.Key },
                ),
            );
            promises.push(userRepo.update({ id:user.id }, { updatedBy: user.id }));
        }
        if (profie && profie.imageKey) {
            promises.push(this.s3.deleteFile(profie.imageKey));
        }
        // promises.push(this.setupLead(
        //     this.copyStaffForLeadSettings({} as any, null, null, user.id, null, { imageUrl: data.Location }), "put")
        // )
        return Promise.all(promises);
    }

    public async userDmsMapping(dmsIds: any, userId: any) {
        const dmsFromDb : any = await this.dmsRepo.find({ where: { id: In(dmsIds) } })
           
        let dms = dmsIds.filter(dmsId => dmsFromDb.some(dms => dmsId == dms.id))
        if (dms?.length) {
            let userDms = await this.userDmsRepo.find({ where: { user: userId}})
            if (userDms?.length) await this.userDmsRepo.delete({ user: userId })
               
            let userDmsPromise = []    
            for (let i = 0; i < dms?.length; i++) {
                userDmsPromise.push(
                    this.userDmsRepo.save({ user: userId, dms: dms[i]})
                )
            }
                
            await Promise.all(userDmsPromise)
        }
    }

}

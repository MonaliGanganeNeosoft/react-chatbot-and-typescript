import { Injectable } from '@nestjs/common';
import { EmployeeEntity } from 'src/entities/employee';
import { getRepository, getManager, In } from 'typeorm';
import { DealerGroupService } from '../dealer-groups/dealer-group.service';
import { UserRoleEntity } from '../users/user-roles.entity';
import { UsersEntity } from '../users/users.entity';
import { DealershipEntity } from "../dealership/dealership.entity";
import { RoleEntity } from '../user-roles/roles.entity';
import { LeadManagerRole } from '@config';
import { Level } from '@401_digital/xrm-core';
import { DealerGroupEntity } from '../dealer-groups/dealers-group.entity';

@Injectable()
export class InternalService {
    constructor(private dealerGroupService: DealerGroupService) { }
    async getSalesPerson(payload: any) {
        if (payload.fetchByPBSId) {
            const employeesList = payload.uniqueIds;
            const promises = employeesList.map((record: any) => {
                return getManager().
                    createQueryBuilder(EmployeeEntity, 'employees')
                    .select("employees.email", "email")
                    .addSelect("employees.pbs_employee_id", "pbsEmployeeId")
                    .addSelect("employees.first_name", "firstName")
                    .addSelect("employees.last_name", "lastName")
                    .leftJoin(UsersEntity, "users", "employees.email = users.username ")
                    .leftJoin(DealershipEntity, "dealerships", "dealerships.id = users.dealership")
                    .addSelect("users.id", "salesPersonId")
                    .addSelect("users.dealership", "dealershipId")
                    .addSelect("users.username", "username")
                    .addSelect("dealerships.name", "dealershipName")
                    .leftJoin(DealerGroupEntity, "dealergroups", "dealergroups.id = users.dealer_group")
                    .addSelect("users.dealer_group", "dealerGroupId")
                    .addSelect("dealergroups.name", "dealerGroupName")
                    .where(`employees.pbs_employee_id = '${record}'`)
                    .getRawOne();
            });
            const result = await Promise.all(promises)
            return result;
        } else {
            console.log('payload.userNames : ', payload.userNames);
            const entityManager = getManager();
            const output = await entityManager.query(`
                select 
                u.username as username,
                u.profile,
                e.email as email,
                e.first_name as firstName,
                e.last_name as lastName,
                u.id as salespersonid,
                e.pbs_employee_id,
                u.dealership as dealership,
                d.name as dealershipname,                
                dg.name as dealergroup,
                dg.id as dealergroup_id                
                from 
                users u inner join employees e on u.username = e.email 
                        left join dealerships d on d.id = u.dealership
                        left join dealergroups dg on dg.id = u.dealer_group
                where 
                u.active = true AND
                u.profile = e.id AND 
                u.username = ANY ($1);
            `, [payload.userNames]);
            return output;
        }

    }


    async getPhoneNumber(userId: string) {
        const userRepo = getRepository(UsersEntity);
        const userData = await userRepo.findOne({
            where: { id: userId },
            relations: ['profile'],
        });
        return (userData.profile as EmployeeEntity).assignedPhoneNumber;
    }

    async getDealerGroupDetails(dealerGroupId: string) {
        const dealerGroup = await this.dealerGroupService.getDealerGroupDetails(
            dealerGroupId,
        );
        return dealerGroup;
    }

    async getUserRoles(userId: string) {
        const userRoleEntity = getRepository(UserRoleEntity);
        return userRoleEntity.find({
            where: {
                user: userId,
            },
            relations: ['dealership'],
        });
    }

    async usersByDealership(employeeId) {
        const entityManager = getManager();
        const output = await entityManager.query(`
        SELECT 
        d.id as dealership_id, 
        d.name as dealership_name, 
        dg.id as dealergroup_id, 
        dg.name as dealergroup_name, 
        e.pbs_employee_id, 
        e.id as employee_id, 
        e.first_name as employee_first_name, 
        e.last_name as employee_last_name,
        e.email as employee_email 
        FROM dealerships d 
        LEFT JOIN dealergroups dg ON dg.id = d.dealer_group_id  
        LEFT JOIN users u ON u.dealership = d.id  
        RIGHT JOIN employees e ON e.id = u.profile WHERE ( e.id = $1 OR e.pbs_employee_id = $2 ) AND ( d.deleted_at IS NULL );
        `, [employeeId, employeeId]);
        // console.log('output :', output);
        return output[0];
    }

    async getemployeeByDearship(payload) {
        const dealershipEntity = getRepository(DealershipEntity);
        const matchFilter = {};
        // if (payload.dealershipname && payload.dealershipname != '') {
        //     matchFilter['name'] = payload.dealershipname
        // }
        if (payload.dealershipid && payload.dealershipid != '') {
            matchFilter['id'] = payload.dealershipid
        }
        // console.log('match filter : ', matchFilter);
        const dealership = await dealershipEntity.findOne(matchFilter);
        if (dealership) {
            const userRepo = getRepository(UsersEntity);
            const EmpRepo = getRepository(EmployeeEntity);
            const userData = await userRepo.find({
                where: { dealership: dealership.id },
                relations: ['profile'],
            });
            const usersEmail: any = userData.map((ele: any) => ele.username);
            console.log('users :', usersEmail);
            const EmployeesData = await EmpRepo.find({
                where: { email: In(usersEmail), source: 'PBS' },
            });
            return EmployeesData.map(ele => { return { pbsEmployeeId: ele.pbsEmployeeId } })
        } else {
            return []
        }
    }

    async dealershipsByDealergroups(payload) {
        const dealershipEntity = getRepository(DealershipEntity);
        const dealerships = dealershipEntity.find({ where: { ...payload, status: 'ACTIVE' }, select: ['name'] });
        return dealerships;
    }

    async usersList(payload) {
        let whereClause = 'users.active = true'
        if (payload && payload.dealershipid) {
            whereClause += ` and dealership=  '${payload.dealershipid}'`
        }
        if (payload && payload.staffid) {
            whereClause += ` and users.id=  '${payload.staffid}'`
        }
        if (payload && payload.dealergroup) {
            whereClause += ` and users.dealer_group=  '${payload.dealergroup}'`
        }
        const result = await getManager()
            .createQueryBuilder(EmployeeEntity, 'employees')
            .select('employees.first_name', 'firstName')
            .addSelect('employees.last_name', 'lastName')
            .addSelect('employees.daily_limit', 'dailyLimit')
            .addSelect('employees.monthly_limit', 'monthlyLimit')
            .innerJoin(UsersEntity, 'users', 'users.profile = employees.id')
            .innerJoin(DealershipEntity, 'dealerships', 'dealerships.id = users.dealership')
            .addSelect("dealerships.name", "dealershipName")
            .addSelect("dealerships.id", "dealershipId")
            .addSelect("users.dealer_group", 'dealergroupId')
            .addSelect("users.active", "isActive")
            .addSelect('users.id', 'staffId')
            .where(whereClause)
            .getRawMany()
        return result;
    }

    async getLeadManager() {
        const roleRepo = getRepository(RoleEntity);
        const role = await roleRepo.findOne({ isDefault: true, name: LeadManagerRole.name, level: Level.ROOT });
        const userRoleQB = getRepository(UserRoleEntity).createQueryBuilder('userRole');
        const userRole = await userRoleQB.where("userRole.role = :roleId", { roleId: role.id }).innerJoin('userRole.user', 'user').getOne();
        return userRole.user;
    }

    async getLeadNotificationUsers(dealershipId) {
        const dealershipRepo = getRepository(DealershipEntity).createQueryBuilder('dealership');
        const dealership = await dealershipRepo
            .select('generalManager.id', 'gmId')
            .innerJoin('dealership.generalManager', 'generalManager')
            .where('dealership.id = :id', { id: dealershipId })
            .getRawOne();

        const response = {
            leadManager: this.getLeadManager(),
            generalManager: dealership.gmId
        }

        return response;
    }

    async getUserDetails(userId) {
        let whereClause = 'users.active = true';
        if (userId) {
            whereClause += ` and users.id=  '${userId}'`
        }

        const result = await getManager()
            .createQueryBuilder(EmployeeEntity, 'employees')
            .select('employees.first_name', 'firstName')
            .addSelect('employees.last_name', 'lastName')
            .addSelect('employees.daily_limit', 'dailyLimit')
            .addSelect('employees.monthly_limit', 'monthlyLimit')
            .addSelect('employees.image_url', 'imageUrl')
            .innerJoin(UsersEntity, 'users', 'users.profile = employees.id')
            .innerJoin(DealershipEntity, 'dealerships', 'dealerships.id = users.dealership')
            .addSelect("dealerships.name", "dealershipName")
            .addSelect("dealerships.id", "dealershipId")
            .addSelect("dealerships.logo", "dealershipLogo")
            .addSelect("users.dealer_group", 'dealergroupId')
            .addSelect("users.active", "isActive")
            .addSelect('users.id', 'staffId')
            .where(whereClause)
            .getRawMany()
        return result;
    }

    async getUsersAsPerDealership(payload) {
        const dealerships = payload.dealerships
        const entityManager = getManager();
        const output = await entityManager.query(`
        SELECT 
        d.id as dealership_id, 
        d.name as dealership_name, 
        dg.id as dealergroup_id, 
        dg.name as dealergroup_name, 
        e.pbs_employee_id, 
        e.id as employee_id, 
        e.first_name as employee_first_name, 
        e.last_name as employee_last_name,
        e.email as employee_email,
        u.id as user_id
        FROM dealerships d 
        LEFT JOIN dealergroups dg ON dg.id = d.dealer_group_id  
        LEFT JOIN users u ON u.dealership = d.id  
        RIGHT JOIN employees e ON e.id = u.profile 
        INNER JOIN user_roles ur on u.id = ur."userId"
		INNER JOIN roles r on r.id = ur."roleId" 		
		WHERE 
		  u.active= true AND 
		  r.name in ('Sales Agent', 'SalesManager') AND 
		  d.id = ANY ($1) AND 
		  ( d.deleted_at IS NULL ) 
		  order  by username asc;
        `, [dealerships]);
        return output;
    }

    async getUserProfiles(reporter) {
        const entityManager = getManager();
        const dataSet = await entityManager.query(`
        select 
        users.id as userId,
        employees.first_name as firstName,
        employees.last_name as lastName,
        employees.image_url as imageUrl,
        roles.name as role
        from users 
        inner join employees on users.username = employees.email
        inner join user_roles on user_roles."userId" = users.id
        inner join roles on user_roles."roleId" = roles.id
        where users.id = ANY ($1)
        `, [reporter])
        return dataSet;
    }

    async getReporters(id) {
        const userRepo = getRepository(UsersEntity);
        const userData = await userRepo.find({
            where: { reportsTo: id }            
        });
        return userData;
    }	
}



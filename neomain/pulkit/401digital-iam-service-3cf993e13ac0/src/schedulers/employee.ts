/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { getRepository, In, Repository } from 'typeorm';
import { EmployeeDTO } from 'src/dto';
import { DataSources, ServiceTypes } from 'src/constants';
import { PbsHelpers } from 'src/helpers/pbs-helper';
import { EmployeeEntity } from 'src/entities/employee';
import { BaseScheduler } from './base';
import { SerialNumbers } from '@401_digital/xrm-core';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/app/users/users.entity';
import { UserDmsEntity } from 'src/app/user-dms-mapping/userDms.entity';
import { DmsEntity } from 'src/app/dms/dms.entity';


@Injectable()
export class EmployeeScheduler extends BaseScheduler<EmployeeDTO, EmployeeEntity> {
    private readonly logger = new Logger(EmployeeScheduler.name);
    constructor(
        private pbsHelper: PbsHelpers,
        @InjectRepository(UsersEntity)
        private readonly userRepo: Repository<UsersEntity>,
        @InjectRepository(UserDmsEntity)
        private readonly userDmsRepo: Repository<UserDmsEntity>,
        @InjectRepository(DmsEntity)
        private readonly dmsRepo: Repository<DmsEntity>,
        ) {
        super()
    }

    @Cron('0 * * * *', { name: 'employees' })
    handleCron() {
        if (process.env.ENV == 'UAT') {
            this.schedulerLogger.startTime = new Date();
            this.schedulerLogger.serviceType = ServiceTypes.EmployeeGet;
            this.pbsHelper.getRecordsFromPBS({ instances: [SerialNumbers.Cambridge, SerialNumbers.CambridgeKia, SerialNumbers.BarrieKia, SerialNumbers.SimcoeVolkswagen, SerialNumbers.LindsayKia, SerialNumbers.TillSonburgKia, SerialNumbers.SudburyMitsubishi, SerialNumbers.WindsorHyundai, SerialNumbers.KingstonKia], resultKey: "Employees", serviceType: ServiceTypes.EmployeeGet, pbsApi: '/json/reply/EmployeeGet' }).then((data) => {
                this.schedulerLogger.pbsReadTime = new Date();
                this.dbPerformer(data.records, data.commands);
            })
        }
    }

    async dbPerformer(Items: any[], commands?: any[]) {
        try {
            this.logger.log(`Total record length ${Items.length}`);
            if (Items && Items.length) {
                const chunkSize = 200;
                let chunk = chunkSize, index = 0;
                while (index <= Items.length) {
                    const chunkList = Items.slice(index, chunk) as EmployeeDTO[];
                    if (chunkList.length) {
                        this.logger.log(`Processing Chunk From : ${index} To : ${chunk}`);
                        const employee = chunkList
                            .sort((a, b) => {
                                if (new Date(a.LastUpdate) > new Date(b.LastUpdate)) {
                                    return -1
                                }
                                return 1;
                            })
                            .filter((p, index) => chunkList.findIndex(q => q.EmployeeId == p.EmployeeId) == index)
                            .map((pbsEmployee) => this.toEntity(pbsEmployee));
                        this.logger.log(`Valid Records ${employee.length}`)
                        if (employee && employee.length) {
                            const employeeRepo = getRepository(EmployeeEntity);
                            const dontUpdate = ['id', 'created_at', 'pbs_employee_id'];
                            const keys = employeeRepo.metadata.ownColumns.map(column => column.databaseName).filter(key => !dontUpdate.includes(key));
                            const updateStr = keys.map(key => `"${key}" = EXCLUDED."${key}"`).join(",");
                            const emails = employee.map(emp => emp.email)
                            
                            let users : any = await this.userRepo.find({ where: { username: In(emails)}})
                            if (users.length) {
                                const arr = []
                                for (let i = 0; i < users.length; i++) {
                                    const userDms = await this.userDmsRepo.findOne({ where: { user: users[i].id }})
                                    if (!userDms) {
                                        let employees = employee.find(emp => emp.email == users[i].username)
                                      
                                        const dms = await this.dmsRepo.findOne({ where: { dmsNumber: `PBS_${employees.pbsId.split('/')[0]}`}})
                                        if (users[i]?.id && dms?.id) arr.push({ user: users[i].id, dms: dms.id})
                                    }
                                }
                                if (arr?.length) {
                                    await this.userDmsRepo
                                    .createQueryBuilder()
                                    .insert()
                                    .values(arr)
                                    .execute();
                                }
                            }
                            
                            await employeeRepo
                                .createQueryBuilder()
                                .insert()
                                .values(employee)
                                .onConflict(`("pbs_employee_id") DO NOTHING`)
                                // .onConflict(`("pbs_employee_id") DO UPDATE SET ${updateStr} WHERE employees.last_pbs_update < EXCLUDED.last_pbs_update`)
                                .execute();
                        }
                        index = chunk;
                        chunk = chunk + chunkSize;
                    }
                }
            }
            this.logger.log("Cron Job Complete")
            this.schedulerLogger.endTime = new Date();
            await Promise.all([this.updateCycles(commands), this.createLog(this.schedulerLogger)]);

        } catch (error) {
            this.logger.error(error);
            this.schedulerLogger.endTime = new Date();
            this.schedulerLogger.success = false;
            this.schedulerLogger.error = error.message;
            await this.createLog(this.schedulerLogger);
        }

    }

    toEntity(pbsEmployee: EmployeeDTO) {
        const employee = new EmployeeEntity();
        employee.pbsId = pbsEmployee.Id;
        // employee.serialNumber = pbsEmployee.SerialNumber;
        employee.pbsEmployeeId = pbsEmployee.EmployeeId;
        employee.pbsUserName = pbsEmployee.UserName;
        employee.firstName = pbsEmployee.FirstName;
        employee.lastName = pbsEmployee.LastName;
        employee.email = pbsEmployee.EmailAddress;
        employee.isInactive = pbsEmployee.IsInactive;
        employee.isSales = pbsEmployee.Sales;
        employee.salesmanNumber = pbsEmployee.SalesmanNumber;
        employee.pbsSalesRole = pbsEmployee.SalesRole;
        employee.isFixedOps = pbsEmployee.FixedOps;
        employee.fixedOpsEmployeeNumber = pbsEmployee.FixedOpsEmployeeNumber;
        employee.fixedOpsRole = pbsEmployee.FixedOpsRole;
        employee.isTechnician = pbsEmployee.Technician;
        employee.technicianNumber = pbsEmployee.TechnicianNumber;
        employee.manufacturerID = pbsEmployee.ManufacturerID;
        employee.defaultShop = pbsEmployee.DefaultShop;
        employee.phone = pbsEmployee.Phone;
        employee.phoneExtension = pbsEmployee.PhoneExtension;
        employee.callTrakPin = pbsEmployee.CallTrakPin;
        employee.isConnectEnabled = pbsEmployee.IsConnectEnabled;
        employee.isDocSigningEnabled = pbsEmployee.IsDocSigningEnabled;
        employee.isShuttleDriver = pbsEmployee.IsShuttleDriver;
        employee.isMobileServiceArrival = pbsEmployee.IsMobileServiceArrival;
        employee.mobileServiceArrivalAccess = pbsEmployee.MobileServiceArrivalAccess;
        employee.pbsLastUpdate = pbsEmployee.LastUpdate;
        employee.source = DataSources.PBS;
        return employee;
    }
}

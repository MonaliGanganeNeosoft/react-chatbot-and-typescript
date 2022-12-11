import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerCycleEntity } from 'src/entities/scheduler-cycle';
import { Connection } from 'typeorm';
import { DefaultSchedulerCycles } from '../constants';
import { DealershipCleaner } from './dealershipCleaner';
import { BambooScheduler } from "./bamboo";
import { BambooHelpers } from "../helpers/bamboo";
import { UsersEntity } from '../app/users/users.entity';
import { UserDmsEntity } from '../app/user-dms-mapping/userDms.entity';
import { EmployeeEntity } from '../entities/employee';
import { DmsEntity } from '../app/dms/dms.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeScheduler } from './employee';
import { PbsHelpers } from 'src/helpers/pbs-helper';


@Module({
    imports: [ScheduleModule.forRoot(), ConfigModule, TypeOrmModule.forFeature([UsersEntity, UserDmsEntity, EmployeeEntity, DmsEntity])],
    providers: [DealershipCleaner, BambooScheduler, BambooHelpers, UsersEntity, UserDmsEntity, EmployeeEntity, DmsEntity, EmployeeScheduler, PbsHelpers],
})
export class SchedulerModule implements OnModuleInit {
    constructor(private connection: Connection) { }

    onModuleInit() {
        this.setDetaulfSchedulerData();
    }

    private async setDetaulfSchedulerData() {
        await this.connection
            .getRepository(SchedulerCycleEntity)
            .createQueryBuilder()
            .insert()
            .into(SchedulerCycleEntity)
            .values(DefaultSchedulerCycles)
            .onConflict(`ON CONSTRAINT sc_uk DO NOTHING`)
            .execute();
    }
}

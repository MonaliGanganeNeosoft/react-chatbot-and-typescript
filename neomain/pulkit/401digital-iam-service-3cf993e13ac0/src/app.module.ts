import {
    Logger,
    Module,
    OnApplicationShutdown,
    OnApplicationBootstrap,
    HttpModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreDatabaseHelper } from './helpers/database';
import { SchedulerModule } from './schedulers/module';
import { PublicController } from './app/public/public.controller';
import { DealerGroupsModule } from './app/dealer-groups/dealer-groups.module';
import { DealershipModule } from './app/dealership/dealership.module';
import { DepartmentsModule } from './app/departments/departments.module';
import { RoleModule } from './app/user-roles/roles.module';
import { UsersModule } from './app/users/users.module';
import { PublicModule } from './app/public/public.module';
import { AuthModule } from './app/auth/auth.module';
import { AwsService } from './configs';
import { PublicService } from './app/public/public.service';
import { SubscriptionController } from './app/subscription/subscription.controller';
import { SubscriptionService } from './app/subscription/subscription.service';
import { GoogleController } from './app/google/google.controller';
import { GoogleService } from './app/google/google.service';
import { DashboardModule } from './app/dashboard/dashboard.module';
import { CoreModule } from './core/core.module';
import { LienholderModule } from './app/lienholder/lienholder.module';
import { WarrantyPlanModule } from './app/warranty/warrantyPlanOptions.module';
import { ContractModule } from './app/contract/contract.module';
import { RvacModule } from './app/rvac/rvac.module';
import { MessagingModule } from './app/messaging/messaging.module';
import { CallModule } from './app/Phone/phone.module';
import { MailHelper } from './helpers/mail';
import { InternalModule } from './app/internal/internal.module';
import connectionOptions from './ormconfig';
import { CustomerModule } from './app/customer/customer.modules';
import { Seeder } from './helpers/seeder';
import { AppVersionModule } from './app/app-version-management/app-version.module';
import { DmsModule } from './app/dms/dms.modules';
import { DealershipDmsModule } from './app/dealership-dms-mapping/dealership-dms.module'
import { UserDmsModule } from './app/user-dms-mapping/userDms.modules';
@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(connectionOptions),
        HttpModule,
        SchedulerModule,
        DealerGroupsModule,
        DealershipModule,
        DepartmentsModule,
        RoleModule,
        UsersModule,
        PublicModule,
        AuthModule,
        DashboardModule,
        CoreModule,
        LienholderModule,
        InternalModule,
        WarrantyPlanModule,
        ContractModule,
        RvacModule,
        MessagingModule,
        CallModule,
        CustomerModule,
        AppVersionModule,
        DmsModule,
        DealershipDmsModule,
        UserDmsModule
    ],
    controllers: [
        AppController,
        PublicController,
        SubscriptionController,
        GoogleController,
    ],
    providers: [
        AppService,
        CoreDatabaseHelper,
        AwsService,
        PublicService,
        SubscriptionService,
        GoogleService,
        MailHelper,
    ],
})
export class AppModule
    implements OnApplicationShutdown, OnApplicationBootstrap {
    private logger = new Logger(AppModule.name);
    constructor(
        private connection: Connection,
        private scheduler: SchedulerRegistry,
        private appService: AppService
    ) {
        this.logger.log('App Module Initiated');
    }

    onApplicationShutdown(signal?: string) {
        this.logger.log(`closing connection signal ${signal}`);
        if (this.connection.isConnected) {
            this.connection.close();
        }
        this.scheduler.getCronJobs().forEach((job) => {
            if (job) job.stop();
        });
    }

    async onApplicationBootstrap() {
        try {
            await this.appService.init();
        } catch (error) {
            this.logger.error(error);
        }
    }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsService } from 'src/configs';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { DealershipImageEntity } from './dealership-image.entity';
import { DealershipLeadSettingsEntity } from './dealership-leadsettings.entity';
import { DealershipOpeningEntity } from './dealership-openinghours.entity';
import { DealershipController } from './dealership.controller';
import { DealershipEntity } from './dealership.entity';
import { DealershipService } from './dealership.service';
import { DmsEntity } from '../dms/dms.entity';
import { DealershipDmsEntity } from '../dealership-dms-mapping/dealership-dms.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DealershipEntity,
            DealershipImageEntity,
            DealershipOpeningEntity,
            DealershipLeadSettingsEntity,
            DmsEntity,
            DealershipDmsEntity            
        ]),
        UsersModule,
    ],
    exports: [TypeOrmModule, DealershipService, AwsService],
    controllers: [DealershipController],
    providers: [DealershipService, AwsService, UsersService],
})
export class DealershipModule { }

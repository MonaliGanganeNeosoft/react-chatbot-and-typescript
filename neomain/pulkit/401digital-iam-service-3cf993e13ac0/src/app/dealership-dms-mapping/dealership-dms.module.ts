import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealershipDmsEntity } from './dealership-dms.entity';
import { DealershipDmsController } from './dealership-dms.controller';
import { DealershipDmsService } from './dealership-dms.service';
import { DealershipEntity } from '../dealership/dealership.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DealershipDmsEntity,
            DealershipEntity         
        ])
    ],
    exports: [TypeOrmModule, DealershipDmsService],
    controllers: [DealershipDmsController],
    providers: [DealershipDmsService],
})
export class DealershipDmsModule { }
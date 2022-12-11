import { WarrantyPlanController } from './warrantyPlanOptions.controller';
import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsService } from '../../configs/aws';
import { WarrantyPlansService } from './warrantyPlanOptions.service'
import { WarrantyPlanOptionEntity } from './warrantyPlanOptions.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([WarrantyPlanOptionEntity]),
        HttpModule
    ],
    controllers: [
        WarrantyPlanController],
    providers: [
        AwsService,
        WarrantyPlansService],
})
export class WarrantyPlanModule { }

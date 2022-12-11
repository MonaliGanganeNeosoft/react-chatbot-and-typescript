import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractEntity } from './contract.entity';
import { DealershipEntity } from '../dealership/dealership.entity';
import { ServiceEntity } from './service.entity';
import { WarrantyServiceEntity } from '../warranty/warrantyServicies.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ContractEntity, DealershipEntity, ServiceEntity, WarrantyServiceEntity]),
        HttpModule,
    ],
    controllers: [
        ContractController,],
    providers: [
        ContractService,],
})
export class ContractModule { }

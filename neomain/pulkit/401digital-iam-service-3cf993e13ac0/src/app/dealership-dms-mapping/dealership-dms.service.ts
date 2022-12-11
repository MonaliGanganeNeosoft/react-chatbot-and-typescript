import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '@401_digital/xrm-core';
import { DealershipEntity } from '../dealership/dealership.entity';


@Injectable()
export class DealershipDmsService extends BaseService {
    constructor(
        @InjectRepository(DealershipEntity)
        private readonly dealershipRepo: Repository<DealershipEntity>,
    ) {
        super();
    }
    
    async getDealershipDms() {
        return this.dealershipRepo.createQueryBuilder("dship")
        .leftJoinAndSelect("dship.dealerhipDms", "dealership_dms_mapping")
        .leftJoinAndSelect("dealership_dms_mapping.dms", "dms")
        .getMany();       
    }

    async getDealershipDmsById(dealershipId: any) {
        return this.dealershipRepo.createQueryBuilder("dship")
        .leftJoinAndSelect("dship.dealerhipDms", "dealership_dms_mapping")
        .leftJoinAndSelect("dealership_dms_mapping.dms", "dms")
        .where("dship.id = :id", { id: dealershipId })
        .getOne();
    }
}    
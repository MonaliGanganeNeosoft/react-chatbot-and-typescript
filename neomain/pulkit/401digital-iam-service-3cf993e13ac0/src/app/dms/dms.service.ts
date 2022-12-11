import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DmsEntity } from './dms.entity';
import { BaseService } from '@401_digital/xrm-core';

@Injectable()
export class DmsService extends BaseService {
    constructor(
        @InjectRepository(DmsEntity)
        private readonly dmsRepo: Repository<DmsEntity>
    ) {
        super();
    }
    public async createDms(dms: any) {
       try {
            const user = this.dmsRepo.create(dms);
            await this.dmsRepo.save(dms);
            return user;
       } catch(error) {
            throw error
       }
    }

    async getDms() {
        return this.dmsRepo.find();
    }

    async getDmsById(id: any) {
        return this.dmsRepo.findOne({ where: { id: id } });
    }

    async updateDmsById(id: any, data: any) {
        try {
            return await this.dmsRepo.update(id, data);
        } catch(error) {
            throw error
        }
    }
}    
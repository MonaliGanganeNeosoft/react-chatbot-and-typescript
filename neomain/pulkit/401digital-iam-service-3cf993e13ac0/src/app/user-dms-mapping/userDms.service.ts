import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '@401_digital/xrm-core';
import { UsersEntity } from '../users/users.entity';

@Injectable()
export class UserDmsService extends BaseService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepo: Repository<UsersEntity>
    ) {
        super();
    }
    
    async getUserDms() {
        return this.usersRepo.createQueryBuilder("users")
        .leftJoinAndSelect("users.dms", "user_dms_mapping")
        .leftJoinAndSelect("user_dms_mapping.dms", "dms")
        .getMany();
    }

    async getUserDmsById(userId: any) {
        return this.usersRepo.createQueryBuilder("users")
        .leftJoinAndSelect("users.dms", "user_dms_mapping")
        .leftJoinAndSelect("user_dms_mapping.dms", "dms")
        .where("users.id = :id", { id: userId })
        .getOne();
    }
}    
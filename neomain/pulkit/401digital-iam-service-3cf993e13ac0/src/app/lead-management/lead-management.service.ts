import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { DealershipEntity } from "../dealership/dealership.entity";
import { SkillSetEntity } from "../users/users-skillset.entity";
import { UsersEntity } from "../users/users.entity";

export class LeadmanagementService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly userRepo: Repository<UsersEntity>,
    ) {

    }

    async getActiveStaff(dealership) {
        const userData = await this.userRepo.find({
            where: { dealership: dealership, userLevel: 'DEALERSHIP', active: true },
            relations: ['dealership', 'skillSet'],
        })
        return userData
    }
}
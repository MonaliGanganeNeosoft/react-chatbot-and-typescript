import { BaseService } from '@401_digital/xrm-core';
import {
    Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/entities/employee';
import { UsersEntity } from 'src/app/users/users.entity';
import { Repository } from 'typeorm';


@Injectable()
export class CustomerService extends BaseService {
    constructor(
        @InjectRepository(EmployeeEntity)
        private readonly employeeRepo: Repository<EmployeeEntity>,
        @InjectRepository(UsersEntity)
        private readonly userRepo: Repository<UsersEntity>
    ) {
        super();
    }
    public async getSalesPerson(pbsEmployeeId: string, salesAgentId: string) {
        let whereQuery = {}
        if (pbsEmployeeId) {
            whereQuery = {
                pbsEmployeeId
            }
        } else {
            const user = (await this.userRepo
                .createQueryBuilder('user')
                .select('user.profile', 'profile')
                .where('user.id = :id', { id: salesAgentId })
                .getRawOne()) as { profile: string; };

            whereQuery = {
                id: user.profile
            }
        }
        const userData = await this.employeeRepo.findOne({
            where: whereQuery
        });

        return userData;
    }

}

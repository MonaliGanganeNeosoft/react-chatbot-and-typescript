import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from '../../configs/aws';
import { goodResponse, warrantyResponse } from '../../helpers/response.helper';
import { RvacDTO } from './rvac.dto';
import { Repository } from 'typeorm';
import { RvacEntity } from './rvac.entity';
import { rvac } from '../../constants/rvacOptions'
import moment from 'moment';


@Injectable()
export class RvacService {
    constructor(
        @InjectRepository(RvacEntity)
        private readonly rvacOptionRepository: Repository<RvacEntity>
    ) { }



    public async eligbleForRvacCondition(options: RvacDTO) {

        let attr: any = {}
        let msg: string = 'You are not eligble for any rvac condition.'
        let nested_data: any;
        let current_year = moment().year();
        let year_diff = current_year - options.year
        let data = rvac.filter(item => item.type == options.type)
        if (data.length) {
            nested_data = data[0].deductable_cost.filter(item => item.years == year_diff && item.deductable_type == options.deductable_type)
            if (nested_data.length) {
                attr.rvac_type = data[0].type
                attr.years = nested_data[0].years
                attr.deductable_cost = nested_data[0].cost
                attr.max_sp = nested_data[0].max_sp
                attr.premium_condition = nested_data[0].premium_condition
                msg = 'You are eligble for rvac condition.'
            }
        }

        return warrantyResponse(attr, msg)
    }

}

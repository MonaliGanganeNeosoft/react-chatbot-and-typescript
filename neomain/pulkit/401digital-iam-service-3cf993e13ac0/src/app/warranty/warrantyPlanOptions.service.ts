import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from '../../configs/aws';
import { goodResponse, warrantyResponse } from '../../helpers/response.helper';
import {
  WarrantyPlanOptionsDTO,
  WarrantyPlanConditionDTO,
} from './warrantyPlanOptions.dto';
import { Repository } from 'typeorm';
import { WarrantyPlanOptionEntity } from './warrantyPlanOptions.entity';
import { warrantyClass } from '../../constants/warrantyPlanOption';
import moment from 'moment';

@Injectable()
export class WarrantyPlansService {
  constructor(
    @InjectRepository(WarrantyPlanOptionEntity)
    private readonly warrantyPlanOptionRepository: Repository<WarrantyPlanOptionEntity>,
  ) {}

  public async eligbleForWarranty(options: WarrantyPlanOptionsDTO) {
    const attr: any = {
      class: 'No class',
      premium: 'No Warranty offers',
    };
    let msg = 'You are not eligible for warranty plan.';

    const data = warrantyClass.filter((item) =>
      item.makes.includes(options.make),
    );
    if (data.length !== 0) {
      attr.class = data[0].class;
      attr.premium = data[0].premium;
      msg =
        attr.class == 'Class 3'
          ? 'You are not eligible for warranty plan.'
          : 'You are eligible for warranty plan.';
    }

    return warrantyResponse(attr, msg);
  }

  public async eligbleForWarrantyCondition(options: WarrantyPlanConditionDTO) {
    const attr: any = {
      class: 'No Class',
      make: options.make,
      years: 'Not Offered',
      min_cp: 'Not Offered',
      max_sp: 'Not Offered',
      premium_condition: 'Not Offered',
    };
    let msg = 'You are not eligble for any premium condition.';
    let nested_data: any;
    const current_year = moment().year();
    const year_diff = current_year - options.year;

    const data = warrantyClass.filter((item) =>
      item.makes.includes(options.make),
    );
    if (data.length) {
      nested_data = data[0].logics.filter(
        (item) => item.years == year_diff && item.odometer == options.odometer,
      );
      if (nested_data.length) {
        attr.class = data[0].class;
        attr.make = options.make;
        attr.years = nested_data[0].years;
        attr.min_cp = nested_data[0].min_cp;
        attr.max_sp = nested_data[0].max_sp;
        attr.premium_condition = nested_data[0].premium_condition;
        msg = 'You are eligble for any premium condition.';
      }
    }

    return warrantyResponse(attr, msg);
  }
}

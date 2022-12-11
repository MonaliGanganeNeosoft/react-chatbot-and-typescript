import {
  BaseService,
  RequestQuery,
  SuccessResponse,
} from '@401_digital/xrm-core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginateRaw } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { LienholderEntity } from './lienholder.entity';
import { LienholderFilterDTO } from './lienholder.dto'
import { TokenDTO } from '../auth/auth.dto';

@Injectable()
export class LienholderService extends BaseService {
  constructor(
    @InjectRepository(LienholderEntity)
    private readonly lienholderRepository: Repository<LienholderEntity>,
  ) {
    super();
  }

  public async save(data: LienholderEntity) {
    const res = await this.lienholderRepository.save(data);

    return new SuccessResponse(res);
  }

  public async getLienholders(user: TokenDTO, query: RequestQuery<LienholderFilterDTO>) {
    const { filter, pagination, sort } = this.getQuery(query);
    const leinholderQB = this.lienholderRepository
      .createQueryBuilder('lienholders')
      .select('lienholders.id', 'id')
      .addSelect('lienholders.companyName', 'companyName')
      .addSelect('lienholders.addressLine1', 'addressLine1')
      .addSelect('lienholders.addressLine2', 'addressLine2')
      .addSelect('lienholders.city', 'city')
      .addSelect('lienholders.province', 'province')
      .addSelect('lienholders.postalCode', 'postalCode')
      .addSelect('lienholders.active', 'active')
      .addSelect('lienholders.dealerGroup', 'dealerGroupId')

    if (filter.keyword) {
      const keywordfilter = {
        keyword: `%${filter.keyword}%`,
      };
      leinholderQB.andWhere('lienholders.companyName ILIKE :keyword', keywordfilter);
      leinholderQB.orWhere(
        'lienholders.addressLine1 ILIKE :keyword',
        keywordfilter,
      );
      leinholderQB.orWhere(
        'lienholders.addressLine2 ILIKE :keyword',
        keywordfilter,
      );
    }
    else {
      if (filter.companyName)
        leinholderQB.andWhere('lienholders.companyName ILIKE :companyName', {
          companyName: `%${filter.companyName}%`,
        });
      if (filter.address) {
        const addressQuery = {
          address: `%${filter.address}%`,
        };
        leinholderQB.orWhere(
          'lienholders.addressLine1 ILIKE :address',
          addressQuery,
        );
        leinholderQB.orWhere(
          'lienholders.addressLine2 ILIKE :address',
          addressQuery,
        );
      }
      if (filter.city)
        leinholderQB.andWhere('lienholders.city ILIKE :city', {
          city: `%${filter.city}%`,
        });

      if (typeof filter.active == 'boolean') {
        leinholderQB.andWhere(`lienholders.active = :active`, {
          active: filter.active,
        });
      }
      if (!Object.keys(sort).length) {
        leinholderQB.orderBy('lienholders.createdBy');
      }
      if (sort.companyName) {
        leinholderQB.addOrderBy('lienholders.companyName', sort.companyName.toUpperCase());
      }
      if (sort.city) {
        leinholderQB.addOrderBy('lienholders.city', sort.city.toUpperCase());
      }
      if (sort.address) {
        leinholderQB.addOrderBy(
          'lienholders.addressLine1',
          sort.address.toUpperCase(),
        );
        leinholderQB.addOrderBy(
          'lienholders.addressLine2',
          sort.address.toUpperCase(),
        );
      }
    }
    return paginateRaw(leinholderQB, pagination);
    // const { pagination } = this.getQuery(query);
    // const res = await this.lienholderRepository.findAndCount({
    //   where: {
    //     deleted_at: null,
    //     dealerGroup: dealerGroup,
    //   },
    //   take: pagination.limit as number,
    //   skip: (((pagination.page as number) - 1) *
    //     (pagination.limit as number)) as number,
    // });
    // return new SuccessResponse({
    //   data: res[0],
    //   totalItems: res[1],
    // });
  }

  public async getLienholderById(id: number) {
    if (!id) {
      throw new NotFoundException('Id required');
    }
    const res = await this.lienholderRepository.findOne(id);

    if (!res) {
      throw new NotFoundException('Lienholder not found');
    }

    return new SuccessResponse(res);
  }

  public async softDeletelienholder(id: number) {
    const property = await this.lienholderRepository.softDelete(id);
    return new SuccessResponse(property);
  }
}

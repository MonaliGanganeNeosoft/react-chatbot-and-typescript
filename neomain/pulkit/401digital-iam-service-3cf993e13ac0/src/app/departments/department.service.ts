import { BaseService, RequestQuery } from '@401_digital/xrm-core';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginateRaw } from 'nestjs-typeorm-paginate';
import { Level } from 'src/constants';
import { getRepository, Repository, ILike, Not } from 'typeorm';
import { TokenDTO } from '../auth/auth.dto';
import { UsersEntity } from '../users/users.entity';
import { AddDepartmentDTO, DepartmentFilterDTO, UpdateDepartmentDTO } from './department.dto';
import { DepartmentEntity } from './departments.entity';

@Injectable()
export class DepartmentService extends BaseService {
    constructor(
        @InjectRepository(DepartmentEntity)
        private readonly departmentRepository: Repository<DepartmentEntity>,
    ) {
        super();
    }

    private async isExists(name: string, dealerGroup: string, id: string = null) {
        const filter = {
            dealerGroup,
            name: ILike(name),
        } as any;
        if (id) {
            filter.id = Not(id);
        }
        const department = await this.departmentRepository.findOne(filter);
        if (department) {
            throw new BadRequestException('dapartmant already exists');
        }
    }
    private setDefault(user: TokenDTO, data: AddDepartmentDTO) {
        const entity = Object.assign(
            new DepartmentEntity(),
            data,
        ) as DepartmentEntity;
        if (user.userLevel == Level.ROOT && !entity.dealerGroup) {
            throw new BadRequestException('dealerGroup is required');
        }
        if (
            user.userLevel == Level.DEALERGROUP ||
            user.userLevel == Level.DEALERSHIP
        ) {
            entity.dealerGroup = user.dealerGroup;
        }
        entity.updatedBy = user.id;
        return entity;
    }

    async save(user: TokenDTO, data: AddDepartmentDTO) {
        await this.isExists(data.name, user.dealerGroup);
        const department = this.setDefault(user, data);
        department.createdBy = user.id;
        return this.departmentRepository.save(department);
    }

    async update(user: TokenDTO, id: string, data: UpdateDepartmentDTO) {
        const { name, active } = data;
        const department = new DepartmentEntity();
        department.id = id;
        if (name) {
            await this.isExists(data.name, user.dealerGroup, id);
            department.name = name;
        }
        if (typeof active == 'boolean') {
            department.active = active;
        }
        department.updatedBy = user.id;
        return this.departmentRepository.save(department);
    }

    get(user: TokenDTO, query: RequestQuery<DepartmentFilterDTO>) {
        const { filter, pagination, sort } = this.getQuery(query);
        const repo = getRepository(DepartmentEntity);
        const departmentQB = repo.createQueryBuilder('department');
        departmentQB
            .select('department.id', 'id')
            .addSelect('department.name', 'name')
            .addSelect('department.active', 'active');
        departmentQB.addSelect('COUNT(users.department)', 'userCount');
        departmentQB.leftJoin(
            UsersEntity,
            'users',
            'users.department = department.id',
        );
        departmentQB.groupBy('department.id');

        let dealerGroup: string;

        const active = typeof filter.active == "boolean" ? filter.active : true;

        departmentQB.andWhere(`department.active = :active`, { active: active });

        if (user.userLevel == Level.ROOT) {
            if (filter.dealerGroup) {
                dealerGroup = filter.dealerGroup;
            }
        }

        if (user.userLevel == Level.DEALERGROUP || user.userLevel == Level.DEALERSHIP) {
            dealerGroup = user.dealerGroup;
            delete filter.dealerGroup;
        }

        if (dealerGroup) {
            departmentQB.where(`department.dealerGroup = :dealerGroup`, {
                dealerGroup: dealerGroup,
            });
        }

        if (filter.dealerGroupIds && filter.dealerGroupIds.length) {
            departmentQB.where(`department.dealerGroup IN (:...dealerGroupIds)`, {
                dealerGroupIds: filter.dealerGroupIds,
            });
        }

        if (filter.name) {
            departmentQB.andWhere(`department.name ILIKE :name`, {
                name: `%${filter.name}%`,
            });
        }

        if (!Object.keys(sort).length) {
            departmentQB.orderBy('department.createdAt', 'DESC');
        }
        if (sort.name) {
            departmentQB.addOrderBy('department.name', sort.name.toUpperCase());
        }

        if (sort.userCount) {
            departmentQB.orderBy('"userCount"', sort.userCount.toUpperCase());
        }
        return paginateRaw(departmentQB, pagination);
    }

    getById(user: TokenDTO, id: string) {
        const filter = { id: id } as DepartmentEntity;
        if ([Level.DEALERGROUP, Level.DEALERSHIP].includes(user.userLevel as Level)) {
            filter.dealerGroup = user.dealerGroup
        }
        return getRepository(DepartmentEntity).findOne(filter);
    }
}

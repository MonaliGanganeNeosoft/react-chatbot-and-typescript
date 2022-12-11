import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/entities/employee';
import { UsersEntity } from 'src/app/users/users.entity';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
const TypeOrmModules = TypeOrmModule.forFeature([EmployeeEntity,UsersEntity]);

@Module({
    imports: [TypeOrmModules],
    exports: [TypeOrmModules],
    controllers: [CustomerController],
    providers: [CustomerService,],
})
export class CustomerModule { }
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsService } from 'src/configs';
import { EmployeeEntity } from 'src/entities/employee';
import { MailHelper } from 'src/helpers/mail';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDmsEntity } from '../user-dms-mapping/userDms.entity';
import { DmsEntity } from '../dms/dms.entity';

const TypeOrmModules = TypeOrmModule.forFeature([EmployeeEntity, UserDmsEntity, DmsEntity]);

@Module({
  imports: [TypeOrmModules],
  exports: [TypeOrmModules, UsersService, MailHelper],
  controllers: [UsersController],
  providers: [UsersService, AwsService, MailHelper],
})
export class UsersModule {}

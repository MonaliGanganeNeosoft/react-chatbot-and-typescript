import { Module } from '@nestjs/common';
import { InternalController } from './internal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../users/users.entity';
import { DealerGroupEntity } from '../dealer-groups/dealers-group.entity';
import { LeadmanagementService } from '../lead-management/lead-management.service';
import { DealerGroupService } from '../dealer-groups/dealer-group.service';
import { UsersService } from '../users/users.service';
import { EmployeeEntity } from 'src/entities/employee';
import { AwsService } from '@config';
import { SkillSetEntity } from '../users/users-skillset.entity';
import { MailHelper } from 'src/helpers/mail';
import { InternalService } from './internal.service';
import { UserDmsEntity } from 'src/app/user-dms-mapping/userDms.entity';
import { DmsEntity } from '../dms/dms.entity';
const TypeOrmModules = TypeOrmModule.forFeature([
  UsersEntity,
  DealerGroupEntity,
  EmployeeEntity,
  SkillSetEntity,
  UserDmsEntity,
  DmsEntity
]);

@Module({
  imports: [TypeOrmModules],
  exports: [TypeOrmModules, LeadmanagementService],
  controllers: [InternalController],
  providers: [
    InternalService,
    DealerGroupService,
    LeadmanagementService,
    UsersService,
    AwsService,
    MailHelper,
  ],
})
export class InternalModule {}

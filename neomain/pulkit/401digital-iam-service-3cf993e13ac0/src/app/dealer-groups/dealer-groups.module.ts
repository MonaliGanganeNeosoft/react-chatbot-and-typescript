import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealerGroupController } from './dealer-groups.controller';
import { DealerGroupEntity } from './dealers-group.entity';
import { DealerGroupService } from './dealer-group.service';
import { AwsService } from '@config';

@Module({
    imports: [TypeOrmModule.forFeature([DealerGroupEntity])],
    controllers: [DealerGroupController],
    providers: [DealerGroupService, AwsService],
    exports: [AwsService]
})
export class DealerGroupsModule { }

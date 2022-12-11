import { PhoneController } from './phone.controller';
import { HttpModule, Module } from '@nestjs/common';
import { AwsService } from '../../configs/aws';
import {CallService} from './phone.service'
import {UserSipEntity} from '../Phone/phone.entity'
import {UserCallLogsEntity} from './phone.callogs.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
const TypeOrmModules = TypeOrmModule.forFeature([UserSipEntity,UserCallLogsEntity])
@Module({
    imports: [HttpModule,TypeOrmModules],
    exports: [TypeOrmModules],
    controllers: [PhoneController],
    providers:[AwsService,CallService]
})
export class CallModule {}
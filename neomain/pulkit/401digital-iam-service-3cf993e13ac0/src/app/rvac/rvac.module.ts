import { RvacController } from './rvac.controller';
import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsService } from '../../configs/aws';
import { RvacService } from './rvac.service'
import { RvacEntity } from './rvac.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([RvacEntity]),
        HttpModule
    ],
    controllers: [
        RvacController],
    providers: [
        AwsService,
        RvacService],
})
export class RvacModule { }

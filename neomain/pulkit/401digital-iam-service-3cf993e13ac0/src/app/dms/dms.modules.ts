import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmsEntity } from './dms.entity';
import { DmsController } from './dms.controller';
import { DmsService } from './dms.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DmsEntity         
        ])
    ],
    exports: [TypeOrmModule, DmsService],
    controllers: [DmsController],
    providers: [DmsService],
})
export class DmsModule { }
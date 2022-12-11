import { LienholderService } from './lienholder.service';
import { LienholderController } from './lienholder.controller';
import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LienholderEntity } from './lienholder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LienholderEntity]), HttpModule],
  controllers: [LienholderController],
  providers: [LienholderService],
})
export class LienholderModule { }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppVersionController } from './app-version.controller'; 
import { AppVersionService } from './app-version.service';
import { AppVersionMasterEntity } from './app-version-master.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppVersionMasterEntity])],
  providers: [AppVersionService],
  exports: [AppVersionService],
  controllers: [AppVersionController],
})
export class AppVersionModule {}

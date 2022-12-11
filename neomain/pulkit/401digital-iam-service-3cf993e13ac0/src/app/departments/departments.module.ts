import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentService } from './department.service';
import { DepartmetsController } from './departments.controller';
import { DepartmentEntity } from './departments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DepartmentEntity])],
  controllers: [DepartmetsController],
  providers: [DepartmentService],
})
export class DepartmentsModule {}

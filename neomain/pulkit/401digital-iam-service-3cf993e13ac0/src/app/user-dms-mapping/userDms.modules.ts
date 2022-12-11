import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDmsEntity } from './userDms.entity';
import { UserDmsController } from './userDms.controller';
import { UserDmsService } from './userDms.service';
import { UsersEntity } from '../users/users.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserDmsEntity,
            UsersEntity
        ])
    ],
    exports: [TypeOrmModule, UserDmsService],
    controllers: [UserDmsController],
    providers: [UserDmsService],
})
export class UserDmsModule { }
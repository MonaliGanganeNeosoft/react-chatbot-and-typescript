import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { AppType, ToBoolean } from 'src/constants';

//min version, type of os, force update yes or no,released note
export class UserAppLogsDTO {
    
    @ApiProperty()
    @IsNotEmpty()
    userId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(AppType)
    appType: AppType;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    appVersion: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    @ToBoolean()
    IsAppUpdated: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    @ToBoolean()
    IsActive: boolean;
    

}
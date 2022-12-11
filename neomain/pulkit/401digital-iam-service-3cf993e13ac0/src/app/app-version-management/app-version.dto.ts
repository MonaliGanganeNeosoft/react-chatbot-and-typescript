import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { AppType, ToBoolean } from 'src/constants';

//min version, type of os, force update yes or no,released note
export class AppVersionDTO {
    
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(AppType)
    appType: AppType;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    appLatestVersion: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    releasedNote: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    @ToBoolean()
    forceUpdate: Boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    @ToBoolean()
    IsActive: Boolean;    

    @ApiProperty()
    @IsString()
    appUrl: string;

}
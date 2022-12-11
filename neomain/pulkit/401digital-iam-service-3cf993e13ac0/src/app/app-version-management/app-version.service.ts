import { BadRequestException, Injectable } from '@nestjs/common';
import { getConnection, getManager, getRepository, ILike, In, Like, Not, QueryRunner } from 'typeorm';
import {
    ToBoolean
} from 'src/constants';
import { BaseService, RequestQuery, DabaduServiceCodes as ServiceCodes, DabaduServiceNames as ServiceNames } from '@401_digital/xrm-core';

import { TokenDTO } from '../auth/auth.dto';
import { AppVersionDTO } from './app-version.dto';
import { AppVersionMasterEntity } from './app-version-master.entity';
import { UserAppLogsDTO } from './user-app-logs.dto';
import { UserAppVersionMasterEntity } from './user-app-logs.entity';


@Injectable()
export class AppVersionService extends BaseService {


    async createAppVersion(user: TokenDTO, dto: AppVersionDTO) {

        //check app type with active status exixts or not
        
        const AppVersionMasterRepo = getRepository(AppVersionMasterEntity);

        const appdata =  await AppVersionMasterRepo.findOne({
            appType: dto.appType,
            IsActive: true,
        });

        if(appdata){
            return "App type with active status alreay exist";
        }else{
            //return "Success";
            return AppVersionMasterRepo
            .createQueryBuilder()
            .insert()
            .values({
                appType: dto.appType,
                appLatestVersion: dto.appLatestVersion,
                releasedNote: dto.releasedNote,
                forceUpdate: false,
                IsActive: true,

            })
            .execute();
        }
    }

    async checkAppVersion(user: TokenDTO, dto: AppVersionDTO) {

        const appVersion = {appVersion : `2.0.0`};
        return appVersion
    }

    async getAllAppVersion(user: TokenDTO) {

        //check app type with active status exixts or not
        
        const AppVersionMasterRepo = getRepository(AppVersionMasterEntity);

        return AppVersionMasterRepo.find();     
    }

    async getAllUserLogs(user: TokenDTO){

        const userAppVersionMasterRepo = getRepository(UserAppVersionMasterEntity);
        return userAppVersionMasterRepo.find();     

    }

    async checkUserApp(user: TokenDTO, dto: UserAppLogsDTO) {

        //check app type with active status exixts or not

        const appTypeData = await getRepository(AppVersionMasterEntity).find({appType:dto.appType});

        const userAppVersionMasterRepo = getRepository(UserAppVersionMasterEntity);

        const userappdata =  await userAppVersionMasterRepo.findOne({
            userId: dto.userId,
            appType: dto.appType,
            IsActive: true,
        });
        if(userappdata){
            if(dto.appVersion != appTypeData[0].appLatestVersion ){
               

                //app version is not equal update user app version in log

                const userAppentity = new UserAppVersionMasterEntity();
                userAppentity.userId = dto.userId;
                userAppentity.appVersion = appTypeData[0].appLatestVersion;
                userAppentity.IsAppUpdated = true;
                userAppentity.appType = dto.appType;
                userAppentity.IsActive= true,
            
                await getRepository(UserAppVersionMasterEntity).update({ id: userappdata.id },userAppentity);

                return {isAppUpdateRequired:"yes",latestVersion:appTypeData[0].appLatestVersion,appData:appTypeData}
                
            }else{
                return {isAppUpdateRequired:"no",latestVersion:appTypeData[0].appLatestVersion,appData:appTypeData }
            }
           
        }else{
           
            await userAppVersionMasterRepo
            .createQueryBuilder()
            .insert()
            .values({
                userId:dto.userId,
                appType: dto.appType,
                appVersion: dto.appVersion,
                IsAppUpdated:false,
                IsActive: true,

            })
            .execute();

            if(dto.appVersion != appTypeData[0].appLatestVersion ){
                return {isAppUpdateRequired:"yes",latestVersion:appTypeData[0].appLatestVersion,appData:appTypeData}
            }else{
                return {isAppUpdateRequired:"no",latestVersion:appTypeData[0].appLatestVersion,appData:appTypeData }            }

        }
    }
}
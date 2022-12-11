import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';;
import { TokenDTO } from '../auth/auth.dto';
import axios from 'axios';
import {Repository } from 'typeorm';
import {UserSipEntity} from '../Phone/phone.entity'
import {SIP_API_KEY} from '../../environment/index';
import {UserCallLogsEntity} from './phone.callogs.entity'


@Injectable()
export class CallService {
  constructor(
    @InjectRepository(UserSipEntity)
    private readonly siprepo: Repository<UserSipEntity>,
    @InjectRepository(UserCallLogsEntity)
    private readonly calllogrepo: Repository<UserCallLogsEntity>,
  ){}
  public async getSipDetail(user: TokenDTO){
     const userdata = await this.siprepo.findOne({email:user.email})
    if(userdata==undefined){
      const result: any = await axios({
        url: "https://webrtc.coreapi.co/api/login",
        method: 'post',
        data:{
           "email": user.email,
          "account": "401auto",
           "apikey":SIP_API_KEY
      }
    }).catch((err)=>{
      throw err});
    const sipdata= result.data.data.sip
    const updatedata=await this.siprepo.save({
      userid:user.id,
      email:user.email,
      name:user.name,
      sip_device_id:sipdata.device_id,
      sip_password:sipdata.password,
      sip_realm:sipdata.realm,
      sip_username:sipdata.username,
      sip_enforce_security:sipdata.enforce_security

    })
    return updatedata
    }
    else{
      return userdata
    }
  }
  public async callLog(data:any,user:any){
    const userInfo={
      userid:user.id,
      name:user.name,
      email:user.email,
      user_level:user.userLevel,
    }
    
    const calldata={
      clid:data.clid,
      flow:data.flow,
      callid:data.id,
      start_time:parseInt(data.start),
      status:data.status,
      end_time:parseInt(data.stop),
      uri:data.uri
    }
    const datas={...userInfo,...calldata}
     const updatecallogs=await this.calllogrepo.save(datas)
   return updatecallogs
  }
  public async getLogs(user:any){
    const getcallogs= await this.calllogrepo.find({
        select:['clid','flow','callid','start_time','status','end_time','uri'],
        where: {userid:user.id},
        order: {
        'end_time': 'ASC',
      }})
      return {user:user.name,callogs:getcallogs}
  }
}
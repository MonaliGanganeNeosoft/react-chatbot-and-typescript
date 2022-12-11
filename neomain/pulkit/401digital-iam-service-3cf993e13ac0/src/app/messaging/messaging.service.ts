import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ErrorResponse, SuccessResponse } from '@401_digital/xrm-core';
import { goodResponse } from '../../helpers/response.helper';
import { TokenDTO } from '../auth/auth.dto';
import { MessagingDTO } from './messaging.dto';
import { UsersEntity } from '../users/users.entity';
import { getRepository } from 'typeorm';
import { CoreMessagingEntity, MessagingType, MessagingSettingsUpdateEntity, MessagingSettingTypes, SMSMessagingType, HttpHelper } from '@401_digital/xrm-core';
import { EmployeeEntity } from 'src/entities/employee';
import { SmsQueueProducer, PushNotificationQueueProducer } from "../../core";
import { MICROSERVICES, TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID, TWILIO_APP_ID, TWILIO_VOICE_URL, ENV } from "@environments"
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const MessagingHttp = new HttpHelper(MICROSERVICES.MESSAGING.HOST);

@Injectable()
export class Messaging {
    public async requestToSendSMS(user: TokenDTO, options: MessagingDTO) {
        try {
            const userRepo = getRepository(UsersEntity);
            const userData = await userRepo.findOne({ where: { id: user.id }, relations: ['profile'] });
            const from = (userData.profile as EmployeeEntity).assignedPhoneNumber
            if (!from) { throw new NotFoundException("You don't have assigne phone number to send message") }
            const dataObj: CoreMessagingEntity = {
                type: MessagingType.SMS,
                operationType: SMSMessagingType.LEAD_SMS,
                leadId: options.leadId,
                leadName: options.leadName,
                senderId: user.id,
                senderName: user.name,
                payload: {
                    from: from,
                    to: options.toNumber,
                    content: options.content,
                }
            } as any;
            SmsQueueProducer.sendMessage(dataObj).catch(error => {
                console.error(error);
            })
            return goodResponse();
        } catch (err) {
            throw new BadRequestException(err.message)
        }
    }
    public static communicationSettings(payload) {
        const settings = {
            type: MessagingType.SETTINGS,
            operationType: MessagingSettingTypes.SETTINGS_UPDATE,
            payload: {
                userId: payload.userId,
                userType: payload.userType,
                userName: payload.userName,
                pushNotifications: {
                    deviceId: payload.deviceId,
                    deviceType: payload.deviceType
                },
                dealerGroup: payload.dealerGroup,
                dealership: payload.dealership ? payload.dealership : null,
                roles: payload.userRolesArray,
                userLevel: payload.userLevel,
                calls: {
                    phoneNumber: payload.assignedPhoneNumber
                }
            }
        } as MessagingSettingsUpdateEntity;
        return MessagingHttp.post("internal/communicationSettings", settings);
    }

    public static setCommunications(settings) {
        return MessagingHttp.post("internal/communicationSettings", settings);
    }

    public static removeDeviceId(payload) {
        const settings = {
            type: MessagingType.SETTINGS,
            operationType: "REMOVE_DEVICEID",
            payload: payload
        } as any;
        return MessagingHttp.post("internal/communicationSettings", settings);
    }

    public static sendPushNotification(payload) {
        PushNotificationQueueProducer.sendMessage({
            type: MessagingType.NOTIFICATIONS,
            payload: {
                userId: payload.userId,
                userType: payload.userType,
                notification: {
                    title: payload.title,
                    body: payload.body
                }
            }
        } as any).catch(error => console.error(error));
    }
    public async getAvailableNumber(user, query) {
        try {
            let listOfNumbers = await client.availablePhoneNumbers('CA')
                .local
                .list()
            console.log(listOfNumbers)
            return new SuccessResponse(listOfNumbers);
        } catch (err) {
            throw new BadRequestException(err.message)
        }
    }
    public async buyNumbers(user, body) {
        try {
            let sid
            if (ENV === "UAT" || ENV === "PRODUCTION") {
                const buyNumber = await client.incomingPhoneNumbers
                    .create({ phoneNumber: body.phoneNumber })
                sid = buyNumber.sid
            }
            else {
                // For Mock response in dev and staging ENV
                sid = "PNee248d1d0e284abb6757e488ef538f39"
            }
            const UpdateConfig = await client.incomingPhoneNumbers(sid)
                .update(
                    {
                        smsApplicationSid: TWILIO_APP_ID,
                        voiceUrl: TWILIO_VOICE_URL
                    }
                )
            UpdateConfig.phoneNumber = body.phoneNumber
            return new SuccessResponse(UpdateConfig);
        }
        catch (err) {
            throw new BadRequestException(err.message)
        }
    }
}
import { HttpHelper, MessagingSettingTypes, MessagingType } from "@401_digital/xrm-core";
import { MICROSERVICES } from "@environments";
import { InternalOrgDTO } from "src/app/internal/internal.dto";
import { Messaging } from "src/app/messaging/messaging.service";
import { UsersEntity } from "src/app/users/users.entity";
import { EmployeeEntity } from "src/entities/employee";

type CalenderSetup = { uuid: string, email: string, name: string, title: string, eventName: string, description: string, duration: number, hidden?: boolean };

export class InternalHelper {
    private static http = new HttpHelper(MICROSERVICES.LEAD.HOST);
    private static dealHttpClient = new HttpHelper(MICROSERVICES.DEAL.HOST);

    static async setupLead(payload: InternalOrgDTO, type: 'post' | 'put' | 'delete' = 'post') {
        const data = await this.http[type]('api/internal/organization', payload);
        return data;
    }

    static async removeLeadSetting(payload) {
        const data = await this.http.post('api/internal/deleteLeadSetting', payload);
        return data;
    }

    static async setupCalender(payload: CalenderSetup) {
        const http = new HttpHelper(MICROSERVICES.CALENDAR.HOST);
        return http.post("api/internal/users", payload);
    }

    static setupMessaging(userEntity: UsersEntity, userRoles: any = []) {
        //   const roles = userRoles.map(el => el.role)
        const profile = userEntity.profile as EmployeeEntity;

        const payload = {} as any;
        payload.userType = "staff";
        if (userEntity.id) payload.userId = userEntity.id;

        if (profile.assignedPhoneNumber) {
            payload.calls = {
                phoneNumber: profile.assignedPhoneNumber
            };
            payload.sms = {
                phoneNumber: profile.assignedPhoneNumber
            }
        }

        const emails = {} as any;

        if (profile.email) emails.email = profile.email;
        if (profile.communicationEmail) emails.communicationEmail = profile.communicationEmail

        if (Object.keys(emails).length) payload.emails = emails;

        if ((typeof userEntity.dealerGroup === 'object')) payload.dealerGroup = userEntity.dealerGroup.id;
        if (typeof userEntity.dealerGroup == 'string') payload.dealerGroup = userEntity.dealerGroup

        if ((typeof userEntity.dealership === 'object')) payload.dealership = userEntity.dealership;

        if (userEntity?.userRoles?.length) payload.roles = userEntity.userRoles;

        if (userEntity.userLevel) payload.userLevel = userEntity.userLevel;

        const settings = {
            type: MessagingType.SETTINGS,
            operationType: MessagingSettingTypes.SETTINGS_UPDATE,
            payload: payload,
        } as any;

        return Messaging.setCommunications(settings);
    }

    static async setupLeadforLM(payload, type = 'post') {
        const http = new HttpHelper(MICROSERVICES.LEAD.HOST);
        const data = await http[type]('api/internal/saveLM', payload);
        return data;
    }

    static async setupDeal(payload: InternalOrgDTO, type: 'post' | 'put' | 'delete' = 'post') {
        return this.dealHttpClient[type]('api/internal/organization', payload);
    }

    static async deleteDealershipInDeal(uniqueId: string) {
        return this.dealHttpClient.delete(`api/internal/organization/${uniqueId}`);
    }
}
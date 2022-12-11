import { Level } from '@401_digital/xrm-core';
import { IsNotEmpty, IsString } from 'class-validator';
import { DealershipLeadSettingsDTO } from '../dealership/dto';

export class SalesPersonDTO {
    @IsNotEmpty()
    @IsString()
    employeeRef: string;
}

export class EmployeeAccessDTO {
    @IsNotEmpty()
    serviceType: string;
    @IsNotEmpty()
    accessType: string;

    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    userLevel: string;

    dealershipId: string;
}

export class UsersDTO {
    @IsNotEmpty()
    @IsString()
    id: string;
}

export class InternalUserDTO {
    userLevel: Level;
    uniqueId: string;
    dealershipId: string;
    dealergroupId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    skillSet: any;
    email: string;
    communicationEmail: string;
    phoneNumber: string;
    assignedPhoneNumber: string;
    dailyLimit: number;
    monthlyLimit: number;
    isActive: boolean;
    departmentId: string;
    roles: string[];
    isSalesAgent: boolean;
    imageUrl: string;
    canReceiveLeads: boolean;
    slug: string;
}

export class InternalOrgDTO {
    name: string;
    email: string;
    uniqueId: string;
    parentId: string;
    type: 1 | 2;
    phoneNumber: string;
    countryCode: string;
    isHQ: boolean;
    isBdc: boolean;
    dateOfIncorporation: string;
    isSubscribed: string;
    limit: number;
    OMVICLicense: string;
    leadSettings: Array<DealershipLeadSettingsDTO>
    user: InternalUserDTO;
    isActive: boolean;
    fax: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
    logo: string;
}

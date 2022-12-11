import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    IsBoolean,
    MaxLength,
    IsNumber,
    IsEmail,
    Matches,
    IsOptional,
    IsEnum,
} from 'class-validator';
import { AccountStatus, ValidatorPatterns, WorkingDays } from 'src/constants';
import { CorePaginationDTO, IdLookupDTO } from 'src/dto/core';
import { AddDealerGroupDTO } from '../dealer-groups/dealer-groups.dto';
import { UsersDTO } from '../users/users.dto';
import { ValidationPatterns } from '@401_digital/xrm-core';
export class DealershipOpeningDTO {
    @ApiProperty({
        name: 'day',
        enum: WorkingDays,
    })
    @IsEnum(WorkingDays)
    @IsNotEmpty()
    day: string;

    @ApiProperty({ example: '10:00' })
    @Matches(ValidatorPatterns.Time.HHMM)
    @IsOptional()
    startTime: string;

    @ApiProperty({ example: '11:00' })
    @Matches(ValidatorPatterns.Time.HHMM)
    @IsOptional()
    endTime: string;

    @ApiProperty({ type: Boolean })
    @IsBoolean()
    isClosed: boolean;

    @IsString()
    @MaxLength(500)
    @ApiProperty({ type: String })
    notes: string;
}

export class DealershipLeadSettingsDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    country: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    province: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    leadTypeId: string

    @ApiProperty()
    leadTypeName: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    leadTierId: string

    @ApiProperty()
    leadTierName: string

    @IsString()
    @Matches(ValidatorPatterns.PostalCodesPattern)
    @ApiProperty({ type: String })
    postalCodes: string;

    @ApiProperty({ type: String, enum: ['inclusion', 'exclusion'] })
    activeZipCode: string;
}

export class UpdateGMDTO {
    @ApiProperty({ type: 'string', enum: ['YES', 'NO'], required: true })
    userFromAnotherDealership: 'YES' | 'NO';

    @ApiProperty()
    dealershipId: string;

    @ApiProperty()
    roleId: string;

    @ApiProperty({ required: true })
    userId: string;
}

export class DealershipFilterDTO {
    @ApiProperty()
    name: string;

    @ApiProperty()
    city: string;

    @ApiProperty()
    province: string;

    @ApiProperty({
        enum: [AccountStatus.ACTIVE, AccountStatus.DRAFT, AccountStatus.INACTIVE],
    })
    status: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    generalManager: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    dealerGroupId: string;

    @ApiProperty({ isArray: true, type: String })
    dealerGroupIds: string[];

    @ApiProperty()
    omvicLicense: string;

    @ApiProperty()
    keyword: string;

    @ApiProperty({ type: [String] })
    dealershipIds: string[];

}

export class DealershipQueryDTO {
    @ApiProperty()
    filter: DealershipFilterDTO;

    @ApiProperty()
    sort: DealershipFilterDTO;

    @ApiProperty()
    pagination: CorePaginationDTO;
}

export class DealershipDTO {
    @ApiProperty()
    id: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    name: string;

    // @IsNotEmpty()
    @ApiProperty({ type: IdLookupDTO })
    dealerGroup: string | AddDealerGroupDTO;

    @IsNotEmpty()
    @ApiProperty()
    @IsBoolean()
    isVisible: boolean;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    omvicLicense: string;

    @IsNotEmpty()
    @Matches(ValidatorPatterns.Date.YYYYMMDD)
    @IsString()
    @IsOptional()
    omvicLicenseExpiry: string;

    @ApiProperty()
    monthlyLimit: number;

    @ApiProperty()
    dailyLimit: number;

    @ApiProperty()
    isHQ: boolean;

    @ApiProperty()
    isBDC: boolean;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    latitude: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    longitude: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    addressLine1: string;

    // @IsNotEmpty()
    @ApiProperty()
    // @IsString()
    addressLine2: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    province: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    postalCode: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    fax: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    principleFirstName: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    principleLastName: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    googlePlaceId: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    customerServiceNumber: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    customerServiceEmail: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    partsServiceNumber: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    partsServiceEmail: string

    @IsNotEmpty()
    @ApiProperty({ type: [DealershipOpeningDTO] })
    openingHours: Array<DealershipOpeningDTO>;

    @IsNotEmpty()
    @ApiProperty({ type: [DealershipLeadSettingsDTO] })
    leadSettings: Array<DealershipLeadSettingsDTO>;

    @ApiProperty({ type: UsersDTO })
    @IsNotEmpty()
    generalManager: UsersDTO;

    @ApiProperty({ type: AccountStatus, enum: AccountStatus })
    status: AccountStatus;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    country: string

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    @Matches(ValidationPatterns.alphanumeric, { message: "Hst Number cannot contain special characters" })
    hstNumber: string

    @ApiProperty()
    @IsString()
    serviceNumber: string

    @ApiProperty()
    @IsString()
    serviceEmail: string

    @ApiProperty()
    @IsString()
    salesServiceNumber: string

    @ApiProperty()
    @IsString()
    salesServiceEmail: string

    @IsOptional()
    @ApiProperty()
    @IsString()
    // Domain url is not url it is a domain name that will be used for Email communications
    // @Matches(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g, { message: "Domain should be a valid url" })
    domainUrl: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    lenderId: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    logo: string
    
    @ApiProperty()
    @IsString()
    dmsProvider: string

    @ApiProperty()
    @IsString()
    dmsId: string

    @ApiProperty()
    @IsString()
    cpdId: string

    @ApiProperty()
    @IsString()
    carfaxApiKey: string

    @ApiProperty()
    @IsString()
    blackBookApiKey: string

    @ApiProperty()
    @IsString()
    equiFaxApiKey: string

    @ApiProperty({ isArray: true, type: String })
    @IsOptional()
    dmsIds: string[];
}

export class UpdateOpeningHoursDTO {
    @IsNotEmpty()
    @ApiProperty({ type: [DealershipOpeningDTO] })
    openingHours: Array<DealershipOpeningDTO>;
}

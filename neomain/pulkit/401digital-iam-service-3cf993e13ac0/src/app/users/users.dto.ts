import { ValidationPatterns } from '@401_digital/xrm-core';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    Matches,
    IsString
} from 'class-validator';
import { Gender, Level, ValidatorPatterns, LanguagePreference, DashboardView } from 'src/constants';
import { CorePaginationDTO, IdLookupDTO } from 'src/dto/core';

export class SkillSetDTO {
    @ApiProperty({ isArray: true, type: String })
    languages: string[];

    @ApiProperty({ isArray: true, type: String })
    leadTypes: string[];

    @ApiProperty({ isArray: true, type: String })
    vehicleCategories: string[];

    @ApiProperty()
    isBDC: boolean;
}

export class UserRoleDTO {
    @ApiProperty()
    dealership: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    user: string;
}

export class UsersFilterDTO {

    @ApiProperty()
    @IsOptional()
    @IsEnum(Level)
    userLevel: Level;

    @ApiProperty()
    keyword: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    roleName: string;

    @ApiProperty()
    roleId: string;

    @ApiProperty()
    dealerGroupName: string;

    @ApiProperty()
    dealershipName: string;

    @ApiProperty()
    dealershipId: string;

    @ApiProperty()
    dealerGroupId: string;

    @ApiProperty()
    departmentId: string;

    @ApiProperty()
    active: boolean;

    @ApiProperty()
    assignedPhoneNumber: string;

    @ApiProperty()
    startDate: string;

    @ApiProperty()
    endDate: string;

    @ApiProperty()
    currentUserId: string;
}

export class UsersDTO {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userLevel: Level;

    @ApiProperty()
    dealerGroup: IdLookupDTO;

    @ApiProperty()
    dealership: IdLookupDTO;

    @ApiProperty()
    department: IdLookupDTO;

    @ApiProperty({ type: UserRoleDTO, isArray: true })
    roles: UserRoleDTO[];

    @ApiProperty({ enum: [Gender.FEMALE, Gender.MALE, Gender.NO_WISH], required: false })
    @IsOptional()
    @IsEnum(Gender)
    gender: string;

    @ApiProperty()
    omvicLicense: string;

    @ApiProperty()
    @IsOptional()
    @Matches(ValidatorPatterns.Date.YYYYMMDD)
    omvicLicenseExpiry: string;

    @ApiProperty()
    isLicenseInProgress: boolean;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email: string;

    @IsEmail()
    @IsOptional()
    communicationEmail: string;

    @ApiProperty()
    @IsOptional()
    @Matches(ValidatorPatterns.Date.YYYYMMDD)
    birthDate: string;

    @ApiProperty({ required: false })
    password: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    phoneExtension: string;

    @ApiProperty()
    assignedPhoneNumber: string;

    @ApiProperty()
    isVisible: boolean;

    @ApiProperty()
    active: boolean;

    @ApiProperty()
    loginEnabled: boolean;

    @ApiProperty()
    skillSet: SkillSetDTO;

    @ApiProperty()
    dailyLimit: number;

    @ApiProperty()
    monthlyLimit: number;

    @ApiProperty()
    reportsTo: UsersDTO;

    @ApiProperty({ isArray: true, type: UsersDTO })
    reporters: UsersDTO[]
}

export class AddUsersDTO {
    @ApiProperty()
    id: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(Level)
    userLevel: Level;

    @ApiProperty()
    dealerGroup: IdLookupDTO;

    @ApiProperty()
    @IsOptional()
    dealership: IdLookupDTO;

    @ApiProperty()
    @IsOptional()
    department: IdLookupDTO;

    @ApiProperty({ type: UserRoleDTO, isArray: true })
    @IsNotEmpty()
    roles: UserRoleDTO[];

    @ApiProperty({ enum: [Gender.FEMALE, Gender.MALE], required: false })
    @IsEnum(Gender)
    @IsNotEmpty()
    gender: string;

    @ApiProperty()
    // @Matches(ValidationPatterns.alphanumeric)
    @IsOptional()
    omvicLicense: string;

    // @Matches(ValidatorPatterns.Date.YYYYMMDD)
    @ApiProperty()
    @IsOptional()
    omvicLicenseExpiry: string;

    @ApiProperty()
    isLicenseInProgress: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @Matches(ValidationPatterns.onlyString, { message: "firstName should have only characters" })
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    @Matches(ValidationPatterns.onlyString, { message: "lastName should have only characters" })
    lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    @IsOptional()
    communicationEmail: string;

    @ApiProperty()
    @IsOptional()
    @Matches(ValidatorPatterns.Date.YYYYMMDD)
    birthDate: string;

    @ApiProperty({ required: false })
    @IsOptional()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    phone: string;

    @ApiProperty()
    phoneExtension: string;

    @ApiProperty()
    @IsOptional()
    @Matches(ValidationPatterns.onlyNumber, { message: "assigned phone number should contain only numbers" })
    assignedPhoneNumber: string;

    @ApiProperty()
    isVisible: boolean;

    @ApiProperty()
    loginEnabled: boolean;

    @ApiProperty()
    skillSet: SkillSetDTO;

    @ApiProperty()
    reportsTo: UsersDTO;

    // @ApiProperty({ isArray: true, type: UsersDTO })
    reporters: UsersDTO[]

    @ApiProperty({ isArray: true, type: String })
    @IsOptional()
    dmsIds: string[];
}

export class CreateUserDTO {
    @ApiProperty({ type: 'file', format: 'binary' })
    image: any;
    @ApiProperty({
        type: AddUsersDTO,
        description: 'Please Strigify The Payload Since It Accepts Only FormData ',
    })
    @IsNotEmpty()
    data: AddUsersDTO;
}

export class UpdateUserDTO {
    @ApiProperty({ enum: [Gender.MALE, Gender.FEMALE], required: false })
    @IsOptional()
    @IsEnum(Gender)
    gender: string;

    @ApiProperty()
    omvicLicense: string;

    // eslint-disable-next-line prettier/prettier
    //  @Matches(ValidatorPatterns.Date.YYYYMMDD)
    @IsOptional()
    @ApiProperty()
    omvicLicenseExpiry: string;

    @ApiProperty()
    isLicenseInProgress: boolean;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    @IsOptional()
    @Matches(ValidatorPatterns.Date.YYYYMMDD)
    birthDate: string;

    @ApiProperty({ type: UserRoleDTO, isArray: true })
    roles: UserRoleDTO[];

    @ApiProperty()
    phone: string;

    @ApiProperty()
    phoneExtension: string;

    @ApiProperty()
    isVisible: boolean;

    @ApiProperty()
    loginEnabled: boolean;

    @ApiProperty()
    skillSet: SkillSetDTO;

    @ApiProperty()
    active: boolean;

    @ApiProperty()
    dailyLimit: number;

    @ApiProperty()
    monthlyLimit: number;

    @ApiProperty()
    reportsTo: UsersDTO;


    @ApiProperty()
    assignedPhoneNumber: string;

    // @ApiProperty({ isArray: true, type: UsersDTO })
    reporters: UsersDTO[]


    @ApiProperty()
    @IsOptional()
    department: IdLookupDTO;

    @ApiProperty({ isArray: true, type: String })
    @IsOptional()
    dmsIds: string[];
}

export class UpdateProfileDTO {
    @ApiProperty({ enum: [Gender.MALE, Gender.FEMALE], required: false })
    @IsOptional()
    @IsEnum(Gender)
    gender: string;

    @ApiProperty()
    omvicLicense: string;

    // eslint-disable-next-line prettier/prettier
    //  @Matches(ValidatorPatterns.Date.YYYYMMDD)
    @IsOptional()
    @ApiProperty()
    omvicLicenseExpiry: string;

    @ApiProperty()
    isLicenseInProgress: boolean;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    preferredName: string;

    @ApiProperty()
    @IsOptional()
    @Matches(ValidatorPatterns.Date.YYYYMMDD)
    birthDate: string;

    @ApiProperty({ type: UserRoleDTO, isArray: true })
    roles: UserRoleDTO[];

    @ApiProperty()
    phone: string;

    @ApiProperty()
    phoneExtension: string;

    @ApiProperty()
    isVisible: boolean;

    @ApiProperty()
    loginEnabled: boolean;

    @ApiProperty()
    skillSet: SkillSetDTO;

    @ApiProperty()
    active: boolean;

    @ApiProperty()
    dailyLimit: number;

    @ApiProperty()
    monthlyLimit: number;

    @ApiProperty()
    reportsTo: UsersDTO;


    @ApiProperty()
    assignedPhoneNumber: string;

    // @ApiProperty({ isArray: true, type: UsersDTO })
    reporters: UsersDTO[]


    @ApiProperty()
    @IsOptional()
    department: IdLookupDTO;

    @ApiProperty()
    themes: boolean;

    @ApiProperty()
    leadDetailsView: boolean;

    @ApiProperty()
    masterCalendarView: boolean;

    @ApiProperty()
    noOfRecordsShow: number;

    @ApiProperty({ enum: [LanguagePreference.EN, LanguagePreference.FR, LanguagePreference.NO_WISH], required: false })
    @IsOptional()
    @IsEnum(LanguagePreference)
    languagePreference: string;

    @ApiProperty({ enum: [DashboardView.AGENT, DashboardView.NO_WISH], required: false })
    @IsOptional()
    @IsEnum(DashboardView)
    defaultDashboardView: string;

    @ApiProperty()
    defaultNewsletter: boolean;

    @ApiProperty()
    defaultReleaseNotes: boolean;

    @ApiProperty()
    communicationEmail: string;
}

export class UsersQueryDTO {
    @ApiProperty()
    filter: UsersFilterDTO;

    @ApiProperty()
    sort: UsersFilterDTO;

    @ApiProperty()
    pagination: CorePaginationDTO;
}

export class UserImpersonationDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    dealergroupId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    dealershipId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    userId: string;
}

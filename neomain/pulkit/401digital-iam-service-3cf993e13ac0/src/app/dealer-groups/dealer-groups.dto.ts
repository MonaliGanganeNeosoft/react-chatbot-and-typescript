import { ValidationPatterns } from '@401_digital/xrm-core';
import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEmail, isEnum, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { AccountStatus } from 'src/constants';
import { CorePaginationDTO } from 'src/dto';
import { UsersDTO } from '../users/users.dto';

export class AwsDTO {
    @IsNotEmpty()
    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @IsNotEmpty()
    logo: any;
}

export class BaseDealerGroup {
    @ApiProperty()
    id: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    @Matches(ValidationPatterns.alphanumericWithSpace, { message: "invalid dealergroup name, should be alphanumeric only" })
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(AccountStatus)
    status: AccountStatus;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    addressLine1: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    addressLine2: string;

    @ApiProperty()
    @IsString()
    @IsAlpha()
    @Matches(ValidationPatterns.onlyString, { message: "invalid city, should be string" })
    city: string;

    @ApiProperty()
    @IsString()
    @Matches(ValidationPatterns.onlyString, { message: "invalid province, should be string" })
    province: string;

    @ApiProperty()
    @IsString()
    country: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Matches(ValidationPatterns.onlyNumber, { message: "logitude is numeric" })
    longitude: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Matches(ValidationPatterns.onlyNumber, { message: "latitude is numeric" })
    latitude: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Matches(ValidationPatterns.onlyNumber, { message: "phone number should contain only numbers" })
    phone: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    fax: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @Matches(ValidationPatterns.onlyString, { message: "principleFirstName should contain only characters" })
    principleFirstName: string;

    @ApiProperty()
    @IsNotEmpty()
    @Matches(ValidationPatterns.onlyString, { message: "principleLastName should contain only characters" })
    principleLastName: string;

    @ApiProperty()
    @IsNotEmpty()
    @Matches(ValidationPatterns.alphanumericWithSpace, { message: "postalCode should is alphanumeric" })
    postalCode: string;

    @ApiProperty()
    @IsOptional()
    logo: string;

    @ApiProperty()
    @IsOptional()
    domainUrl: string;    
}

export class AddDealerGroupDTO extends BaseDealerGroup {
    @IsNotEmpty()
    @ApiProperty({ type: UsersDTO })
    admin: UsersDTO;

    @IsOptional()
    @ApiProperty({ type: String })
    lenderId: string;
}

export class UpdateDealerGroupDTO extends BaseDealerGroup {
    @IsNotEmpty()
    @ApiProperty({ type: UsersDTO })
    admin: UsersDTO;

    @IsOptional()
    @ApiProperty({ type: String })
    lenderId: string;

    @IsOptional()
    @ApiProperty({ type: String })
    mappingId: string;
}

export class DealerGroupFilterDTO {
    @ApiProperty()
    @IsOptional()
    keyword: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Matches(ValidationPatterns.alphanumericWithSpace, { message: "dealergroup name should be alphanumeric" })
    name: string;

    @ApiProperty()
    @IsString()
    @Matches(ValidationPatterns.onlyNumber, { message: "phone number should contain only numbers" })
    phone: string;

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsOptional()
    @Matches(ValidationPatterns.onlyString, { message: "principal firstname should contain only characters" })
    principleFirstName: string;

    @ApiProperty()
    @IsOptional()
    @Matches(ValidationPatterns.onlyString, { message: "principal lastname should contain only characters" })
    principleLastName: string;

    @ApiProperty()
    @IsOptional()
    address: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    city: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Matches(ValidationPatterns.onlyString, { message: "province should contain only characters" })
    province: string;

    @ApiProperty()
    @IsOptional()
    @Matches(ValidationPatterns.onlyString, { message: "country should contain only characters" })
    country: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(AccountStatus)
    status: string;
}

export class DealerGroupQueryDTO {
    @ApiProperty()
    filter: DealerGroupFilterDTO;

    @ApiProperty()
    sort: DealerGroupFilterDTO;

    @ApiProperty()
    pagination: CorePaginationDTO;
}

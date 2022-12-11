import { PushNotificationDeviceTypes, ValidationPatterns } from '@401_digital/xrm-core';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches, IsBoolean } from 'class-validator';
import { v4 as uuid } from 'uuid';

export class SignOutDTO {
    @ApiProperty()
    deviceId: string;

    @ApiProperty({ enum: PushNotificationDeviceTypes })
    deviceType: PushNotificationDeviceTypes;
}

export class AuthDTO {
    @ApiProperty()
    @IsOptional()
    @Matches(ValidationPatterns.email, { message: "invalid username" })
    username: string;

    @ApiProperty()
    @IsOptional()
    password: string;

    @ApiProperty()
    @IsOptional()
    token: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    deviceId: string;

    @ApiProperty({ enum: PushNotificationDeviceTypes })
    @IsOptional()
    deviceType: PushNotificationDeviceTypes;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true, enum: ['password', 'refreshToken'] })
    grantType: 'password' | 'refreshToken';

    id: string;

    source: "dabadu-web" | "dabadu-mobile" | "zendesk"
}

export class ForgetPasswordDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    @Matches(ValidationPatterns.email, { message: "invalid username" })
    username: string;
}

export class PasswordUpdateDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    verificationId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    verificationToken: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,36}$/, { message: "password should be alphanumeric with special characters and minimum length should be 8 characters." }) // this needs to be moved in XRM
    password: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    confirmPassword: string;
}

export class VerifyPasswordUpdateRequestDTO {
    id: string;
    token: string;
}

export class TokenDTO {
    id: string;
    dealerGroup: string;
    dealership: string;
    department: string;
    hasMultipleDealerships: boolean;
    dealerships: string[];
    email: string;
    userLevel: string;
    name: string;
    profile: string;
    roles: string[];
}

export class ZendeskJWTPayload {
    iat = Date.now();
    jti: string = uuid();
    email: string;
    name: string;
    external_id: string;
    locale: string;
    locale_id: string;
    organization: string;
    organization_id: string;
    phone: string;
    remote_photo_url: string;
    role: "user" | "agent" | "admin";
    user_fields: any;
}


export class ZendeskPayloadDTO extends AuthDTO {
    brandId: string;
    localeId?: string
    locale?: string
    returnTo?: string
}


export class ResetPasswordDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,36}$/, { message: "password should be alphanumeric with special characters and minimum length should be 8 characters." }) // this needs to be moved in XRM
    password: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    confirmPassword: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isAdmin: boolean;
}

export class changePasswordDTO {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    currentPassword: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,36}$/, { message: "password should be alphanumeric with special characters and minimum length should be 8 characters." }) // this needs to be moved in XRM
    password: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    confirmPassword: string;
}
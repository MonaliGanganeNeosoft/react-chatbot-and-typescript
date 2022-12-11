/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { getRepository, ILike } from 'typeorm';
import { DealerGroupEntity } from '../dealer-groups/dealers-group.entity';
import { DealershipEntity } from '../dealership/dealership.entity';
import { DepartmentEntity } from '../departments/departments.entity';
import { UsersEntity } from '../users/users.entity';
import { AuthDTO, ForgetPasswordDTO, PasswordUpdateDTO, TokenDTO, SignOutDTO, ResetPasswordDTO, changePasswordDTO, ZendeskPayloadDTO, ZendeskJWTPayload } from './auth.dto';
import { AppException, CryproHelper, TokensHelper, PushNotificationDeviceTypes } from '@401_digital/xrm-core';
import { EmployeeEntity } from 'src/entities/employee';
import { SecurityHelper } from 'src/helpers/security';
import { Level, VerificationType, ServiceCodes } from 'src/constants';
import { VerificationEntity } from './verification.entity';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { MailHelper } from 'src/helpers/mail';
import { BASE_URL, WEB_ACCESS_TOKEN_EXPIRY, WEB_REFRESH_TOKEN_EXPIRY, APP_ACCESS_TOKEN_EXPIRY, APP_REFRESH_TOKEN_EXPIRY, ZENDESK_SECRET_KEY, ZENDESK_DABADU_DOMAIN } from '../../environment';
import { Messaging } from '../messaging/messaging.service';
import { UserRoleEntity } from '../users/user-roles.entity';
import { RoleEntity } from '../user-roles/roles.entity';
import { UserPasswordEntity } from '../auth/user-password.entity';
@Injectable()
export class AuthService {
    constructor(private mailHelper: MailHelper) { }
    async getUser(payload: AuthDTO) {
        const authRepo = getRepository(UsersEntity);
        return authRepo.findOne({
            where: {
                ...payload,
            },
            select: [
                'id',
                'dealership',
                'department',
                'dealerGroup',
                'profile',
                'password',
                'userLevel',
                'username',
                'loginEnabled',
                'requiredPasswordUpdate',
                'lastLogin',
                'updatedAt'
            ],
            relations: [
                'dealership',
                'department',
                'userRoles',
                'userRoles.role',
                'dealerGroup',
                'profile',
            ],
        });
    }

    async getUserByToken(token: string) {
        try {
            const user = TokensHelper.verifyEmployeeToken(
                CryproHelper.decrypt(token),
            ) as TokenDTO;
            return this.getUser({ id: user.id } as AuthDTO);
        } catch (error) {
            if (error.name == 'TokenExpiredError') {
                throw new UnauthorizedException(error.message);
            }
            throw error;
        }
    }

    getToken(tokenPayload: TokenDTO, expiresIn: string) {
        const jwt = TokensHelper.generateEmployeeToken(
            { ...tokenPayload },
            {
                expiresIn: Number.parseInt(expiresIn) * 60,
            },
        );
        return CryproHelper.encrypt(jwt);
    }

    async zendeskSSO(payload: ZendeskPayloadDTO) {
        const user = await this.getUserByGrantType(payload);
        const token = new ZendeskJWTPayload();
        const profile = user.profile as EmployeeEntity;
        token.email = profile.email;
        token.name = `${profile.firstName} ${profile.lastName}`;
        token.external_id = user.id;
        token.iat = (new Date().getTime() / 1000);

        if (payload.locale) {
            token.locale = payload.locale
        }

        if (payload.localeId) {
            token.locale_id = payload.localeId
        }

        if (profile.assignedPhoneNumber) {
            token.phone = profile.assignedPhoneNumber
        }

        const jwt = TokensHelper.generateTokenBySecret({ ...token }, ZENDESK_SECRET_KEY, { algorithm: "HS256" })

        let returnUrl = `${ZENDESK_DABADU_DOMAIN}/access/jwt?jwt=${jwt}`;

        if (payload.returnTo) {
            returnUrl = `${returnUrl}&return_to=${encodeURIComponent(payload.returnTo)}`
        } else {
            returnUrl = `${returnUrl}&return_to=${encodeURIComponent(`${ZENDESK_DABADU_DOMAIN}/tickets`)}`
        }

        return {
            accessToken: jwt,
            returnUrl
        }
    }

    async getUserByGrantType(payload: AuthDTO) {
        let user: UsersEntity;
        if (payload.grantType == 'password') {
            if (!payload.username || !payload.password) {
                throw new BadRequestException('username and password required');
            }
            user = await this.getUser({ username: ILike(payload.username) as any } as AuthDTO);
            if (!user) {
                AppException.create(HttpStatus.UNAUTHORIZED, 'invalid username', 'invalid_username')
            }

            if (!user.loginEnabled) {
                AppException.create(HttpStatus.UNAUTHORIZED, 'Login Disabled', 'login_disabled')
            }

            const passwordMatched = SecurityHelper.compare(payload.password, user.password);
            if (!passwordMatched) {
                AppException.create(HttpStatus.UNAUTHORIZED, 'Invalid Password', 'invalid_password');
            }
        } else if (payload.grantType == 'refreshToken') {
            if (!payload.token) {
                throw new BadRequestException('token required');
            }
            user = await this.getUserByToken(payload.token);
            if (!user) {
                throw new UnauthorizedException('Invalid Login');
            }
            if (!user.loginEnabled) {
                throw new HttpException('Login Disabled', HttpStatus.UNAUTHORIZED);
            }

            const tokenData: any = await this.getExpiryTime(payload.token)
            const passwordData = await getRepository(UserPasswordEntity).findOne({
                where: {
                    userId: user.id,
                }, order: { updatedAt: 'DESC' }
            })
            if (passwordData) {
                if (new Date(tokenData.iat * 1000) < new Date(passwordData.updatedAt)) {
                    throw new UnauthorizedException('You have recently updated your profile. Please login again.')
                }
            }

        } else {
            throw new BadRequestException('Invalid Grant Type');
        }

        return user;
    }

    async signin(payload: AuthDTO) {
        let accessTokenExpiry, refreshTokenExpiry;

        const user = await this.getUserByGrantType(payload);

        const profile = user.profile as EmployeeEntity;

        const userRoles = await getRepository(UserRoleEntity).find({
            relations: ["role", "dealership"],
            where: {
                user: user.id
            }
        });

        const roleIds = userRoles.map(e => (e.role as RoleEntity)?.id);

        /** create token */
        const tokenPayload = new TokenDTO();
        tokenPayload.id = user.id;
        tokenPayload.name = `${profile.firstName} ${profile.lastName}`;
        tokenPayload.email = user.username;
        tokenPayload.userLevel = user.userLevel;
        tokenPayload.roles = roleIds;

        if (user.userLevel == Level.DEALERGROUP) tokenPayload.dealerGroup = (user.dealerGroup as DealerGroupEntity).id;

        if (user.userLevel == Level.DEALERSHIP) {
            tokenPayload.dealerGroup = (user.dealerGroup as DealerGroupEntity).id;
            tokenPayload.dealership = (user.dealership as DealershipEntity).id;
            tokenPayload.department = (user.department as DepartmentEntity).id;
            tokenPayload.profile = profile.id;
        }

        if (payload.deviceType && (payload.deviceType.toUpperCase() == PushNotificationDeviceTypes.ANDROID || payload.deviceType.toUpperCase() == PushNotificationDeviceTypes.IOS || payload.deviceType.toUpperCase() == 'IPHONE')) {
            accessTokenExpiry = APP_ACCESS_TOKEN_EXPIRY;
            refreshTokenExpiry = APP_REFRESH_TOKEN_EXPIRY;
        }
        else {
            accessTokenExpiry = WEB_ACCESS_TOKEN_EXPIRY
            refreshTokenExpiry = WEB_REFRESH_TOKEN_EXPIRY
        }

        const accessToken = this.getToken(tokenPayload, accessTokenExpiry);

        getRepository(UsersEntity).update({ id: user.id }, { lastLogin: new Date() });

        if (payload.deviceId && payload.deviceType) {
            const userRolesArray = userRoles.map((e) => {
                const role = e.role as RoleEntity;
                const dealership = e.role as RoleEntity;
                return {
                    dealership: dealership ? dealership.id : null,
                    user: user.id,
                    role: role.id,
                }
            })
            const user_name = `${profile.firstName} ${profile.lastName}`
            Messaging.communicationSettings({
                userId: user.id,
                userType: "staff",
                userName: user_name,
                deviceId: payload.deviceId,
                deviceType: payload.deviceType,
                dealerGroup: tokenPayload.dealerGroup,
                dealership: tokenPayload.dealership ? tokenPayload.dealership : null,
                userRolesArray,
                userLevel: user.userLevel,
                assignedPhoneNumber: profile.assignedPhoneNumber
            }).then(() => {
                console.log("communication sync done");
            }).catch((error) => {
                console.error(error);
            })
        }

        return {
            accessToken,
            refreshToken:
                payload.grantType == 'password'
                    ? this.getToken(tokenPayload, refreshTokenExpiry)
                    : payload.token,
            expiresIn: Number.parseInt(accessTokenExpiry),
            expiresUnit: 'minutes',
            requiredPasswordUpdate: user.requiredPasswordUpdate || false
        };
    }

    async forgetPassword(dto: ForgetPasswordDTO) {
        const user = await getRepository(UsersEntity).findOne({
            where: {
                username: dto.username,
            }, relations: [
                'profile',
            ]
        });
        if (!user) {
            throw new UnauthorizedException('User Not Found');
        }

        let verification = new VerificationEntity();
        verification.type = VerificationType.FORGET_PASSWORD;
        verification.userId = user.id;
        verification.expiry = moment(new Date()).add(1, 'days').toDate();
        verification.token = uuid();

        verification = await getRepository(VerificationEntity).save(verification);
        const profile = user.profile as EmployeeEntity;

        this.mailHelper
            .sendPasswordResetEmail({
                to: user.username,
                name: `${profile.firstName} ${profile.lastName}`,
                url: `${BASE_URL}/update-password?token=${verification.token}&id=${verification.id}`,
            })

        return verification;
    }

    async passwordUpdate(dto: PasswordUpdateDTO) {
        const verificationRepo = getRepository(VerificationEntity);
        const verification = await verificationRepo.findOne({
            where: { id: dto.verificationId, type: VerificationType.FORGET_PASSWORD },
        });
        if (!verification) {
            throw new BadRequestException('Invalid Request');
        }
        if (verification && new Date(verification.expiry) < new Date()) {
            throw new BadRequestException('Invalid Request: Token Expired');
        }
        if (verification && verification.token != dto.verificationToken) {
            throw new UnauthorizedException('Invalid Token');
        }
        const userData = await getRepository(UsersEntity).findOne({
            where: {
                id: verification.userId
            },
            relations: ['profile']
        });
        const employee = userData.profile as EmployeeEntity;

        this.passwordChecker(dto.password, dto.confirmPassword, employee.firstName, employee.lastName) // password validation checks

        const newPassword = SecurityHelper.getHash(dto.password)
        const user = await getRepository(UsersEntity).update(
            { id: verification.userId },
            { password: newPassword, requiredPasswordUpdate: true, passwordExpiryDate: moment().add(180, 'd').toDate() },
        ); // Updating the Password

        await getRepository(UserPasswordEntity).save({ userId: verification.userId, password: newPassword });

        await verificationRepo.delete({
            userId: verification.userId,
            type: VerificationType.FORGET_PASSWORD,
        });
        return user;
    }

    async signout(authorization: string, dto: SignOutDTO) {
        const token = CryproHelper.decrypt(TokensHelper.getToken(authorization));
        const user = TokensHelper.decodeToken(token) as any;
        const payload = {
            userId: user.id,
            userType: "staff",
            deviceId: dto.deviceId,
            deviceType: dto.deviceType
        }
        Messaging.removeDeviceId(payload);
    }

    async firstResetPassword(user: TokenDTO, dto: ResetPasswordDTO) {
        let userId, requiredPasswordUpdate;
        if (dto.isAdmin && dto.userId) {
            userId = dto.userId;
            requiredPasswordUpdate = false;
        } else {
            userId = user.id;
            requiredPasswordUpdate = true;
        }
        const userData = await getRepository(UsersEntity).findOne({
            where: {
                id: userId
            },
            relations: ['profile']
        });

        if (!dto.isAdmin && userData.requiredPasswordUpdate) {
            throw new BadRequestException('Password has been already updated');
        }

        const employee = userData.profile as EmployeeEntity;

        this.passwordChecker(dto.password, dto.confirmPassword, employee.firstName, employee.lastName) // password validation checks

        const newPassword = SecurityHelper.getHash(dto.password)
        const result = await getRepository(UsersEntity).update(
            { id: userId },
            { password: newPassword, requiredPasswordUpdate, passwordExpiryDate: moment().add(180, 'd').toDate() }
        );
        if (!dto.isAdmin) {
            await getRepository(UserPasswordEntity).save({ userId: user.id, password: newPassword })
        } else {
            this.mailHelper
                .sendManualPasswordEmail({
                    to: userData.username,
                    password: dto.password,
                    name: `${employee.firstName} ${employee.lastName}`
                })
        }

        return result;
    }

    async changePassword(user: TokenDTO, dto: changePasswordDTO) {
        const userData = await getRepository(UsersEntity).findOne({
            where: {
                id: user.id
            },
            select: [
                'id',
                'password',

            ],
            relations: ['profile']
        });
        const employee = userData.profile as EmployeeEntity;

        const passwordMatched = SecurityHelper.compare(dto.currentPassword, userData.password);
        if (!passwordMatched) {
            throw new UnauthorizedException('Current password is incorrect');
        }
        if (dto.password === dto.currentPassword) {
            throw new UnauthorizedException('Current password is same as old password.');
        }

        this.passwordChecker(dto.password, dto.confirmPassword, employee.firstName, employee.lastName) // password validation checks

        const lastPasswords = await this.checkLastFivePasswords(user.id, dto.password)
        const newPassword = SecurityHelper.getHash(dto.password)
        const result = await getRepository(UsersEntity).update(
            { id: user.id },
            { password: newPassword, passwordExpiryDate: moment().add(180, 'd').toDate() }
        );
        if (result) {
            if (lastPasswords && lastPasswords.length === 5)
                await getRepository(UserPasswordEntity).delete(lastPasswords[lastPasswords.length - 1].id);

            await getRepository(UserPasswordEntity).save({ userId: user.id, password: newPassword });
        }
        return result;
    }

    checkNameinPassword(name, password) {
        return password.toLowerCase().match(/[a-z]+/ig).filter(a => a.length > 3 && name.toLowerCase().includes(a)).length > 0 ? true : false;
    }

    checkSequentialCharacters(password) {
        // Check for sequential numerical characters
        for (var i in password)
            if (+password[+i + 1] == +password[i] + 1 &&
                +password[+i + 2] == +password[i] + 2) return false;
        // Check for sequential alphabetical characters
        for (var i in password)
            if (String.fromCharCode(password.charCodeAt(i) + 1) == password[+i + 1] &&
                String.fromCharCode(password.charCodeAt(i) + 2) == password[+i + 2]) return false;
        return true;
    }

    passwordChecker(password, confirmPassword, firstName, lastName) {

        if (this.checkNameinPassword(firstName, password) || this.checkNameinPassword(lastName, password)) {
            throw new BadRequestException('Password should not contain your first name and last name.');
        }
        if (!this.checkSequentialCharacters(password)) {
            throw new BadRequestException('Password cannot contain 3 sequential characters in a row.');
        }
        if (password !== confirmPassword) {
            throw new UnauthorizedException('Password doesn\'t match with confirm password');
        }
    }

    async checkLastFivePasswords(userId, password) {
        const lastPasswords = await getRepository(UserPasswordEntity).find({
            where: {
                userId
            }, order: {
                updatedAt: 'DESC'
            }
        })
        const found = lastPasswords.find(e => SecurityHelper.compare(password, e.password))
        if (found) {
            throw new UnauthorizedException('Password should not match with last 5 passwords');
        }
        return lastPasswords;
    }

    async getExpiryTime(token) {
        const tokenData = TokensHelper.verifyEmployeeToken(
            CryproHelper.decrypt(token),
        );
        return tokenData;
    }
}

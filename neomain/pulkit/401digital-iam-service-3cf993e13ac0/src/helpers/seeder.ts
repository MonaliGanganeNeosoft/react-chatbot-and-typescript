import { Level } from "@401_digital/xrm-core";
import { DefaultLeadManager, DefaultProvince, DefaultSystemAdminRole, DefaultSystemUser, GeneralManagerRole, LeadManagerRole } from "@config";
import { Logger } from "@nestjs/common";
import { ProvinceEntity } from "src/app/public/public-province.entity";
import { PermissionsEntity } from "src/app/user-roles/permission.entity";
import { RoleEntity } from "src/app/user-roles/roles.entity";
import { UserRoleEntity } from "src/app/users/user-roles.entity";
import { UsersEntity } from "src/app/users/users.entity";
import { EmployeeEntity } from "src/entities/employee";
import { getRepository } from "typeorm";
import { SecurityHelper } from "./security";
import { InternalHelper } from 'src/helpers/internal';
export class Seeder {
    private static logger = new Logger(Seeder.name);

    public static async init() {
        await this.setSystemAdmin();
        await this.setLeadManager();
        // await this.setGeneralManager();
        await this.setProvince();
    }

    public static async setGeneralManager() {
        const roleRepo = getRepository(RoleEntity);
        const gm = await roleRepo.findOne({
            level: Level.DEALERSHIP,
            isGM: true,
            name: GeneralManagerRole.name,
        });
        if (!gm) {
            const roleEntity = new RoleEntity();
            roleEntity.name = GeneralManagerRole.name;
            roleEntity.level = Level.ROOT;
            roleEntity.isDefault = true;
            roleEntity.isGM = true;
            roleEntity.active = true;
            roleEntity.permissions = GeneralManagerRole.permissions.map((p) =>
                Object.assign(new PermissionsEntity(), p),
            );
            await roleRepo.save(roleEntity);
        }
    }

    public static async setLeadManager() {

        const roleRepo = getRepository(RoleEntity), userRepo = getRepository(UsersEntity);
        let lmRole = await roleRepo.findOne({ level: Level.ROOT, isDefault: true, name: LeadManagerRole.name });

        if (!lmRole) {
            const roleEntity = new RoleEntity();
            roleEntity.name = LeadManagerRole.name;
            roleEntity.level = Level.ROOT;
            roleEntity.isDefault = true;
            roleEntity.active = true;
            roleEntity.permissions = LeadManagerRole.permissions.map((p) =>
                Object.assign(new PermissionsEntity(), p),
            );
            lmRole = await roleRepo.save(roleEntity);
        }
        const lmProfile = DefaultLeadManager.profile as EmployeeEntity;

        let leadManager = await userRepo.findOne({ username: lmProfile.email, userLevel: Level.ROOT, isDefault: true });

        if (!leadManager) {
            const profileRepo = getRepository(EmployeeEntity);
            let profile = await profileRepo.findOne({ email: lmProfile.email });
            let profileId: string;

            if (profile) {
                profileId = profile.id;
                await profileRepo.update({ id: profile.id }, { isEnrolled: true });
            } else {
                profile = await profileRepo.save(DefaultLeadManager.profile as any);
                profileId = profile.id;
            }
            const user = await userRepo.save({
                password: SecurityHelper.getHash(DefaultLeadManager.password),
                profile: profileId,
                userLevel: Level.ROOT,
                username: lmProfile.email,
                isDefault: true
            });

            await getRepository(UserRoleEntity).save({ dealership: null, role: lmRole.id, user: user.id });
            const splittedName = LeadManagerRole.name.split(" ")
            const lmData = {
                userLevel: Level.ROOT,
                uniqueId: user.id,
                email: lmProfile.email,
                firstName: splittedName[0],
                lastName: splittedName[1],
                roles: [lmRole.id]
            }
            InternalHelper.setupLeadforLM(lmData)
            InternalHelper.setupMessaging(user, [{ dealership: null, role: lmRole.id, user: user.id }]);
        }
        this.logger.log("Lead Manager Configured");
    }

    public static async setProvince() {
        const province = getRepository(ProvinceEntity);
        await province
            .createQueryBuilder()
            .insert()
            .values(DefaultProvince)
            .onConflict('("code") DO NOTHING')
            .execute();
    }

    public static async setSystemAdmin() {
        const rolesRepo = getRepository(RoleEntity), userRepo = getRepository(UsersEntity);

        let rootRole = await rolesRepo.findOne({ name: DefaultSystemAdminRole.name, level: Level.ROOT, isDefault: true });
        if (!rootRole) rootRole = await rolesRepo.save(DefaultSystemAdminRole);
        const email = (DefaultSystemUser.profile as EmployeeEntity).email;
        const rootUser = await userRepo.findOne({ username: email });
        if (!rootUser) {
            const profileRepo = getRepository(EmployeeEntity);
            let profile = await profileRepo.findOne({ email: DefaultSystemUser.username });
            let profileId: string;

            if (profile) {
                profileId = profile.id;
                await profileRepo.update({ id: profile.id }, { isEnrolled: true });
            } else {
                profile = await profileRepo.save(DefaultSystemUser.profile as any);
                profileId = profile.id;
            }
            const user = await userRepo.save({
                dealerGroup: null,
                dealership: null,
                department: null,
                password: SecurityHelper.getHash(DefaultSystemUser.password),
                profile: profileId,
                userLevel: Level.ROOT,
                username: email,
                isDefault: true,
                loginEnabled: true,
            });

            await getRepository(UserRoleEntity).save({ dealership: null, role: rootRole.id, user: user.id });
        }
        this.logger.log('System Admin Role Configured');
    }
}
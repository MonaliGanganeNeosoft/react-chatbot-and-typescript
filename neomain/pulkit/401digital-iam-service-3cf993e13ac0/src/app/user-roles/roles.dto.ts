import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Level } from 'src/constants';
import { CorePaginationDTO, IdLookupDTO } from 'src/dto';

export class DealershipRoleDTO {
    @ApiProperty()
    dealerGroupId: string;

    @ApiProperty({ isArray: true, type: String })
    dealerships: string[]
}

export class PermissionsDTO {
    @ApiProperty()
    serviceType: string;

    @ApiProperty()
    canRead: boolean;

    @ApiProperty()
    canWrite: boolean;

    @ApiProperty()
    canUpdate: boolean;

    @ApiProperty()
    canDelete: boolean;

    // @ApiProperty()
    role: string;
    serviceName: string;
}

// export class RoleDealershipDTO {
//     role: string;
//     createdAt: Date;

//     @ApiProperty()
//     dealerGroup: string;

//     @ApiProperty()
//     dealership: string;
// }

export class RoleModules {
    @ApiProperty()
    name: string;

    @ApiProperty()
    code: string;

    @ApiProperty({ isArray: true, type: PermissionsDTO })
    services: PermissionsDTO[];

    @ApiProperty()
    isEnabled: boolean;
}

export class FormatRoleDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(Level)
    level: Level;

    name: string;
    copiedFrom: string;

    @ApiProperty({ isArray: true, type: DealershipRoleDTO })
    dealerships: DealershipRoleDTO[];

    @ApiProperty()
    isGm: boolean;
}

export class AddRoleDTO {
    @ApiProperty()
    id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    active: boolean;

    @ApiProperty()
    canReceiveLeads: boolean;

    @ApiProperty()
    isGM: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(Level)
    level: Level;

    @ApiProperty({ isArray: true, type: DealershipRoleDTO })
    dealerships: DealershipRoleDTO[];

    @ApiProperty({ isArray: true, type: RoleModules })
    @IsArray()
    @IsNotEmpty()
    modules: RoleModules[];
}

export class RoleDTO {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    active: boolean;

    @ApiProperty()
    level: Level;

    @ApiProperty({ isArray: true, type: DealershipRoleDTO })
    dealerships: DealershipRoleDTO[];

    @ApiProperty({ type: RoleModules, isArray: true })
    modules: RoleModules[];

    @ApiProperty()
    isDefault: Boolean;

    @ApiProperty()
    canReceiveLeads: boolean;

    @ApiProperty()
    isGM: boolean;
}

export class RolesFilterDTO {
    @ApiProperty()
    dealershipId: string;
    @ApiProperty()
    dealerGroupId: string;
    @ApiProperty()
    dealershipName: string;
    @ApiProperty()
    dealerGroupName: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    active: boolean;
    @ApiProperty()
    level: Level;
}

export class RolesSortDTO {
    @ApiProperty()
    roleName: string;

    @ApiProperty()
    userCount: number;
}

export class RolesQueryDTO {
    @ApiProperty()
    filter: RolesFilterDTO;

    @ApiProperty()
    sort: RolesSortDTO;

    @ApiProperty()
    pagination: CorePaginationDTO;
}

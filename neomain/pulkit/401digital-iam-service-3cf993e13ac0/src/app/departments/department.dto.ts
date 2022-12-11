import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { CorePaginationDTO } from 'src/dto';

export class AddDepartmentDTO {
    @ApiProperty()
    id: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string;

    @ApiProperty()
    dealerGroup: string;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty()
    active: boolean;
}

export class UpdateDepartmentDTO {
    id: string;
    @ApiProperty()
    name: string;

    @ApiProperty()
    active: boolean;
}

export class DepartmentSortDTO {
    @ApiProperty()
    name: string;

    @ApiProperty()
    userCount: number;
}

export class DepartmentFilterDTO {
    @ApiProperty()
    id: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string;

    @ApiProperty()
    dealerGroup: string;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty()
    active: boolean;

    @ApiProperty({ type: String, isArray: true })
    dealerGroupIds: string[];
}

export class DepartmentQueryDTO {
    @ApiProperty()
    filter: AddDepartmentDTO;

    @ApiProperty()
    sort: DepartmentSortDTO;

    @ApiProperty()
    pagination: CorePaginationDTO;
}

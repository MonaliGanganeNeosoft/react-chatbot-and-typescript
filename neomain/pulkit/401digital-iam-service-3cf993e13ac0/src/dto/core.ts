import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsUUID } from 'class-validator';

export class CorePaginationDTO {
    @ApiProperty()
    limit: number;

    @ApiProperty()
    page: number;
}

export class IdLookupDTO {
    @ApiProperty()
    @IsUUID()
    @IsOptional()
    id: string;
}

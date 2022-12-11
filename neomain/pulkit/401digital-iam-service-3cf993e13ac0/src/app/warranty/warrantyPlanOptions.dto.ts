import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class WarrantyPlanOptionsDTO {
    @IsNotEmpty()
    @ApiProperty({ example: 'Audi' })
    @IsString()
    make: string;
}

export class WarrantyPlanConditionDTO {
    @IsNotEmpty()
    @ApiProperty({ example: 'Audi' })
    @IsString()
    make: string;
    @IsNotEmpty()
    @ApiProperty({ example: 2010 })
    @IsString()
    year: number;
    @IsNotEmpty()
    @ApiProperty({ example: 179999 })
    @IsString()
    odometer: number;
}
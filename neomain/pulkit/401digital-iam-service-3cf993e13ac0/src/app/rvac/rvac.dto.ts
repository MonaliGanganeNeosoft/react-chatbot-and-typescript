import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RvacDTO {
    @IsNotEmpty()
    @ApiProperty({ example: 'Gold' })
    @IsString()
    type: string;
    @IsNotEmpty()
    @ApiProperty({ example: 2011 })
    @IsString()
    year: number;
    @IsNotEmpty()
    @ApiProperty({ example: 1 })
    @IsString()
    deductable_type: number;
}
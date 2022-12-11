import { ApiPropertyOptional, ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNotEmpty, IsString } from "class-validator";

export class PaginationDTO {
  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  limit?: number;
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  currentPage?: number;
  @ApiHideProperty()
  totalRecordCount?: number;
}
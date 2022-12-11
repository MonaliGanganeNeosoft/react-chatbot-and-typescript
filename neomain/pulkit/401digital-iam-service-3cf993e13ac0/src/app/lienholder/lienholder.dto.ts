import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsNotEmpty, IsBoolean } from 'class-validator';
import { CorePaginationDTO } from 'src/dto/core';

export class AddLienholderDTO {
  @ApiProperty()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsString()
  addressLine1: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  addressLine2: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  province: string;

  @ApiProperty()
  @IsString()
  postalCode: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  active: boolean;
}

export class LienholderFilterDTO {
  @ApiProperty()
  companyName: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  keyword: string;

  @ApiProperty()
  active: boolean;
}

export class LienholderQueryDTO {
  @ApiProperty()
  filter: LienholderFilterDTO;

  @ApiProperty()
  sort: LienholderFilterDTO;

  @ApiProperty()
  pagination: CorePaginationDTO;
}
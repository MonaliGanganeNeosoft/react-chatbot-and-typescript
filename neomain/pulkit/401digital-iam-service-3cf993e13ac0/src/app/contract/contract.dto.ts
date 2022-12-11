import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger/dist/decorators";
import { IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export enum ContractStatusEnum {
    Draft,
    Void,
    Unsigned,
    Signed,
    Expired
}

export enum ContractTypeEnum {
    nationall,
    allaround,
    maintenance
}

export class AddContractDTO{

    @ApiProperty({example:1})
    @IsNumber()
    userId: number;

    @ApiProperty({example:1})
    @IsNumber()
    dealerId: number;
    
    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    telephone: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    workTelephone: string;

    @ApiProperty()
    @IsString()
    streetAddress: string;

    @ApiProperty()
    @IsString()
    city: string;

    @ApiProperty()
    @IsString()
    province: string;

    @ApiProperty()
    @IsString()
    postalCode: string;

    @ApiProperty({required:false})
    @IsString()
    taxExemptStatusCardNum: string;

    @ApiProperty()
    @IsString()
    coContractHolderFirstName: string;

    @ApiProperty()
    @IsString()
    coContractHolderLastName: string;

    @ApiProperty()
    @IsString()
    coContractHolderTelephone: string;

    @ApiHideProperty()
    @IsString()
    @IsOptional()
    unitYear: string;

    @ApiHideProperty()
    @IsString()
    @IsOptional()
    unitMake: string;

    @ApiHideProperty()
    @IsString()
    @IsOptional()
    unitModel: string;

    @ApiHideProperty()
    @IsString()
    @IsOptional()
    unitOdometer: string;

    @ApiProperty()
    @IsString()
    unitPrice: string;

    @ApiProperty({example:'1C6RR7GT3DS660394'})
    @IsString()
    unitVinNumber: string;

    @ApiProperty({example:'2020-03-27'})
    @IsString()
    unitPurchaseDate: string;

    @ApiProperty()
    @IsString()
    unitPurchasePrice: string;

    @ApiProperty({example:'2020-03-27'})
    @IsString()
    unitContractExpiryDate: string;

    @ApiProperty()
    @IsString()
    lienholderFirstName: string;

    @ApiProperty()
    @IsString()
    lienholderLastName: string;

    @ApiProperty()
    @IsString()
    lienholderStreetAddress: string;

    @ApiProperty()
    @IsString()
    lienholderCity: string;

    @ApiProperty()
    @IsString()
    lienholderProvince: string;

    @ApiProperty()
    @IsString()
    contractNumber: string;

    @IsEnum(ContractTypeEnum)
    @ApiProperty({ example:'nationall' })
    @IsString()
    contractType: string;

    @ApiProperty()
    @IsString()
    totalPrice: string;

    @ApiProperty()
    @IsString()
    warrantyPrice: string;

    @ApiProperty({example:1})
    @IsNumber()
    @IsOptional()
    warrantyPlanId: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    contractDate: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    inServiceDate: string;

    @ApiProperty()
    @IsString()
    coverageBeginsDate: string;

    @ApiProperty()
    @IsString()
    unitStockNumber: string;

    @IsString()
    @ApiProperty({ example:'New',enum: ['New','Pre-Owned'] })
    vehicleAge: string;

    @ApiProperty({example:'Electronic Rust Module;Undercoating Applied'})
    @IsString()
    serviceDetails: string;

    @ApiProperty()
    @IsNumber()
    baseFee: number;

    @ApiProperty()
    @IsNumber()
    warrantyFee: number;

    @ApiProperty()
    @IsString()
    warranty_service: string;

    @ApiProperty()
    @IsNumber()
    optionPrice: number;

    @IsEnum(ContractStatusEnum)
    @ApiProperty({ example:'Draft',enum: ['Draft','Void','Unsigned','Signed','Expired'] })
    status: string;
}

export class ContractCostDTO{
    @ApiProperty({example:1})
    @IsNumber()
    taxExempt: number;

    @ApiProperty({example:"100"})
    @IsNumber()
    baseFee: string;
}

export class ContractStatusDTO{
    @IsEnum(ContractStatusEnum)
    @ApiProperty({ example:'Draft',enum: ['Draft','Void','Unsigned','Signed','Expired'] })
    @IsString()
    status: string;
}
export class ContractFilterDTO{
    @ApiProperty({  required:false})
    @IsString()
    @IsOptional()
    firstName: string;

    @ApiProperty({ required:false})
    @IsString()
    @IsOptional()
    lastName: string;

    @ApiProperty({ required:false})
    @IsString()
    @IsOptional()
    vinNumber: string;

    @ApiProperty({ required:false})
    @IsString()
    @IsOptional()
    contractNumber: string;

    @ApiProperty({ required:false})
    @IsOptional()
    @IsString()
    userId: string;

    @ApiProperty({ example:'2020-03-27 05:30:00', required:false})
    @IsOptional()
    @IsString()
    startDate: string;

    @ApiProperty({ example:'2020-03-27 05:30:00', required:false})
    @IsString()
    @IsOptional()
    endDate: string;

    @ApiProperty({ example:'All', required:false})
    @IsString()
    @IsOptional()
    type: string;

    @IsEnum(ContractStatusEnum)
    @ApiProperty({ required:false,example:'Draft',enum: ['Draft','Void','Unsigned','Signed','Expired'] })
    @IsString()
    @IsOptional()
    status: string;

    @ApiProperty({ example:'All', required:false})
    @IsString()
    @IsOptional()
    dealer: string

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    limit?: number;
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    currentPage?: number;
    @ApiHideProperty()
    totalRecordCount?: number;
}
export class ContractReportFilterDTO{

    @ApiProperty({ example:'csv',enum: ['csv','pdf']})
    @IsString()
    @IsNotEmpty()
    reportType: string;

    @ApiProperty({ example:'2020-03-27 05:30:00', required:false})
    @IsOptional()
    @IsString()
    startDate: string;

    @ApiProperty({ example:'2020-03-27 05:30:00', required:false})
    @IsString()
    @IsOptional()
    endDate: string;

    @ApiProperty({ example:'All', required:false})
    @IsString()
    @IsOptional()
    type: string;

    @IsEnum(ContractStatusEnum)
    @ApiProperty({ example:'Draft',enum: ['Draft','Void','Unsigned','Signed','Expired'] })
    @IsString()
    status: string;

    @ApiProperty({ example:'All', required:false})
    @IsString()
    @IsOptional()
    dealer: string
}



import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddDmsDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dmsName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dmsNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dmsType: string;
}

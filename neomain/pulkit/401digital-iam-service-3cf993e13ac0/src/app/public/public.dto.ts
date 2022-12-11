import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PublicContactDTO {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(500)
  message: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  locationName: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PhoneDTO {
  @IsNotEmpty()
  @ApiProperty({ example: '12345' })
  @IsString()
  clid: string;
  @IsNotEmpty()
  @ApiProperty({ example: 'incoming' })
  @IsString()
  flow: string;
  @IsNotEmpty()
  @ApiProperty({ example: 'hghjsd7' })
  @IsString()
  id: string;
  @IsNotEmpty()
  @ApiProperty({ example: '7678644785' })
  @IsString()
  start: string;
  @IsNotEmpty()
  @ApiProperty({ example: 'missed' })
  @IsString()
  status: string;
  @IsNotEmpty()
  @ApiProperty({ example: '5227892749' })
  @IsString()
  stop: string;
  @IsNotEmpty()
  @ApiProperty({ example: '12355@dfvs.com' })
  @IsString()
  uri: string;
}

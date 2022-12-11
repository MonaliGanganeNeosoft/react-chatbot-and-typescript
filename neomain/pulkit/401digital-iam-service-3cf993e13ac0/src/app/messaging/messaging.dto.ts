import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MessagingDTO {
  @ApiProperty({ example: '12345' })
  @IsString()
  leadId: string;
  @ApiProperty({ example: 'Hello' })
  @IsString()
  leadName: string;
  @IsNotEmpty()
  @ApiProperty({ example: '91xxxxxxxx' })
  @IsString()
  toNumber: string;
  @IsNotEmpty()
  @ApiProperty({ example: 'Hello' })
  @IsString()
  content: string;
}

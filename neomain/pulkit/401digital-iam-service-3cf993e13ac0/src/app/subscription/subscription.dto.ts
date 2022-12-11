import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionDTO {
  @ApiProperty({ type: String })
  email: string;
}

export class ContactListDTO {
  @ApiProperty({ type: String })
  name: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class EmployeeDTO {
  @ApiProperty()
  Id: string;
  EmployeeId: string;
  SerialNumber: string;
  UserName: string;
  @ApiProperty()
  FirstName: string;
  LastName: string;
  EmailAddress: string;
  Sales: boolean;
  SalesmanNumber: string;
  SalesRole: string;
  FixedOps: boolean;
  FixedOpsEmployeeNumber: string;
  FixedOpsRole: string;
  Technician: boolean;
  TechnicianNumber: string;
  ManufacturerID: string;
  DefaultShop: string;
  LastUpdate: string;
  Phone: string;
  PhoneExtension: string;
  CallTrakPin: string;
  IsInactive: boolean;
  IsConnectEnabled: boolean;
  IsDocSigningEnabled: boolean;
  IsShuttleDriver: boolean;
  IsMobileServiceArrival: boolean;
  MobileServiceArrivalAccess: number;
  IsVisible: boolean;
}

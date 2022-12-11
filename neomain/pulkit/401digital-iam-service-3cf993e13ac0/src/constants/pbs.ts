import { SerialNumbers } from '@401_digital/xrm-core';

export enum ServiceTypes {
  ContactVehicleGet = 'ContactVehicleGet',
  EmployeeGet = 'EmployeeGet',
}

export const DefaultSchedulerCycles = Object.values(SerialNumbers).map(
  (serial) => ({
    serviceType: ServiceTypes.EmployeeGet,
    serialNumber: serial,
    duration: 0,
    durationUnit: 'days',
    lastCycle: new Date('2010-01-01T00:00:00.0000000Z'),
    enableRead: serial === SerialNumbers.Cambridge,
  }),
);

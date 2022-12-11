// /* eslint-disable prettier/prettier */
// import { Injectable, Logger } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
// import { getRepository } from 'typeorm';
// import { CustomerEntity } from 'src/entities/customers';
// import { PbsCustomersDTO } from 'src/dto';
// import { ServiceTypes } from 'src/constants';
// import { PbsHelpers } from 'src/helpers/pbs-helper';
// import { BaseScheduler } from './base';
// import { SerialNumbers } from '@401_digital/xrm-core';

// @Injectable()
// export class CustomerScheduler extends BaseScheduler<PbsCustomersDTO, CustomerEntity> {
//   private readonly logger = new Logger(CustomerScheduler.name);
//   constructor(private pbsHelper: PbsHelpers) {
//     super();
//   }

//   @Cron('*/10 * * * *', { name: 'customers' })
//   handleCron() {
//     const dealers = [SerialNumbers.Cambridge, SerialNumbers.Barrie];
//     this.schedulerLogger.startTime = new Date();
//     this.schedulerLogger.serviceType = ServiceTypes.ContactVehicleGet;
//     this.pbsHelper.getRecordsFromPBS({ instances: dealers, resultKey: "Items", serviceType: ServiceTypes.ContactVehicleGet, pbsApi: '/json/reply/ContactVehicleGet' }).then((data) => {
//       this.schedulerLogger.pbsReadTime = new Date();
//       this.dbPerformer(data.records, data.commands);
//     })
//   }

//   async dbPerformer(Items: any[], commands?: any[]) {
//     try {
//       this.logger.log(`Total record length ${Items.length}`);
//       if (Items && Items.length) {
//         const chunkSize = 500;
//         let chunk = chunkSize, index = 0;
//         while (index <= Items.length) {
//           const chunkList = Items.slice(index, chunk) as PbsCustomersDTO[];
//           if (chunkList.length) {
//             this.logger.log(`Processing Chunk From : ${index} To : ${chunk}`);
//             const contacts = chunkList
//               .sort((a, b) => {
//                 if (new Date(a.ContactLastUpdate) > new Date(b.ContactLastUpdate)) {
//                   return -1
//                 }
//                 return 1;
//               })
//               .filter((p, index) => chunkList.findIndex(q => q.ContactId == p.ContactId) == index)
//               .map((pbsCustomer) => this.toEntity(pbsCustomer));
//             this.logger.log(`Valid Records ${contacts.length}`)
//             if (contacts && contacts.length) {
//               const contactRepo = getRepository(CustomerEntity);
//               const dontUpdate = ['id', 'created_at'];
//               const keys = contactRepo.metadata.ownColumns.map(column => column.databaseName).filter(key => !dontUpdate.includes(key));
//               const updateStr = keys.map(key => `"${key}" = EXCLUDED."${key}"`).join(",");
//               await contactRepo
//                 .createQueryBuilder()
//                 .insert()
//                 .values(contacts)
//                 .onConflict(`ON CONSTRAINT uk_customers DO UPDATE SET ${updateStr} WHERE customers.last_pbs_update <= EXCLUDED.last_pbs_update`)
//                 .execute();
//             }
//             index = chunk;
//             chunk = chunk + chunkSize;
//           }
//         }
//       }
//       this.logger.log("Cron Job Complete")
//       this.schedulerLogger.endTime = new Date();
//       await Promise.all([this.updateCycles(commands), this.createLog(this.schedulerLogger)]);
//     } catch (error) {
//       this.schedulerLogger.endTime = new Date();
//       this.schedulerLogger.success = false;
//       this.schedulerLogger.error = error.message;
//       await this.createLog(this.schedulerLogger);
//     }
//   }

//   toEntity(pbsCustomer: PbsCustomersDTO) {
//     const customer = new CustomerEntity();
//     customer.ContactId = pbsCustomer.ContactId;
//     customer.SerialNumber = pbsCustomer.SerialNumber;
//     customer.ContactCode = pbsCustomer.ContactCode;
//     customer.HubContactId = pbsCustomer.HubContactId;
//     customer.FirstName = pbsCustomer.ContactFirstName;
//     customer.MiddleName = pbsCustomer.ContactMiddleName;
//     customer.LastName = pbsCustomer.ContactLastName;
//     customer.Salutation = pbsCustomer.ContactSalutation;
//     customer.EmailAddress = pbsCustomer.ContactEmailAddress;
//     customer.IsInactive = pbsCustomer.ContactIsInactive;
//     customer.IsBusiness = pbsCustomer.ContactIsBusiness;
//     customer.ApartmentNumber = pbsCustomer.ContactApartmentNumber;
//     customer.Address = pbsCustomer.ContactAddress;
//     customer.City = pbsCustomer.ContactCity;
//     customer.State = pbsCustomer.ContactState;
//     customer.County = pbsCustomer.ContactCounty;
//     customer.ZipCode = pbsCustomer.ContactZipCode;
//     customer.CellPhone = pbsCustomer.ContactCellPhone;
//     customer.HomePhone = pbsCustomer.ContactHomePhone;
//     customer.BusinessPhone = pbsCustomer.ContactBusinessPhone;
//     customer.FaxNumber = pbsCustomer.ContactFaxNumber;
//     customer.Notes = pbsCustomer.ContactNotes;
//     customer.CriticalMemo = pbsCustomer.ContactCriticalMemo;
//     customer.EmailCommunication = pbsCustomer.ContactCommunicationPreferences.Email;
//     customer.PhoneCommunication = pbsCustomer.ContactCommunicationPreferences.Phone;
//     customer.LetterCommunication = pbsCustomer.ContactCommunicationPreferences.Letter;
//     customer.TextMessageCommunication = pbsCustomer.ContactCommunicationPreferences.TextMessage;
//     customer.PreferredCommunication = pbsCustomer.ContactCommunicationPreferences.Preferred;
//     customer.PBSLastUpdate = pbsCustomer.ContactLastUpdate;
//     return customer;
//   }
// }

export class PbsCustomersDTO {
  HubContactId: string;
  ContactId: string;
  ContactCode: string;
  ContactLastName: string;
  ContactFirstName: string;
  ContactSalutation: string;
  ContactMiddleName: string;
  ContactIsInactive: false;
  ContactIsBusiness: false;
  ContactApartmentNumber: string;
  ContactAddress: string;
  ContactCity: string;
  ContactCounty: string;
  ContactState: string;
  SerialNumber: string;
  ContactZipCode: string;
  ContactBusinessPhone: string;
  ContactHomePhone: string;
  ContactCellPhone: string;
  ContactFaxNumber: string;
  ContactEmailAddress: string;
  ContactNotes: string;
  ContactCriticalMemo: string;
  ContactCommunicationPreferences: {
    Email: string;
    Phone: string;
    TextMessage: string;
    Letter: string;
    Preferred: string;
  };
  ContactLastUpdate: string;
}

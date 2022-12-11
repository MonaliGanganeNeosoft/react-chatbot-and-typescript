import { Transform } from "class-transformer";


export enum ServiceCodes {
    DEALERGROUP_DASHBOARD = 'DEALERGROUP_DASHBOARD',
    DEALERSHIP_DASHBOARD = 'DEALERSHIP_DASHBOARD',
    AGENT_DASHBOARD = 'AGENT_DASHBOARD',
    DEALERGROUP = 'DEALERGROUP',
    DEALERSHIP = 'DEALERSHIP',
    DEPARTMENT = 'DEPARTMENT',
    ROLES = 'ROLES',
    USERS = 'USERS',
    LEAD_SALES_AGENT = 'LEAD_SALES_AGENT',
    LEAD_GM = 'LEAD_GM',
    LEAD_SOURCE = 'LEAD_SOURCE',
    LEAD_TYPES = 'LEAD_TYPES',
    LEAD_TIER = 'LEAD_TIER',
    LEAD_MANUAL = 'LEAD_MANUAL',
    LEAD_QUEUE = 'LEAD_QUEUE',
    LEAD_ADMIN = 'LEAD_ADMIN',
    LEAD_PROSPECT = 'LEAD_PROSPECT',
    LEAD_TRADE_IN = 'LEAD_TRADE_IN',
    LEAD_AUTOMATION = 'LEAD_IMPORT',
    LEAD_IMPORT = 'LEAD_AUTOMATION',
    MASTERCALENDER = 'MASTERCALENDER',
    INVENTORY_AUTO = 'INVENTORY_AUTO',
    CBB = 'CBB',
    INVENTORY_RV = 'INVENTORY_RV',
    APPRAISAL = 'APPRAISAL',
    APPRAISAL_APPROVAL = 'APPRAISAL_APPROVAL',
    LENDER = 'LENDER',
    CUSTOMER = 'CUSTOMER',
    DOCUMENT = 'DOCUMENT',
    WARRANTY_CONTRACTS = 'WARRANTY_CONTRACTS',
    WARRANTY_LIENHOLDERS = 'WARRANTY_LIENHOLDERS',
    WARRANTY_REPORTS = 'WARRANTY_REPORTS',
    REPORTING = 'REPORTING',
    SETTINGS_TEMPLATE = 'SETTINGS_TEMPLATE',
    AUTOMATION_LIST = 'AUTOMATION_LIST',
    NOTIFICATIONS = 'NOTIFICATIONS',
    PASSWORD_UPDATE = 'PASSWORD_UPDATE',
    CALENDAR_APPOINTMENT = 'CALENDAR_APPOINTMENT',
    APPOINTMENT_ADMIN = "APPOINTMENT_ADMIN",
    APPOINTMENT_GM = "APPOINTMENT_GM",
    APPOINTMENT_SALES_AGENT = "APPOINTMENT_SALES_AGENT",
    LEAD_ACTIVITY = "LEAD_ACTIVITY",
    IMPERSONATE = 'IMPERSONATE',
    TEAMDASHBOARD = 'TEAMDASHBOARD',
    DEALERSHIPTRANSFER = 'DEALERSHIPTRANSFER',
    LISTEN_LIVE = "LISTEN_LIVE",
    WHISPER_CALL = "WHISPER_CALL",
    BARGE_IN = "BARGE_IN",
    TRANSCRIBE = "TRANSCRIBE",
    CALL_DASHBOARD = "CALL_DASHBOARD"
}

export enum ServiceNames {
    DEALERGROUP_DASHBOARD = 'Dealergroup Dashboard',
    DEALERSHIP_DASHBOARD = 'Dealership Dashboard',
    AGENT_DASHBOARD = 'Agent Dashboard',
    DEALERGROUP = 'Dealergroup Management',
    DEALERSHIP = 'Dealership Management',
    DEPARTMENT = 'Department Management',
    ROLES = 'Manage Roles',
    USERS = 'Manager Users',
    LEAD_SALES_AGENT = 'Sales Agent View',
    LEAD_GM = 'General Manager View',
    LEAD_SOURCE = 'Lead Source',
    LEAD_TYPES = 'Lead Type',
    LEAD_TIER = 'Lead Tier',
    LEAD_MANUAL = 'Manual Leads',
    LEAD_QUEUE = 'Lead Queue',
    LEAD_ADMIN = 'Lead Admin',
    LEAD_PROSPECT = 'Prospect View',
    LEAD_TRADE_IN = 'Lead Trade In',
    LEAD_AUTOMATION = 'Lead Automations',
    LEAD_IMPORT = 'Import Leads',
    MASTERCALENDER = 'Master Calender',
    INVENTORY_AUTO = 'Auto Inventory',
    CBB = 'Canadian Black Book',
    INVENTORY_RV = 'Rv Inventory',
    APPRAISAL = 'Agent View',
    APPRAISAL_APPROVAL = 'Appraiser View',
    LENDER = 'Lender',
    CUSTOMER = 'List Customers',
    DOCUMENT = 'Documents',
    WARRANTY_CONTRACTS = 'Contracts',
    WARRANTY_LIENHOLDERS = 'Manage Lienholders',
    WARRANTY_REPORTS = 'Reports',
    REPORTING = 'Reportings',
    SETTINGS_TEMPLATE = 'Template',
    AUTOMATION_LIST = 'Automation List',
    NOTIFICATIONS = 'Notifications',
    PASSWORD_UPDATE = 'Password Update',
    CALENDAR_APPOINTMENT = 'Calendar Appointment',
    APPOINTMENT_GM = "GM Appointment",
    APPOINTMENT_SALES_AGENT = "Sales Agent Appointment",
    LEAD_ACTIVITY = "Lead Actvity Tab View",
    IMPERSONATE = 'Impersonate',
    TEAMDASHBOARD = 'TEAMDASHBOARD',
    DEALERSHIPTRANSFER = 'Dealership Transfer',
    LISTEN_LIVE = "Listen Live",
    WHISPER_CALL = "Whisper Call",
    BARGE_IN = "Barge In",
    TRANSCRIBE = "Transcribe",
    CALL_DASHBOARD = "Call Dashboard"
}

export enum AccountStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DRAFT = 'DRAFT',
}

export enum DataSources {
    PBS = 'PBS',
    PORTAL = 'PORTAL',
}

export enum Level {
    ROOT = 'ROOT',
    DEALERGROUP = 'DEALERGROUP',
    DEALERSHIP = 'DEALERSHIP',
}

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    NO_WISH = 'NO_WISH'
}

export enum VerificationType {
    FORGET_PASSWORD = 'FORGET_PASSWORD',
}

export enum WorkingDays {
    Monday = 'Monday',
    Tuesday = 'Tuesday',
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
    Sunday = 'Sunday',
    Holiday = 'Holiday',
}

export enum AppType {
    ANDROID = 'ANDROID',
    IOS = 'IOS',
   
}

export function ToBoolean() {
  return Transform((v) => ["1", 1, "true", true].includes(v));
}

export enum LanguagePreference {
    EN = 'English',
    FR = 'French',
    NO_WISH = 'NO_WISH'
}

export enum DashboardView {
    AGENT = 'Agent_Dashboard',
    NO_WISH = 'NO_WISH'
}

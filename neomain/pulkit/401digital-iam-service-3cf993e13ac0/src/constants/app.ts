import { DabaduServiceCodes as ServiceCodes } from '@401_digital/xrm-core';
export enum ModuleCodes {
    DASHBOARD = 'DASHBOARD',
    ORGANIZATION_MANAGEMENT = 'ORGANIZATION_MANAGEMENT',
    LEAD_MANAGEMENT = 'LEAD_MANAGEMENT',
    INVENTORY_MANAGEMENT = 'INVENTORY_MANAGEMENT',
    LENDER_MANAGEMENT = 'LENDER_MANAGEMENT',
    CUSTOMER_MANAGEMENT = 'CUSTOMER_MANAGEMENT',
    DOCUMENT_MANAGEMENT = 'DOCUMENT_MANAGEMENT',
    WARRANTY_MANAGEMENT = 'WARRANTY_MANAGEMENT',
    CALENDER = 'CALENDER',
    REPORTING = 'REPORTING',
    SETTINGS = 'SETTINGS',
    COMMUNICATION = 'COMMUNICATION'
}

export const AppModuleList = [
    {
        name: 'Dashboards',
        code: ModuleCodes.DASHBOARD,
        serviceCodes: [
            ServiceCodes.DEALERGROUP_DASHBOARD,
            ServiceCodes.DEALERSHIP_DASHBOARD,
            ServiceCodes.AGENT_DASHBOARD,
            ServiceCodes.PERFORMANCE_DASHBOARD,
            ServiceCodes.IMPERSONATE,
            ServiceCodes.TEAMDASHBOARD,
            ServiceCodes.TEAM_GENERATION_DASHBOARD,
            ServiceCodes.LEADSDASHBOARD,
            ServiceCodes.CALL_DASHBOARD

        ],
    },
    {
        name: 'Organization Management',
        code: ModuleCodes.ORGANIZATION_MANAGEMENT,
        serviceCodes: [
            ServiceCodes.DEALERSHIP,
            ServiceCodes.DEALERGROUP,
            ServiceCodes.ROLES,
            ServiceCodes.DEPARTMENT,
            ServiceCodes.USERS,
            ServiceCodes.WARRANTY_LIENHOLDERS,
            ServiceCodes.DEALERSHIPTRANSFER
        ],
    },
    {
        name: 'Lead Management',
        code: ModuleCodes.LEAD_MANAGEMENT,
        serviceCodes: [
            ServiceCodes.LEAD_SOURCE,
            ServiceCodes.LEAD_TYPES,
            ServiceCodes.LEAD_TIER,
            ServiceCodes.LEAD_ADMIN,
            ServiceCodes.LEAD_GM,
            ServiceCodes.LEAD_DEALERGROUP,
            ServiceCodes.LEAD_SALES_AGENT,
            ServiceCodes.LEAD_MANUAL,
            ServiceCodes.LEAD_PROSPECT,
            ServiceCodes.LEAD_QUEUE,
            ServiceCodes.LEAD_IMPORT,
            ServiceCodes.LEAD_ORDER,
            ServiceCodes.LEAD_REFUND_REQUEST,
            ServiceCodes.LEAD_GM_REFUND,
            ServiceCodes.LEAD_MANAGER_REFUND,
            ServiceCodes.LEAD_LOBBY,
            ServiceCodes.LEAD_LIMIT,
            ServiceCodes.LEAD_TRANSFER,
            ServiceCodes.LEAD_BULK_TRANSFER,
            ServiceCodes.CALENDAR_APPOINTMENT,
            ServiceCodes.LEAD_AUTOMATION,
            ServiceCodes.APPOINTMENT_GM,
            ServiceCodes.APPOINTMENT_SALES_AGENT,
            ServiceCodes.LEAD_ACTIVITY,
            ServiceCodes.LEAD_EXPORT,
            ServiceCodes.LEAD_TRADE_IN
        ],
    },
    {
        name: 'Inventory Management',
        code: ModuleCodes.INVENTORY_MANAGEMENT,
        serviceCodes: [
            ServiceCodes.INVENTORY_AUTO,
            ServiceCodes.INVENTORY_RV,
            ServiceCodes.APPRAISAL,
            ServiceCodes.APPRAISAL_APPROVAL,
            ServiceCodes.CBB,
            ServiceCodes.IMAGE_INVENTORY,
        ],
    },
    {
        name: 'Lender Management',
        code: ModuleCodes.LENDER_MANAGEMENT,
        serviceCodes: [
            ServiceCodes.LENDER,
            ServiceCodes.FINANCE_APPLICATIONS
        ],
    },
    {
        name: 'Customer Management',
        code: ModuleCodes.CUSTOMER_MANAGEMENT,
        serviceCodes: [ServiceCodes.CUSTOMER],
    },
    {
        name: 'Document Management',
        code: ModuleCodes.DOCUMENT_MANAGEMENT,
        serviceCodes: [ServiceCodes.DOCUMENT],
    },
    {
        name: 'Warranty Management',
        code: ModuleCodes.WARRANTY_MANAGEMENT,
        serviceCodes: [
            ServiceCodes.WARRANTY_CONTRACTS,
            ServiceCodes.WARRANTY_REPORTS,
        ],
    },
    {
        name: 'Calender',
        code: ModuleCodes.CALENDER,
        serviceCodes: [ServiceCodes.MASTERCALENDER],
    },
    {
        name: 'Reporting',
        code: ModuleCodes.REPORTING,
        serviceCodes: [
            ServiceCodes.COMPANY_REPORT,
            ServiceCodes.ALL_LEAD_REPORT,
            ServiceCodes.AGENT_REPORT,
            ServiceCodes.LEAD_DETAIL_REPORT,
            ServiceCodes.COMMUNICATION_REPORT
        ],
    },
    {
        name: 'Settings',
        code: ModuleCodes.SETTINGS,
        serviceCodes: [
            ServiceCodes.BILLING_SETTINGS,
            ServiceCodes.AUTOMATION_LIST,
            ServiceCodes.SETTINGS_TEMPLATE,
            ServiceCodes.STATUS_SETTINGS,
            ServiceCodes.PASSWORD_UPDATE,
            ServiceCodes.LEADSALESMONTH,
            ServiceCodes.SNIPPETS,
            ServiceCodes.POSTAL_CODES_LOOKUP,
            ServiceCodes.INVENTORY_SETTINGS
        ],
    },
    {
        name: "Communication",
        code: ModuleCodes.COMMUNICATION,
        serviceCodes: [
            ServiceCodes.SMS,
            ServiceCodes.EMAIL,
            ServiceCodes.CALL,
            ServiceCodes.ADMIN_SMS,
            ServiceCodes.ADMIN_CALL,
            ServiceCodes.ADMIN_EMAIL
        ],
    }
];

import { UsersEntity } from 'src/app/users/users.entity';
import { DepartmentEntity } from 'src/app/departments/departments.entity';
import { RoleEntity } from 'src/app/user-roles/roles.entity';
import { DataSources, Level } from 'src/constants';
import { DabaduServiceCodes as ServiceCodes } from '@401_digital/xrm-core';
import { SecurityHelper } from 'src/helpers/security';

const ServiceList = Object.values(ServiceCodes);

export const DefaultFullAccess = ServiceList.map((service) => ({
    serviceType: service,
    canDelete: true,
    canRead: true,
    canWrite: true,
    canUpdate: true,
}));

export const DefaultDealerGroupUser = {
    role: {
        name: 'Admin',
        permissions: [
            {
                serviceType: ServiceCodes.DEALERGROUP_DASHBOARD,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.DEALERSHIP_DASHBOARD,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.AGENT_DASHBOARD,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.DEALERGROUP,
                canRead: false,
                canWrite: false,
                canDelete: false,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.DEALERSHIP,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.DEPARTMENT,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.ROLES,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.USERS,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.LEAD_SALES_AGENT,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.LEAD_GM,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.LEAD_SOURCE,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.LEAD_TYPES,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.LEAD_MANUAL,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.LEAD_QUEUE,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.LEAD_ADMIN,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.LEAD_PROSPECT,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.LEAD_TRADE_IN,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.LEAD_AUTOMATION,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.MASTERCALENDER,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.INVENTORY_AUTO,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.INVENTORY_RV,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.CBB,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.APPRAISAL,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.APPRAISAL_APPROVAL,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.LENDER,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.CUSTOMER,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.DOCUMENT,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.WARRANTY_CONTRACTS,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.WARRANTY_LIENHOLDERS,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.WARRANTY_REPORTS,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.SETTINGS_TEMPLATE,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
            {
                serviceType: ServiceCodes.NOTIFICATIONS,
                canRead: true,
                canWrite: true,
                canDelete: true,
                canUpdate: true,
            },
        ],
    },
};

export const DefaultDepartment = {
    name: 'Sales',
    active: true,
} as DepartmentEntity;

export const GeneralManagerRole = ({
    name: 'General Manager',
    isGM: true,
    isDefault: true,
    level: Level.DEALERSHIP,
    department: '',
    active: true,
    permissions: [
        {
            serviceType: ServiceCodes.DEALERSHIP_DASHBOARD,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.AGENT_DASHBOARD,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.DEALERSHIP,
            canRead: false,
            canWrite: false,
            canDelete: false,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.ROLES,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.USERS,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.LEAD_SALES_AGENT,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.LEAD_GM,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.LEAD_SOURCE,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.LEAD_TYPES,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.LEAD_MANUAL,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.LEAD_QUEUE,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.LEAD_ADMIN,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.LEAD_PROSPECT,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.LEAD_TRADE_IN,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.LEAD_AUTOMATION,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.MASTERCALENDER,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.INVENTORY_AUTO,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.CBB,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.INVENTORY_RV,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.APPRAISAL,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.APPRAISAL_APPROVAL,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.LENDER,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.CUSTOMER,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.DOCUMENT,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.WARRANTY_CONTRACTS,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.WARRANTY_LIENHOLDERS,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.WARRANTY_REPORTS,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.SETTINGS_TEMPLATE,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
        {
            serviceType: ServiceCodes.NOTIFICATIONS,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        },
    ],
} as any) as RoleEntity;


export const LeadManagerRole = ({
    name: 'Lead Manager',
    isDefault: true,
    level: Level.ROOT,
    active: true,
    permissions: [
        {
            serviceType: ServiceCodes.LEAD_MANAGER_REFUND,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true,
        }
    ],
} as any) as RoleEntity;

export const DefaultLeadManager = {
    isDefault: true,
    userLevel: Level.ROOT,
    username: null,
    password: 'Test@Test123',
    profile: {
        firstName: 'Lead',
        lastName: 'Manager',
        email: 'lead.manager@401auto.ca',
        isVisible: false,
        source: DataSources.PORTAL,
        phoneExtension: '+1',
        imageUrl: null,
        isInactive: false,
        isEnrolled: true,
    },
} as UsersEntity;


export const DefaultSystemAdminRole = ({
    name: 'System Admin',
    active: true,
    level: Level.ROOT,
    permissions: DefaultFullAccess,
    isDefault: true,
} as unknown) as RoleEntity;

export const DefaultSystemUser = {
    isDefault: true,
    userLevel: Level.ROOT,
    username: null,
    password: 'Test@Test123',
    profile: {
        firstName: 'System',
        lastName: 'Admin',
        email: 'system-admin@dabadu.ai',
        isVisible: false,
        source: DataSources.PORTAL,
        phone: '1234657722',
        phoneExtension: '+91',
        imageUrl: null,
        gender: 'MALE',
        isInactive: false,
        isEnrolled: true,
    },
} as UsersEntity;

export const DefaultProvince = [
    {
        name: 'Alberta',
        code: 'AB',
    },
    {
        name: 'British Columbia',
        code: 'BC',
    },
    {
        name: 'Manitoba',
        code: 'MB',
    },
    {
        name: 'New Brunswick',
        code: 'NB',
    },
    {
        name: 'Newfoundland and Labrador',
        code: 'NL',
    },
    {
        name: 'Nova Scotia',
        code: 'NS',
    },
    {
        name: 'Ontario',
        code: 'ON',
    },
    {
        name: 'Prince Edward Island',
        code: 'PE',
    },
    {
        name: 'Ontario',
        code: 'ON',
    },
    {
        name: 'Quebec',
        code: 'QC',
    },
    {
        name: 'Saskatchewan',
        code: 'SK',
    },
    {
        name: 'Northwest Territories',
        code: 'NT',
    },
    {
        name: 'Nunavut',
        code: 'NU',
    },
    {
        name: 'Yukon',
        code: 'YT',
    },
];

export const DefaultSalesAgentRole = {
    name: "Sales Agent",
    isDefault: true,
    active: true,
    level: Level.DEALERSHIP,
    permissions: [
        {
            serviceType: ServiceCodes.LEAD_SALES_AGENT,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true
        },
        {
            serviceType: ServiceCodes.AGENT_DASHBOARD,
            canRead: true,
            canWrite: true,
            canDelete: false,
            canUpdate: false
        },
        {
            serviceType: ServiceCodes.APPRAISAL,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true
        },
        {
            serviceType: ServiceCodes.LEAD_REFUND_REQUEST,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true
        },
        {
            serviceType: ServiceCodes.LEAD_MANUAL,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true
        },
    ]
} as RoleEntity;

export const DefaultSalesManagerRole = {
    name: "Sales Manager",
    isDefault: true,
    active: true,
    level: Level.DEALERSHIP,
    permissions: [
        {
            serviceType: ServiceCodes.LEAD_SALES_AGENT,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true
        },
        {
            serviceType: ServiceCodes.AGENT_DASHBOARD,
            canRead: true,
            canWrite: true,
            canDelete: false,
            canUpdate: false
        },
        {
            serviceType: ServiceCodes.APPRAISAL,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true
        },
        {
            serviceType: ServiceCodes.LEAD_REFUND_REQUEST,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true
        },
        {
            serviceType: ServiceCodes.LEAD_MANUAL,
            canRead: true,
            canWrite: true,
            canDelete: true,
            canUpdate: true
        },
    ]
} as RoleEntity;
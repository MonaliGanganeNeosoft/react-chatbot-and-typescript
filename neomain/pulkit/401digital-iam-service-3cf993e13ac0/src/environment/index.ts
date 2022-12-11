import * as dotenv from 'dotenv';
dotenv.config();

const PORT: string = process.env.PORT || '3010';
const DB_HOST: string = process.env.DB_HOST || 'localhost';
const DB_TYPE: any = process.env.DB_TYPE || 'mysql';
const DB_PORT: number = Number(process.env.DB_PORT) || 3306;
const DB_USER: string = process.env.DB_USER || 'root';
const DB_PASSWORD: string = process.env.DB_PASSWORD || '';
const DB_DATABASE: string = process.env.DB_DATABASE || 'app';
const TYPEORM_SYNC: boolean = process.env.TYPEORM_SYNC
    ? JSON.parse(process.env.TYPEORM_SYNC)
    : true;

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';

// VEHICLE API CREDS
const VEHICLE_API_KEY: string = process.env.VEHICLE_API_KEY || '';
const VEHICLE_API_URL: string = process.env.VEHICLE_API_URL || '';

//Bamboo HR
const BAMBOOHR_API_KEY = process.env.BAMBOOHR_API_KEY;
const BAMBOOHR_HOST = process.env.BAMBOOHR_HOST;
const BAMBOOEMPDIR = 'api/gateway.php/401auto/v1/employees/directory';
const BAMBOOEMPDETAIL = 'api/gateway.php/401auto/v1/employees';
const BAMBOOEMPFIELD = 'fields=displayName,firstName,lastName,customshowonwebsite,workEmail,division,hireDate,jobTitle,workPhone,workEmail,department,location,workPhoneExtension,supervisor,photoUrl';
// SendGrid
const SG_HOST = process.env.SG_HOST;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_TEMPLATE = process.env.SENDGRID_TEMPLATE;
const FORGETPASSWORD_TEMPLATE = process.env.FORGETPASSWORD_TEMPLATE;

const REFRESHTOKEN = process.env.REFRESHTOKEN;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_LOCATION = process.env.GOOGLE_LOCATION;
const GOOGLE_REVIEWS_API_KEY = process.env.GOOGLE_REVIEWS_API_KEY;

//JWT TOKEN
const ACCESS_TOKEN_EXPIRY: string = process.env.ACCESS_TOKEN_EXPIRY || '30';
const REFRESH_TOKEN_EXPIRY: string = process.env.REFRESH_TOKEN_EXPIRY || '1440';
const WEB_ACCESS_TOKEN_EXPIRY: string = process.env.WEB_ACCESS_TOKEN_EXPIRY || '30';
const WEB_REFRESH_TOKEN_EXPIRY: string = process.env.WEB_REFRESH_TOKEN_EXPIRY || '1440';
const APP_ACCESS_TOKEN_EXPIRY: string = process.env.APP_ACCESS_TOKEN_EXPIRY || '60';
const APP_REFRESH_TOKEN_EXPIRY: string = process.env.APP_REFRESH_TOKEN_EXPIRY || '10080';

//SQS
const REGION = process.env.REGION;
const ACCOUNT_ID = process.env.ACCOUNT_ID;
const QUEUE_NAME = process.env.QUEUE_NAME;
const PUSH_NOTIFICATION_QUEUE_NAME = process.env.PUSH_NOTIFICATION_QUEUE_NAME;
const MESSAGING_SETTINGS_QUEUE_NAME = process.env.MESSAGING_SETTINGS_QUEUE_NAME;
const QUEUE_URL = process.env.QUEUE_URL;
const SIP_API_KEY = process.env.SIP_API_KEY;
const EMAIL_QUEUE = process.env.EMAIL_QUEUE
//Microservice

const ENV = process.env.ENV
const BASE_URL = process.env.BASE_URL
const ASSETS_URL = process.env.ASSETS_URL


// Zendesk
const ZENDESK_SECRET_KEY = process.env.ZENDESK_SECRET_KEY;
const ZENDESK_DABADU_DOMAIN = process.env.ZENDESK_DABADU_DOMAIN;


const MICROSERVICES = {
    LEAD: {
        HOST: process.env.LEAD_MICROSERVICE_HOST || "http://lead-service:8080",
    },
    MESSAGING: {
        HOST: process.env.MESSAGING_MICROSERVICE_HOST || "http://messaging-service:8080",
    },
    CALENDAR: {
        HOST: process.env.CALENDAR_SERVICE_HOST || "http://calendar-service:8080"
    },
    DEAL: {
        HOST: process.env.DEAL_MICROSERVICE_HOST || "http://deal-service:8080"
    }
};
const DEFAULT_SALES_DOMAIN = process.env.DEFAULT_SALES_DOMAIN || "sales.dabadu.ai"
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@sales.dabadu.ai"

const PUBLIC_CALENDAR_URL_ENCRYPT = process.env.PUBLIC_CALENDAR_URL_ENCRYPT;

// twilio
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_APP_ID = process.env.TWILIO_APP_ID;
const TWILIO_VOICE_URL = process.env.TWILIO_VOICE_URL;

export {
    PORT,
    DB_HOST,
    DB_TYPE,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
    TYPEORM_SYNC,
    AWS_S3_BUCKET_NAME,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    BAMBOOHR_API_KEY,
    BAMBOOHR_HOST,
    BAMBOOEMPDETAIL,
    BAMBOOEMPFIELD,
    BAMBOOEMPDIR,
    SG_HOST,
    SENDGRID_API_KEY,
    REFRESHTOKEN,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_LOCATION,
    SENDGRID_TEMPLATE,
    VEHICLE_API_KEY,
    VEHICLE_API_URL,
    GOOGLE_REVIEWS_API_KEY,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    WEB_ACCESS_TOKEN_EXPIRY,
    WEB_REFRESH_TOKEN_EXPIRY,
    APP_ACCESS_TOKEN_EXPIRY,
    APP_REFRESH_TOKEN_EXPIRY,
    REGION,
    ACCOUNT_ID,
    QUEUE_NAME,
    PUSH_NOTIFICATION_QUEUE_NAME,
    MESSAGING_SETTINGS_QUEUE_NAME,
    QUEUE_URL,
    SIP_API_KEY,
    MICROSERVICES,
    FORGETPASSWORD_TEMPLATE,
    EMAIL_QUEUE,
    DEFAULT_SALES_DOMAIN,
    ENV,
    BASE_URL,
    ASSETS_URL,
    SUPPORT_EMAIL,
    PUBLIC_CALENDAR_URL_ENCRYPT,
    ZENDESK_SECRET_KEY,
    ZENDESK_DABADU_DOMAIN,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_APP_ID,
    TWILIO_VOICE_URL
};

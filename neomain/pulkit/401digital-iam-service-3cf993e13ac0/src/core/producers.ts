import { SqsService } from '@401_digital/xrm-core';
import { REGION, ACCOUNT_ID, QUEUE_URL, QUEUE_NAME, PUSH_NOTIFICATION_QUEUE_NAME, MESSAGING_SETTINGS_QUEUE_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, EMAIL_QUEUE } from '../environment';

const config = {
    region: REGION,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    accountId: ACCOUNT_ID,
    queueUrl: QUEUE_URL
}

export const SmsQueueProducer = new SqsService({ queueName: QUEUE_NAME, ...config });

export const SettingsQueueProducer = new SqsService({ queueName: MESSAGING_SETTINGS_QUEUE_NAME, ...config });

export const PushNotificationQueueProducer = new SqsService({ queueName: PUSH_NOTIFICATION_QUEUE_NAME, ...config });

export const EmailProducer = new SqsService({ queueName: EMAIL_QUEUE, ...config });
export const EmailQueueUrl= `${QUEUE_URL}/${ACCOUNT_ID}/${EMAIL_QUEUE}`
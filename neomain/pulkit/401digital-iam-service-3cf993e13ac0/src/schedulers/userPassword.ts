/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UsersEntity } from 'src/app/users/users.entity';
import { AccountStatus } from 'src/constants';
import { getRepository, In } from 'typeorm';
import moment from 'moment';
import { EmailProducer, EmailQueueUrl } from "../core/producers";
import { SQS } from "../constants/SQS";

@Injectable()
export class UserPassword {
    private readonly logger = new Logger(UserPassword.name);

    @Cron('0 8 * * *', { name: 'userPassword' })
    async handleCron() {
        try {
            this.logger.log("User Password Cron Job Started");
            const currentDate = moment().format('YYYY-MM-DD')
            const emailDate = moment().add(7, 'days').format('YYYY-MM-DD')
            const users = await getRepository(UsersEntity).find({
                where: {
                    passwordExpiryDate: currentDate
                }
            })
            this.setPasswordExpiry(users)
            const emailUsers = await getRepository(UsersEntity).find({
                where: {
                    passwordExpiryDate: emailDate
                }
            })
            console.log(emailUsers)
            this.sendEmailtoUsers(emailUsers)
            // this.logger.log("Dealership Cleaner Stopped");
        } catch (error) {
            this.logger.error(error);
        }

    }
    async setPasswordExpiry(users) {
        this.logger.log(`Total record length ${users.length}`);
        if (users && users.length) {
            const chunkSize = 200;
            let chunk = chunkSize, index = 0;
            while (index <= users.length) {
                const chunkList = users.slice(index, chunk);
                if (chunkList.length) {
                    this.logger.log(`Processing Chunk From : ${index} To : ${chunk}`);
                    console.log(chunkList.map(e => e.id))

                    getRepository(UsersEntity).update(
                        {
                            id: In(chunkList.map(e => e.id)),
                        },
                        { requiredPasswordUpdate: false },
                    );
                    index = chunk;
                    chunk = chunk + chunkSize;
                }
            }
        }
    }

    async sendEmailtoUsers(users) {
        this.logger.log(`Total record length ${users.length}`);
        const {reminderEmail} = SQS;
        if (users && users.length) {
            const chunkSize = 200;
            let chunk = chunkSize, index = 0;
            while (index <= users.length) {
                const chunkList = users.slice(index, chunk);
                if (chunkList.length) {
                    this.logger.log(`Processing Chunk From : ${index} To : ${chunk}`);
                    for (const user of chunkList) {
                        const dataObj = {
                            type: reminderEmail.type,
                            operationType: reminderEmail.operationalTypeForStaff,
                            payload: {
                                from: 'support@dabadu.ai',
                                to: user.username,
                                subject: 'Reminder Email',
                                html: '<h1>Reminder email to change the password</h1>',
                            }
                        } as any;
                        EmailProducer.getInstance().sendMessage({
                            MessageGroupId: "emails",
                            MessageBody: JSON.stringify(dataObj),
                            QueueUrl: EmailQueueUrl
                        }).promise()
                            .then((data) => {
                                console.log(data);
                            })
                            .catch((error) => {
                                console.error(error);
                            })
                        index = chunk;
                        chunk = chunk + chunkSize;
                    }

                }
            }
        }
    }
}

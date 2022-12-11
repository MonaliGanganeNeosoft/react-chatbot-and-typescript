import { Injectable } from '@nestjs/common';
import sg from '@sendgrid/mail';
import ejs from 'ejs';
import fs from 'fs';
import { NewUserEmail } from 'src/dto';
import { SENDGRID_API_KEY, SG_HOST, SENDGRID_TEMPLATE, FORGETPASSWORD_TEMPLATE, ASSETS_URL,SUPPORT_EMAIL,BASE_URL } from 'src/environment';
import { EmailProducer, EmailQueueUrl } from "../core/producers";
import { SQS } from "../constants";

sg.setApiKey(SENDGRID_API_KEY);

@Injectable()
export class MailHelper {
    send(payload: any) {
        return sg.send({
            from: SUPPORT_EMAIL,
            to: payload.to,
            html: payload.html,
            subject: payload.subject,
        });
    }

    sendNewUserEmail(payload: NewUserEmail) {
        const newUserTemplate = fs.readFileSync('templates/newUser.ejs', {
            encoding: 'utf-8',
        });
        const template = ejs.render(
            newUserTemplate,
            {
                name: payload.name,
                username: payload.username,
                password: payload.password,
                assetsUrl: ASSETS_URL,
                baseUrl:BASE_URL
            },
            {},
        );

        return this.send({
            to: payload.to,
            html: template,
            subject: 'Welcome Email',
        });
    }

    async sendPasswordResetEmail(payload: any) {
        const { forgetPassword } = SQS;

        const forgetPasswordTemplate = fs.readFileSync('templates/forgetPassword.ejs', {
            encoding: 'utf-8',
        });
        const template = ejs.render(
            forgetPasswordTemplate,
            {
                name: payload.name,
                resetUrl: payload.url,
                assetsUrl: ASSETS_URL
            },
            {},
        );

        const dataObj = {
            type: forgetPassword.type,
            operationType: forgetPassword.operationalTypeForStaff,
            payload: {
                from: SUPPORT_EMAIL,
                to: payload.to,
                subject: 'Forget password',
                html: template,
            }
        } as any;
        this.sendEmail(dataObj)
    }

    async sendManualPasswordEmail(payload: any) {
        const { manualPasswordChange } = SQS;

        const manualPasswordTemplate = fs.readFileSync('templates/manualPassword.ejs', {
            encoding: 'utf-8',
        });
        const template = ejs.render(
            manualPasswordTemplate,
            {
                name: payload.name,
                password: payload.password,
                assetsUrl: ASSETS_URL
            },
            {},
        );

        const dataObj = {
            type: manualPasswordChange.type,
            operationType: manualPasswordChange.operationalTypeForStaff,
            payload: {
                from: SUPPORT_EMAIL,
                to: payload.to,
                subject: 'Password Reset by Admin',
                html: template,
            }
        } as any;
        this.sendEmail(dataObj)
    }

    sendEmail(dataObj) {
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
    }
}

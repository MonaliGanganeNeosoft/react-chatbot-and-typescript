import { HttpHelper } from '@401_digital/xrm-core';
import { Injectable } from '@nestjs/common';
import { MailService } from '@sendgrid/mail';
import { SENDGRID_API_KEY, SG_HOST, SENDGRID_TEMPLATE } from '../../environment';
import { SubscriptionEntity } from './subscription.entity';
import { getRepository } from 'typeorm';
import { debug } from 'console';

@Injectable()
export class SubscriptionService {
  private sgMail: MailService;
  private http: HttpHelper<any>;
  constructor() {
    this.sgMail = new MailService();
    this.http = new HttpHelper(SG_HOST);
    this.sgMail.setApiKey(SENDGRID_API_KEY);
  }

  async welcomeEmail(email: string) {
    await this.http.post(
      'v3/mail/send',
      {
        personalizations: [
          {
            to: [
              {
                email: email,
              },
            ],
            subject: '401AutoRV Subscribed successfully for Newsletter',
          },
        ],
        from: {
          email: 'newsletters@401autorv.ca',
        },
        template_id: SENDGRID_TEMPLATE
      },
      {
        authorization: `Bearer ${SENDGRID_API_KEY}`,
        'content-type': 'application/json',
      },
    );    
  }

  async createList(name: string) {
    const response = await this.http.post(
      'v3/marketing/lists',
      { name },
      {
        authorization: `Bearer ${SENDGRID_API_KEY}`,
        'content-type': 'application/json',
      },
    );
    return response;
  }

  async getList(id) {
    const response = await this.http.get(`v3/marketing/lists/${id}`, {
      authorization: `Bearer ${SENDGRID_API_KEY}`,
      'content-type': 'application/json',
    });
    return response;
  }

  async getLists() {
    const response = await this.http.get(`v3/marketing/lists`, {
      authorization: `Bearer ${SENDGRID_API_KEY}`,
      'content-type': 'application/json',
    });
    return response;
  }

  async addcontact(listIds: string[], email: string) {
    console.log('email : ', email)
    const response = await this.http.put(
      'v3/marketing/contacts',
      { list_ids: listIds, contacts: [{ email: email }] },
      {
        authorization: `Bearer ${SENDGRID_API_KEY}`,
        'content-type': 'application/json',
      },
    );
    return response;
  }

  async getAllcontacts() {
    const response = await this.http.get('v3/marketing/contacts', {
      authorization: `Bearer ${SENDGRID_API_KEY}`,
    });
    return response;
  }

  async checkSubscription(email) {
    const repo = await getRepository(SubscriptionEntity);
    const subscription = await repo.findOne({ emailId: email });
    return subscription;
  }

  async getRepository(emailId, listId) {
    const response = await getRepository(SubscriptionEntity).save({
      emailId,
      listId,
    });
    return response;
  }
}

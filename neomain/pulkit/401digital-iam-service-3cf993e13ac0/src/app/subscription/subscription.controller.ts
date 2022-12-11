import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { SubscriptionDTO, ContactListDTO } from './subscription.dto';
import { SuccessResponse } from '@401_digital/xrm-core';
import { SubscriptionEntity } from './subscription.entity';
import { SendGrid } from '../../constants/sendgrid';
import { getRepository } from 'typeorm';

@ApiTags('Subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post('newsletter')
  @ApiBody({ type: SubscriptionDTO })
  async newsLetter(@Body() data: SubscriptionDTO) {
    // check if email is already subscribed db check
    const repo = getRepository(SubscriptionEntity);
    const subscription = await this.subscriptionService.checkSubscription(
      data.email,
    );
    if (!subscription) {
      const ServiceLists = await this.subscriptionService.getList(
        SendGrid.listId,
      );
      await this.subscriptionService.addcontact([SendGrid.listId], data.email);
      const response = await this.subscriptionService.getRepository(
        data.email,
        SendGrid.listId,
      );
      await this.subscriptionService.welcomeEmail(data.email);
      return new SuccessResponse(response);
    } else {
      return new SuccessResponse('Email already exist');
    }
  }

  @Get('getContacts')
  async getContacts() {
    return new SuccessResponse(await this.subscriptionService.getAllcontacts());
  }

  @Post('createlist')
  @ApiBody({ type: ContactListDTO })
  async createList(@Body() data: ContactListDTO) {
    const list = await this.subscriptionService.createList(data.name);
    const response = await getRepository(SubscriptionEntity).save({
      listId: list.message.id,
      name: data.name,
    });
    return new SuccessResponse(response);
  }
}

import { MessagingController } from './messaging.controller';
import { HttpModule, Module } from '@nestjs/common';
import { AwsService } from '../../configs/aws';
import { Messaging } from './messaging.service';

@Module({
  imports: [HttpModule],
  controllers: [MessagingController],
  providers: [AwsService, Messaging],
})
export class MessagingModule {}

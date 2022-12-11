/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DealershipEntity } from 'src/app/dealership/dealership.entity';
import { AccountStatus } from 'src/constants';
import { getRepository } from 'typeorm';
 

@Injectable()
export class DealershipCleaner {
  private readonly logger = new Logger(DealershipCleaner.name);

  @Cron('0 */2 * * *', { name: 'dealershipCleaner' })
  async handleCron() {
      try {
        this.logger.log("Dealership Cleaner Started");
        const dealershipRepo = getRepository(DealershipEntity);
        await dealershipRepo.delete({ status: AccountStatus.DRAFT });
        this.logger.log("Dealership Cleaner Stopped");
      } catch (error) {
          this.logger.error(error);
      }
      
  }
}

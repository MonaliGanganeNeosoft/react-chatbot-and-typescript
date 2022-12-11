import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealershipImageEntity } from '../dealership/dealership-image.entity';
import { DealershipOpeningEntity } from '../dealership/dealership-openinghours.entity';
import { DealershipEntity } from '../dealership/dealership.entity';
import { DealershipModule } from '../dealership/dealership.module';
import { DealershipService } from '../dealership/dealership.service';
import { PublicContactsEntity } from './public-contacts.entity';
import { PublicService } from './public.service';

@Module({
  imports: [DealershipModule],
  providers: [PublicService],
})
export class PublicModule {}

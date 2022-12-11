/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BambooHelpers } from 'src/helpers/bamboo';

@Injectable()
export class BambooScheduler {

    constructor(private bambooHelpers: BambooHelpers) {
    }

    @Cron('0 */3 * * *', { name: 'bamboo' })
    handleCron() {
        this.bambooHelpers.getRecordsFromBamboo();
    }
}

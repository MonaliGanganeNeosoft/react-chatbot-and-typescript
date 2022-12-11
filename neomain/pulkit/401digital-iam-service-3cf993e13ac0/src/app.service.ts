import { Injectable, Logger } from '@nestjs/common';
import { CoreDatabaseHelper } from './helpers/database';
import { Seeder } from './helpers/seeder';

@Injectable()
export class AppService {
    private logger = new Logger(AppService.name);

    constructor(private dbHelper: CoreDatabaseHelper) { }

    init() {
        this.initiateSeed();
    }

    initiateSeed() {
        this.dbHelper.migrateByUserRoleTable().then();
        Seeder.init().then(() => {
            this.logger.log("Seeding Done")
        }).catch((error) => {
            this.logger.error("Error while seeding", error);
        })
    }
}

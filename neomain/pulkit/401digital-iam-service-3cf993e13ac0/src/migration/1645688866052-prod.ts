import { RoleDealershipEntity } from "src/app/user-roles/role-dealership.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class prod1645688866052 implements MigrationInterface {
    name = 'prod1645688866052'

    async insertDealerGroupAndDealerships(queryRunner: QueryRunner, results: any[]) {
        const items = results.map(el => ({
            role: el.role,
            dealership: el.dealership,
            dealerGroup: el.dealergroup
        } as RoleDealershipEntity)) as RoleDealershipEntity[]

        const toInsert = [];

        for (const item of items) {
            const exists = await queryRunner.manager.getRepository(RoleDealershipEntity).findOne({ where: item });
            if (!exists) {
                toInsert.push(item);
            }
        }

        await queryRunner.manager.getRepository(RoleDealershipEntity).createQueryBuilder()
            .insert()
            .values(toInsert)
            .onConflict('ON CONSTRAINT uk_role_dealerships DO NOTHING')
            .execute();
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role_dealerships" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "role" uuid, "dealergroup" integer, "dealership" uuid, CONSTRAINT "uk_role_dealerships" UNIQUE ("role", "dealership", "dealergroup"), CONSTRAINT "PK_55304fec667da509024a8bab302" PRIMARY KEY ("id"))`);

        const results = await queryRunner.query(`select DISTINCT r.id as role, u.dealer_group as dealergroup, u.dealership as dealership from roles r inner join user_roles ur on r.id = ur."roleId" inner join users u on u.id = ur."userId"`);
        await this.insertDealerGroupAndDealerships(queryRunner, results);


        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_803f775d95744b17ddb0804b8c3"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_b5280996ad06930290b082e9449"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "dealer_group"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "dealership"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "can_receive_leads" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "mpath" character varying DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "users" ADD "reportsToId" uuid`);
        await queryRunner.query(`ALTER TABLE "role_dealerships" ADD CONSTRAINT "FK_d54d0bda97a41f2be71e0ed7c53" FOREIGN KEY ("role") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_dealerships" ADD CONSTRAINT "FK_525743e87b970b69af80028883c" FOREIGN KEY ("dealergroup") REFERENCES "dealergroups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_dealerships" ADD CONSTRAINT "FK_986414e7988eba306b06146440f" FOREIGN KEY ("dealership") REFERENCES "dealerships"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_818d40595d8bb85d84cf61abf1d" FOREIGN KEY ("reportsToId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
   }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_818d40595d8bb85d84cf61abf1d"`);
        await queryRunner.query(`ALTER TABLE "role_dealerships" DROP CONSTRAINT "FK_986414e7988eba306b06146440f"`);
        await queryRunner.query(`ALTER TABLE "role_dealerships" DROP CONSTRAINT "FK_525743e87b970b69af80028883c"`);
        await queryRunner.query(`ALTER TABLE "role_dealerships" DROP CONSTRAINT "FK_d54d0bda97a41f2be71e0ed7c53"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reportsToId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "mpath"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "can_receive_leads"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "dealership" uuid`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "dealer_group" integer`);
        await queryRunner.query(`DROP TABLE "role_dealerships"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_b5280996ad06930290b082e9449" FOREIGN KEY ("dealership") REFERENCES "dealerships"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_803f775d95744b17ddb0804b8c3" FOREIGN KEY ("dealer_group") REFERENCES "dealergroups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

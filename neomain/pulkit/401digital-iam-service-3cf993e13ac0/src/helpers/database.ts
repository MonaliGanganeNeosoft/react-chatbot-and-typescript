import { Injectable } from '@nestjs/common';
import { RoleDealershipEntity } from 'src/app/user-roles/role-dealership.entity';
import { RoleEntity } from 'src/app/user-roles/roles.entity';
import { Connection, getRepository, QueryRunner } from 'typeorm';
@Injectable()
export class CoreDatabaseHelper {
    constructor(private connection: Connection) { }
    async setFunctions() {
        await this.connection.query(`
          CREATE OR REPLACE FUNCTION track_employee_update()
          RETURNS TRIGGER 
          LANGUAGE PLPGSQL
          AS
          $$
          BEGIN
          IF NEW.serial_number <> OLD.serial_number THEN
          INSERT INTO employees_history(employee_id,pbs_employee_id,serial_number,last_pbs_update,is_inactive,created_at)
          VALUES(OLD.id,OLD.pbs_employee_id,OLD.serial_number,OLD.last_pbs_update, OLD.is_inactive, now());
          END IF;
          RETURN NEW;
          END;
          $$`);
    }
    async setTriggers() {
        await this.connection.query(`
          DROP TRIGGER IF EXISTS employee_update
          ON employees;
            CREATE TRIGGER employee_update
          BEFORE UPDATE
          ON employees
          FOR EACH ROW
          EXECUTE PROCEDURE track_employee_update();`);
    }

    //   async setSequences() {
    //     await this.connection.query(`
    //           CREATE SEQUENCE IF NOT EXISTS dealergroup_custom_id_seq
    //           START WITH 1001
    //           INCREMENT BY 1
    //           OWNED BY dealergroups.id
    //           CACHE 1;`);
    //     await this.connection.query(`
    //           ALTER TABLE dealergroups ALTER COLUMN id SET DEFAULT nextval('dealergroup_custom_id_seq'::regclass);
    //     `);
    //     await this.connection.query(`
    //           DROP SEQUENCE IF EXISTS dealergroups_id_seq;
    //     `);
    //   } 

    async migrateByUserRoleTable() {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const results = await queryRunner.query(`select DISTINCT r.id as role, u.dealer_group as dealergroup, u.dealership as dealership from roles r inner join user_roles ur on r.id = ur."roleId" inner join users u on u.id = ur."userId"`);
            await this.insertDealerGroupAndDealerships(queryRunner, results);
            await queryRunner.commitTransaction()
        } catch (error) {
            await queryRunner.rollbackTransaction()
        }
    }

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

    async migrateByRoleTable() {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const results = await queryRunner.query(`select id as role, dealer_group as dealergroup, dealership from roles;`);
            await this.insertDealerGroupAndDealerships(queryRunner, results);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
        }

    }
}


import { MigrationInterface, QueryRunner } from "typeorm";

export class AllMigration1753973839926 implements MigrationInterface {
    name = 'AllMigration1753973839926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "swap_request" ADD "message" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "swap_request" DROP COLUMN "message"`);
    }

}

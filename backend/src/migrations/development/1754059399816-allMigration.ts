import { MigrationInterface, QueryRunner } from "typeorm";

export class AllMigration1754059399816 implements MigrationInterface {
    name = 'AllMigration1754059399816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_ab53e75553d397c0560aece9ff8"`);
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "UQ_ab53e75553d397c0560aece9ff8"`);
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "approvalRequestId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ADD "approvalRequestId" uuid`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "UQ_ab53e75553d397c0560aece9ff8" UNIQUE ("approvalRequestId")`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_ab53e75553d397c0560aece9ff8" FOREIGN KEY ("approvalRequestId") REFERENCES "book_approval_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

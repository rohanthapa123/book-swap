import { MigrationInterface, QueryRunner } from "typeorm";

export class AllMigration1748074237263 implements MigrationInterface {
    name = 'AllMigration1748074237263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_approval_request" DROP CONSTRAINT "FK_1a9c66c2a8bfea0b897a114a639"`);
        await queryRunner.query(`ALTER TABLE "book_approval_request" ADD CONSTRAINT "UQ_1a9c66c2a8bfea0b897a114a639" UNIQUE ("bookId")`);
        await queryRunner.query(`ALTER TABLE "book_approval_request" ADD CONSTRAINT "FK_1a9c66c2a8bfea0b897a114a639" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_approval_request" DROP CONSTRAINT "FK_1a9c66c2a8bfea0b897a114a639"`);
        await queryRunner.query(`ALTER TABLE "book_approval_request" DROP CONSTRAINT "UQ_1a9c66c2a8bfea0b897a114a639"`);
        await queryRunner.query(`ALTER TABLE "book_approval_request" ADD CONSTRAINT "FK_1a9c66c2a8bfea0b897a114a639" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

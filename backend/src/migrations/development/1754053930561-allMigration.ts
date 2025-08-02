import { MigrationInterface, QueryRunner } from "typeorm";

export class AllMigration1754053930561 implements MigrationInterface {
    name = 'AllMigration1754053930561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_approval_request" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "book_approval_request" ADD "approvedById" uuid`);
        await queryRunner.query(`ALTER TABLE "book_approval_request" ALTER COLUMN "requestedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "book" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "book" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "swap_request" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "swap_request" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "book_approval_request" ADD CONSTRAINT "FK_9c2b74a9d5a4d21ddf6e95a9b5f" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_approval_request" DROP CONSTRAINT "FK_9c2b74a9d5a4d21ddf6e95a9b5f"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updatedAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "createdAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "swap_request" ALTER COLUMN "updatedAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "swap_request" ALTER COLUMN "createdAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "book" ALTER COLUMN "updatedAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "book" ALTER COLUMN "createdAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "book_approval_request" ALTER COLUMN "requestedAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "book_approval_request" DROP COLUMN "approvedById"`);
        await queryRunner.query(`ALTER TABLE "book_approval_request" DROP COLUMN "updatedAt"`);
    }

}

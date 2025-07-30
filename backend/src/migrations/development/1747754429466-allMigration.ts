import { MigrationInterface, QueryRunner } from "typeorm";

export class AllMigration1747754429466 implements MigrationInterface {
    name = 'AllMigration1747754429466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "book" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isbn" character varying NOT NULL, "title" character varying NOT NULL, "author" character varying NOT NULL, "desc" character varying NOT NULL, "genre" character varying, "condition" character varying, "language" character varying, "publishedYear" character varying, "noOfPages" character varying, "image" character varying, "isAvailable" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "ownerId" uuid, CONSTRAINT "UQ_bd183604b9c828c0bdd92cafab7" UNIQUE ("isbn"), CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "swap_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "requesterId" uuid, "receiverId" uuid, "bookOfferedId" uuid, "bookRequestedId" uuid, CONSTRAINT "PK_0f47e33a2daa40e285f416f5625" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "admin" boolean NOT NULL DEFAULT false, "phone" character varying, "profileImage" character varying, "address" character varying, "gender" character varying, "dateOfBirth" TIMESTAMP, "isActive" boolean NOT NULL DEFAULT true, "isVerified" boolean NOT NULL DEFAULT false, "preferences" text, "latitude" numeric(9,6), "longitude" numeric(9,6), "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book_approval_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL DEFAULT 'pending', "adminNote" text, "requestedAt" TIMESTAMP NOT NULL, "bookId" uuid, CONSTRAINT "PK_e60fb203b6240864ecb4a579ee1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_b90677e3d515d915033134fc5f4" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "swap_request" ADD CONSTRAINT "FK_2280459bf62dc74b9a8d2673619" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "swap_request" ADD CONSTRAINT "FK_b948e78675e16e1819e412dff49" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "swap_request" ADD CONSTRAINT "FK_f5bb1a0a444a34f070aa865bc38" FOREIGN KEY ("bookOfferedId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "swap_request" ADD CONSTRAINT "FK_5316a806e6a47293812e5ac6875" FOREIGN KEY ("bookRequestedId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_approval_request" ADD CONSTRAINT "FK_1a9c66c2a8bfea0b897a114a639" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_approval_request" DROP CONSTRAINT "FK_1a9c66c2a8bfea0b897a114a639"`);
        await queryRunner.query(`ALTER TABLE "swap_request" DROP CONSTRAINT "FK_5316a806e6a47293812e5ac6875"`);
        await queryRunner.query(`ALTER TABLE "swap_request" DROP CONSTRAINT "FK_f5bb1a0a444a34f070aa865bc38"`);
        await queryRunner.query(`ALTER TABLE "swap_request" DROP CONSTRAINT "FK_b948e78675e16e1819e412dff49"`);
        await queryRunner.query(`ALTER TABLE "swap_request" DROP CONSTRAINT "FK_2280459bf62dc74b9a8d2673619"`);
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_b90677e3d515d915033134fc5f4"`);
        await queryRunner.query(`DROP TABLE "book_approval_request"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "swap_request"`);
        await queryRunner.query(`DROP TABLE "book"`);
    }

}

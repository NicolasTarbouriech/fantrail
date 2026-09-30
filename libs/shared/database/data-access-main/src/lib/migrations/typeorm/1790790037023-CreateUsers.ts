import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1790790037023 implements MigrationInterface {
  name = 'CreateUsers1790790037023';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "email" character varying(254) NOT NULL, "pseudo" character varying(20) NOT NULL, "pseudo_key" character varying(40) NOT NULL, "password_hash" text NOT NULL, "role" character varying(16) NOT NULL, "disabled_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_users_email" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_users_pseudo_key" ON "users" ("pseudo_key") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."UQ_users_pseudo_key"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_users_email"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}

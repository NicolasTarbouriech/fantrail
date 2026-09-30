import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLeagues1790791670135 implements MigrationInterface {
  name = 'CreateLeagues1790791670135';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "league_members" ("league_id" uuid NOT NULL, "user_id" uuid NOT NULL, "joined_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_6ccde9ff5b6935a05539c2e5017" PRIMARY KEY ("league_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b7c5afba2ad8d257e435a1a657" ON "league_members" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "leagues" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying(40) NOT NULL, "name_key" character varying(80) NOT NULL, "visibility" character varying(16) NOT NULL, "owner_id" uuid NOT NULL, "invite_code" character(8) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2275e1e3e32e9223298c3a0b514" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_leagues_name_key" ON "leagues" ("name_key") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7e9e6674560cf667ff8a34e31f" ON "leagues" ("visibility") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_leagues_invite_code" ON "leagues" ("invite_code") `,
    );
    await queryRunner.query(
      `ALTER TABLE "league_members" ADD CONSTRAINT "FK_c762aefaf8125efd0b3b08fb9d0" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "league_members" ADD CONSTRAINT "FK_b7c5afba2ad8d257e435a1a6574" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "leagues" ADD CONSTRAINT "FK_8f6419ae8b96db43c59aabdfb33" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leagues" DROP CONSTRAINT "FK_8f6419ae8b96db43c59aabdfb33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "league_members" DROP CONSTRAINT "FK_b7c5afba2ad8d257e435a1a6574"`,
    );
    await queryRunner.query(
      `ALTER TABLE "league_members" DROP CONSTRAINT "FK_c762aefaf8125efd0b3b08fb9d0"`,
    );
    await queryRunner.query(`DROP INDEX "public"."UQ_leagues_invite_code"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7e9e6674560cf667ff8a34e31f"`,
    );
    await queryRunner.query(`DROP INDEX "public"."UQ_leagues_name_key"`);
    await queryRunner.query(`DROP TABLE "leagues"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b7c5afba2ad8d257e435a1a657"`,
    );
    await queryRunner.query(`DROP TABLE "league_members"`);
  }
}

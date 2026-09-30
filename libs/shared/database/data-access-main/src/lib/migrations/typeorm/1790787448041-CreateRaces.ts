import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRaces1790787448041 implements MigrationInterface {
  name = 'CreateRaces1790787448041';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "runners" ("id" uuid NOT NULL, "field_id" uuid NOT NULL, "first_name" character varying(60) NOT NULL, "last_name" character varying(60) NOT NULL, "nationality" character(3), "index" smallint, "index_source" character varying(16), "utmb_url" text, "itra_url" text, "withdrawn_at" TIMESTAMP WITH TIME ZONE, "position" smallint NOT NULL, CONSTRAINT "PK_9b52b801361edc6a1f4dcd390c4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_137a2ea5cc193e0f0aa9e73bb1" ON "runners" ("field_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "race_fields" ("id" uuid NOT NULL, "race_id" uuid NOT NULL, "gender" character varying(16) NOT NULL, "start_at" TIMESTAMP WITH TIME ZONE NOT NULL, "lock_at" TIMESTAMP WITH TIME ZONE NOT NULL, "locked_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_b66db7f7b088605b30d3040c9a0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_57fdf74170001b132c2ec2441c" ON "race_fields" ("race_id", "gender") `,
    );
    await queryRunner.query(
      `CREATE TABLE "races" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying(100) NOT NULL, "location" character varying(100) NOT NULL, "distance_in_km" numeric(6,1) NOT NULL, "elevation_gain_in_meters" integer NOT NULL, "timezone" character varying(64) NOT NULL, "website_url" text, "live_trail_url" text, "pick_count" smallint NOT NULL, "time_tolerance_percent" numeric(5,2) NOT NULL, "status" character varying(16) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ba7d19b382156bc33244426c597" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7956bb83a8eebc3c3cfa6dfade" ON "races" ("status") `,
    );
    await queryRunner.query(
      `ALTER TABLE "runners" ADD CONSTRAINT "FK_137a2ea5cc193e0f0aa9e73bb1d" FOREIGN KEY ("field_id") REFERENCES "race_fields"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "race_fields" ADD CONSTRAINT "FK_f098957620d2769f42231409e05" FOREIGN KEY ("race_id") REFERENCES "races"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "race_fields" DROP CONSTRAINT "FK_f098957620d2769f42231409e05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "runners" DROP CONSTRAINT "FK_137a2ea5cc193e0f0aa9e73bb1d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7956bb83a8eebc3c3cfa6dfade"`,
    );
    await queryRunner.query(`DROP TABLE "races"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_57fdf74170001b132c2ec2441c"`,
    );
    await queryRunner.query(`DROP TABLE "race_fields"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_137a2ea5cc193e0f0aa9e73bb1"`,
    );
    await queryRunner.query(`DROP TABLE "runners"`);
  }
}

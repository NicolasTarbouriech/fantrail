import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTrailEvents1791250000000 implements MigrationInterface {
  name = 'CreateTrailEvents1791250000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "trail_events" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying(60) NOT NULL, "name_key" character varying(120) NOT NULL, "logo" bytea, "logo_content_type" character varying(32), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_trail_events" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_trail_events_name_key" ON "trail_events" ("name_key") `,
    );
    // Nullable column without default: no table rewrite on races.
    await queryRunner.query(`ALTER TABLE "races" ADD "trail_event_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "races" ADD CONSTRAINT "FK_races_trail_event_id" FOREIGN KEY ("trail_event_id") REFERENCES "trail_events"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "races" DROP CONSTRAINT "FK_races_trail_event_id"`,
    );
    await queryRunner.query(`ALTER TABLE "races" DROP COLUMN "trail_event_id"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_trail_events_name_key"`);
    await queryRunner.query(`DROP TABLE "trail_events"`);
  }
}

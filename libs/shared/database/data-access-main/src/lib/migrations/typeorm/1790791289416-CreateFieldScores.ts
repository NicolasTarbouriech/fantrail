import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFieldScores1790791289416 implements MigrationInterface {
  name = 'CreateFieldScores1790791289416';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "field_scores" ("field_id" uuid NOT NULL, "user_id" uuid NOT NULL, "result_version" integer NOT NULL, "total" integer NOT NULL, "time_gap_in_seconds" integer NOT NULL, "finalized_at" TIMESTAMP WITH TIME ZONE NOT NULL, "breakdown" jsonb NOT NULL, CONSTRAINT "PK_85d1dc9cf9f97801bc5dd2371ea" PRIMARY KEY ("field_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_649a02fa31f2ab6e10a839d85c" ON "field_scores" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "field_scores" ADD CONSTRAINT "FK_829eaf9d0598ccdda5271f12f40" FOREIGN KEY ("field_id") REFERENCES "race_fields"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "field_scores" ADD CONSTRAINT "FK_649a02fa31f2ab6e10a839d85c9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "field_scores" DROP CONSTRAINT "FK_649a02fa31f2ab6e10a839d85c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "field_scores" DROP CONSTRAINT "FK_829eaf9d0598ccdda5271f12f40"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_649a02fa31f2ab6e10a839d85c"`,
    );
    await queryRunner.query(`DROP TABLE "field_scores"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePredictions1790790538343 implements MigrationInterface {
  name = 'CreatePredictions1790790538343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "predictions" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "field_id" uuid NOT NULL, "pick_list" jsonb NOT NULL, "winner_time_estimate_in_seconds" integer, "finalized_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b92c9e4db595214b289f5e28adc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5fb9ba1750907ee1d87eedb002" ON "predictions" ("field_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_predictions_user_field" ON "predictions" ("user_id", "field_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "predictions" ADD CONSTRAINT "FK_8e4b27973471685734e213da971" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "predictions" ADD CONSTRAINT "FK_5fb9ba1750907ee1d87eedb002f" FOREIGN KEY ("field_id") REFERENCES "race_fields"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "predictions" DROP CONSTRAINT "FK_5fb9ba1750907ee1d87eedb002f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "predictions" DROP CONSTRAINT "FK_8e4b27973471685734e213da971"`,
    );
    await queryRunner.query(`DROP INDEX "public"."UQ_predictions_user_field"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5fb9ba1750907ee1d87eedb002"`,
    );
    await queryRunner.query(`DROP TABLE "predictions"`);
  }
}

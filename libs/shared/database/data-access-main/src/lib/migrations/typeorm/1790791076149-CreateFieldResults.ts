import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFieldResults1790791076149 implements MigrationInterface {
  name = 'CreateFieldResults1790791076149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "field_results" ("field_id" uuid NOT NULL, "version" integer NOT NULL, "ranking_list" jsonb NOT NULL, "winner_time_in_seconds" integer NOT NULL, "dnf_runner_id_list" jsonb NOT NULL, "published_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_188e0f1963029b907bdac28d75b" PRIMARY KEY ("field_id", "version"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "field_results" ADD CONSTRAINT "FK_af0d7431d9be984768eeaf91169" FOREIGN KEY ("field_id") REFERENCES "race_fields"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "field_results" DROP CONSTRAINT "FK_af0d7431d9be984768eeaf91169"`,
    );
    await queryRunner.query(`DROP TABLE "field_results"`);
  }
}

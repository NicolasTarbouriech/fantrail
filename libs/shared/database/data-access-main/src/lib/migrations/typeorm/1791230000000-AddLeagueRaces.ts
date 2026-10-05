import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLeagueRaces1791230000000 implements MigrationInterface {
  name = 'AddLeagueRaces1791230000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leagues" ADD "race_id_list" jsonb NOT NULL DEFAULT '[]'`,
    );
    // Leagues created before the race choice covered every public race.
    await queryRunner.query(
      `UPDATE "leagues" SET "race_id_list" = COALESCE((SELECT jsonb_agg("id") FROM "races" WHERE "status" IN ('open', 'locked', 'scored')), '[]')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "leagues" DROP COLUMN "race_id_list"`);
  }
}

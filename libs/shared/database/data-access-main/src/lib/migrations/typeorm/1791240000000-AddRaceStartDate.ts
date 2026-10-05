import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRaceStartDate1791240000000 implements MigrationInterface {
  name = 'AddRaceStartDate1791240000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "races" ADD "start_date" date`);
    // Existing races start on the local day of their first field, or of their creation.
    await queryRunner.query(
      `UPDATE "races" r SET "start_date" = COALESCE((SELECT MIN(f."start_at" AT TIME ZONE r."timezone")::date FROM "race_fields" f WHERE f."race_id" = r."id"), (r."created_at" AT TIME ZONE r."timezone")::date)`,
    );
    await queryRunner.query(
      `ALTER TABLE "races" ALTER COLUMN "start_date" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "races" DROP COLUMN "start_date"`);
  }
}

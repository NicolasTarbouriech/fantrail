import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRacesTrailEventIndex1791250000001 implements MigrationInterface {
  name = 'AddRacesTrailEventIndex1791250000001';

  // CONCURRENTLY cannot run inside a transaction, hence migrationsTransactionMode 'each'.
  public transaction = false;

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_races_trail_event_id" ON "races" ("trail_event_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX CONCURRENTLY IF EXISTS "public"."IDX_races_trail_event_id"`,
    );
  }
}

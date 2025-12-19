import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQazoPrayerUniqueConstraint1766164952434
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE qazo_prayers 
            ADD CONSTRAINT "UQ_user_date_prayer" 
            UNIQUE ("userId", date, "prayerTypeId")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE qazo_prayers DROP CONSTRAINT IF EXISTS "UQ_user_date_prayer"
        `);
  }
}

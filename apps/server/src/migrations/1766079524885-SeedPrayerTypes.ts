import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPrayerTypes1766079524885 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
  INSERT INTO prayer_types (
    key,
    name_uz,
    name_ar,
    name_en,
    name_ru,
    order_no,
    icon
  )
  VALUES
    ('bomdod', 'Bomdod', 'الفجر', 'Fajr', 'Фаджр', 1, 'wb_twilight'),
    ('peshin', 'Peshin', 'الظهر', 'Dhuhr', 'Зухр', 2, 'light_mode'),
    ('asr', 'Asr', 'العصر', 'Asr', 'Аср', 3, 'wb_sunny'),
    ('shom', 'Shom', 'المغرب', 'Maghrib', 'Магриб', 4, 'nights_stay'),
    ('xufton', 'Xufton', 'العشاء', 'Isha', 'Иша', 5, 'dark_mode'),
    ('vitr', 'Vitr', 'الوتر', 'Witr', 'Витр', 6, 'dark_mode')
  ON CONFLICT (key) DO NOTHING;
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM prayer_types
      WHERE key IN ('bomdod','peshin','asr','shom','vitr','xufton');
    `);
  }
}

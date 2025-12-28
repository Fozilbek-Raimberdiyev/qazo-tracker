import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QazoFasting } from 'src/fasting/entities/fasting.entity';
import { QazoPrayer } from 'src/prayer/entities/prayer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(QazoPrayer)
    private readonly qazoPrayer: Repository<QazoPrayer>,
    @InjectRepository(QazoFasting)
    private readonly qazoFasting: Repository<QazoFasting>,
  ) {}

  //   getPrayersCount
  async getPrayersCount(userId: string): Promise<any> {
    const sql = `
    SELECT COUNT(*) AS "totalPrayers",
    SUM(CASE WHEN "isCompleted" THEN 1 ELSE 0 END) AS "completedPrayers",
    SUM(CASE WHEN NOT "isCompleted" THEN 1 ELSE 0 END) AS "uncompletedPrayers"
    FROM qazo_prayers
    WHERE "userId" = $1
   `;
    const result = await this.qazoPrayer.query(sql, [userId]);
    return result[0];
  }

  async getFastingCount(userId: string): Promise<any> {
    const sql = `
    SELECT COUNT(*) AS "totalFasting",
    SUM(CASE WHEN "isCompleted" THEN 1 ELSE 0 END) AS "completedFasting",
    SUM(CASE WHEN NOT "isCompleted" THEN 1 ELSE 0 END) AS "uncompletedFasting"
    FROM qazo_fasting
    WHERE "user_id" = $1
    `;
    const result = await this.qazoFasting.query(sql, [userId]);
    return result[0];
  }

  async getPrayersCountPerYear(userId: string): Promise<any> {
    const sql = `
    SELECT EXTRACT(YEAR FROM "date") AS year,
    COUNT(*) AS "totalPrayers",
    SUM(CASE WHEN "isCompleted" THEN 1 ELSE 0 END) AS "completedPrayers",
    SUM(CASE WHEN NOT "isCompleted" THEN 1 ELSE 0 END) AS "uncompletedPrayers"
    FROM qazo_prayers
    WHERE "userId" = $1
    GROUP BY year
    ORDER BY year;
    `;
    const result = await this.qazoPrayer.query(sql, [userId]);
    return result;
  }

  async getFastingCountPerYear(userId: string): Promise<any> {
    const sql = `
    SELECT EXTRACT(YEAR FROM "date") AS year,
    COUNT(*) AS "totalFasting",
    SUM(CASE WHEN "isCompleted" THEN 1 ELSE 0 END) AS "completedFasting",
    SUM(CASE WHEN NOT "isCompleted" THEN 1 ELSE 0 END) AS "uncompletedFasting"
    FROM qazo_fasting
    WHERE "user_id" = $1
    GROUP BY year
    ORDER BY year;
    `;
    const result = await this.qazoFasting.query(sql, [userId]);
    return result;
  }

  async getPrayersCountByPrayerTypes(userId: string): Promise<any[]> {
    const result = await this.qazoPrayer
      .createQueryBuilder('qp')
      .select([
        'qp.prayerTypeId AS "prayerTypeId"',
        'prayerType', // butun PrayerTypes obyektini oladi
        'COUNT(qp.id) AS "totalPrayers"',
        'SUM(CASE WHEN qp."isCompleted" = true THEN 1 ELSE 0 END) AS "completedPrayers"',
        'SUM(CASE WHEN qp."isCompleted" = false THEN 1 ELSE 0 END) AS "uncompletedPrayers"',
      ])
      .innerJoin('qp.prayerType', 'prayerType') // prayerType ni yuklash uchun
      .where('qp.userId = :userId', { userId })
      .groupBy('qp.prayerTypeId')
      .addGroupBy('prayerType.id') // prayerType obyektini group by qilish uchun
      .orderBy('prayerType.order_no') // masalan, order_no bo'yicha tartiblash
      .getRawMany();

    // Natijani kerakli formatga keltirish (prayerType alohida obyekt bo'lib qoladi)
    return result.map((row) => ({
      prayerType: {
        id: row.prayerType_id,
        key: row.prayerType_key,
        name_uz: row.prayerType_name_uz,
        name_ar: row.prayerType_name_ar,
        name_en: row.prayerType_name_en,
        name_ru: row.prayerType_name_ru,
        order_no: row.prayerType_order_no,
        icon: row.prayerType_icon,
      },
      prayerTypeId: row.prayerTypeId,
      totalPrayers: Number(row.totalPrayers),
      completedPrayers: Number(row.completedPrayers),
      uncompletedPrayers: Number(row.uncompletedPrayers),
    }));
  }

  async getMonthlyCompletedPrayersByYear(
    userId: string,
    year?: number, // optional qilib qo'ydik
  ): Promise<{ year: number; month: number; completedCount: number }[]> {
    let sql: string;
    let params: any[] = [userId];

    if (year) {
      // Faqat tanlangan yil uchun 12 oy
      sql = `
      WITH months AS (
        SELECT
          $2::INTEGER AS year,
          gs.month_num AS month
        FROM generate_series(1, 12) AS gs(month_num)
      ),
      completions AS (
        SELECT
          EXTRACT(MONTH FROM "completedAt")::INTEGER AS month,
          COUNT(*) AS "completedCount"
        FROM qazo_prayers
        WHERE "userId" = $1
          AND "isCompleted" = true
          AND "completedAt" IS NOT NULL
          AND EXTRACT(YEAR FROM "completedAt")::INTEGER = $2
        GROUP BY EXTRACT(MONTH FROM "completedAt")
      )
      SELECT
        m.year,
        m.month,
        COALESCE(c."completedCount", 0) AS "completedCount"
      FROM months m
      LEFT JOIN completions c ON m.month = c.month
      ORDER BY m.month ASC;
    `;
      params.push(year);
    }
    // @ts-expect-error
    const result = await this.qazoPrayer.query(sql, params);

    return result.map((row) => ({
      year: Number(row.year),
      month: Number(row.month),
      completedCount: Number(row.completedCount),
    }));
  }

  async getMonthlyCompletedFastingByYear(userId: string, year?: number): Promise<any[]> {
    const sql = `
    WITH months AS (
      SELECT
        $2::INTEGER AS year,
        gs.month_num AS month
      FROM generate_series(1, 12) AS gs(month_num)
    ),
    completions AS (
      SELECT
        EXTRACT(MONTH FROM "completedAt")::INTEGER AS month,
        COUNT(*) AS "completedCount"
      FROM qazo_fasting
      WHERE "user_id" = $1
        AND "isCompleted" = true
        AND "completedAt" IS NOT NULL
        AND EXTRACT(YEAR FROM "completedAt")::INTEGER = $2
      GROUP BY EXTRACT(MONTH FROM "completedAt")
    )
    SELECT
      m.year,
      m.month,
      COALESCE(c."completedCount", 0) AS "completedCount"
    FROM months m
    LEFT JOIN completions c ON m.month = c.month
    ORDER BY m.month ASC;
  `;
    const params = [userId, year];
    return await this.qazoFasting.query(sql, params).then((result) => result.map(
      (row) => ({
        year: Number(row.year),
        month: Number(row.month),
        completedCount: Number(row.completedCount),
      }),
    )
    )
  }
}

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
    year: number,
  ): Promise<{ date: string; completedCount: number }[]> {
    const sql = `
      SELECT
        TO_CHAR(DATE("completedAt"), 'YYYY-MM-DD') AS date,
        COUNT(*) AS "completedCount"
      FROM qazo_prayers
      WHERE "userId" = $1
        AND "isCompleted" = true
        AND "completedAt" IS NOT NULL
        AND EXTRACT(YEAR FROM "completedAt")::INTEGER = $2
      GROUP BY DATE("completedAt")
      ORDER BY DATE("completedAt") ASC
    `;
    const result = await this.qazoPrayer.query(sql, [userId, year]);
    return result.map((row) => ({
      date: row.date,
      completedCount: Number(row.completedCount),
    }));
  }

  async getMonthlyCompletedFastingByYear(
    userId: string,
    year: number,
  ): Promise<{ date: string; completedCount: number }[]> {
    const sql = `
      SELECT
        TO_CHAR(DATE("completedAt"), 'YYYY-MM-DD') AS date,
        COUNT(*) AS "completedCount"
      FROM qazo_fasting
      WHERE "user_id" = $1
        AND "isCompleted" = true
        AND "completedAt" IS NOT NULL
        AND EXTRACT(YEAR FROM "completedAt")::INTEGER = $2
      GROUP BY DATE("completedAt")
      ORDER BY DATE("completedAt") ASC
    `;
    const result = await this.qazoFasting.query(sql, [userId, year]);
    return result.map((row) => ({
      date: row.date,
      completedCount: Number(row.completedCount),
    }));
  }
}

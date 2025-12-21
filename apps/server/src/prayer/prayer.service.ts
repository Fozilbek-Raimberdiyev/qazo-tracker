// src/qazo/qazo.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QazoPrayer } from './entities/prayer.entity';

@Injectable()
export class PrayerService {
  constructor(
    @InjectRepository(QazoPrayer)
    private qazoRepo: Repository<QazoPrayer>,
  ) {}

  /**
   * fromDate va toDate oralig'ida 5 ta namoz event yaratadi
   */
  async generateQazoPrayers(
    user: { userId: string },
    fromDate: string, // "2025-01-01"
    toDate: string, // "2025-01-31"
  ): Promise<{ success: boolean }> {
    const sql = `
    INSERT INTO qazo_prayers (date, "prayerTypeId", "userId", "isCompleted")
    SELECT
      date_series.date,  -- ::date cast olib tashlandi (allaqachon date tipida)
      pt.id,
      $3,
      false
    FROM generate_series(
      to_date($1, 'DD-MM-YYYY'),  -- stringni date ga parse qilish
      to_date($2, 'DD-MM-YYYY'),
      INTERVAL '1 day'
    ) AS date_series(date)
    CROSS JOIN prayer_types pt
    WHERE pt.key IN ('bomdod', 'peshin', 'asr', 'shom', 'xufton', 'vitr')
    ORDER BY date_series.date, pt.order_no
    ON CONFLICT ("userId", date, "prayerTypeId") DO NOTHING
  `;
    await this.qazoRepo.manager.query(sql, [fromDate, toDate, user.userId]);
    return { success: true };
  }

  /**
   * Userning qazo namozlarini olish
   */
  // async getUserPrayers(userId: string, dateFrom?: string, dateTo?: string) {
  //   const qb = this.qazoRepo
  //     .createQueryBuilder('prayer')
  //     .where('prayer.userId = :userId', { userId })
  //     .leftJoinAndSelect('prayer.prayerType', 'prayerType')
  //     .orderBy('prayer.date', 'ASC');
  //   if (dateFrom) qb.andWhere('prayer.date >= :dateFrom', { dateFrom });
  //   if (dateTo) qb.andWhere('prayer.date <= :dateTo', { dateTo });

  //   return qb.getMany();
  // }

  async getUserPrayers(userId: string, fromDate?: string, toDate?: string) {
    const params: (string | null)[] = [userId];
    if (fromDate) params.push(fromDate);
    else params.push(null);

    if (toDate) params.push(toDate);
    else params.push(null);

    const sql = `
    SELECT
      -- 1. Barcha eventlar (JSON array) - prayerType nested
      COALESCE(
        (SELECT json_agg(row_to_json(fp))
         FROM (
           SELECT 
             p.id,
             p.date,
             p."isCompleted",
             p."userId",
             p."prayerTypeId",
             p."createdAt",
             json_build_object(
               'key', pt.key,
               'name_uz', pt.name_uz,
               'name_en', pt.name_en,
               'name_ru', pt.name_ru,
               'icon', pt.icon,
               'order_no', pt.order_no
             ) AS "prayerType"
           FROM qazo_prayers p
           INNER JOIN prayer_types pt ON p."prayerTypeId" = pt.id
           WHERE p."userId" = $1
             AND ($2::text IS NULL OR p.date >= to_date($2::text, 'YYYY-MM-DD'))
             AND ($3::text IS NULL OR p.date <= to_date($3::text, 'YYYY-MM-DD'))
           ORDER BY p.date ASC, pt.order_no ASC
         ) fp
        ), '[]'::json
      ) AS prayers,

      -- 2. Umumiy soni
      (SELECT COUNT(*)
       FROM qazo_prayers p
       WHERE p."userId" = $1
         AND ($2::text IS NULL OR p.date >= to_date($2::text, 'YYYY-MM-DD'))
         AND ($3::text IS NULL OR p.date <= to_date($3::text, 'YYYY-MM-DD'))
      ) AS total_prayers,

      -- 3. Completed soni
      (SELECT COUNT(*) FILTER (WHERE p."isCompleted" = true)
       FROM qazo_prayers p
       WHERE p."userId" = $1
         AND ($2::text IS NULL OR p.date >= to_date($2::text, 'YYYY-MM-DD'))
         AND ($3::text IS NULL OR p.date <= to_date($3::text, 'YYYY-MM-DD'))
      ) AS completed_count,

      -- 4. Uncompleted soni
      (SELECT COUNT(*) FILTER (WHERE p."isCompleted" = false)
       FROM qazo_prayers p
       WHERE p."userId" = $1
         AND ($2::text IS NULL OR p.date >= to_date($2::text, 'YYYY-MM-DD'))
         AND ($3::text IS NULL OR p.date <= to_date($3::text, 'YYYY-MM-DD'))
      ) AS uncompleted_count,

      -- 5. Har bir namoz turi bo'yicha (array format)
      COALESCE(
        (SELECT json_agg(row_to_json(row))
         FROM (
           SELECT 
             json_build_object(
               'key', pt.key,
               'name_uz', pt.name_uz,
               'name_en', pt.name_en,
               'name_ru', pt.name_ru,
               'icon', pt.icon,
               'order_no', pt.order_no
             ) AS prayer_type,
             COUNT(*) AS total,
             COUNT(*) FILTER (WHERE p."isCompleted" = true) AS completed
           FROM qazo_prayers p
           INNER JOIN prayer_types pt ON p."prayerTypeId" = pt.id
           WHERE p."userId" = $1
             AND ($2::text IS NULL OR p.date >= to_date($2::text, 'YYYY-MM-DD'))
             AND ($3::text IS NULL OR p.date <= to_date($3::text, 'YYYY-MM-DD'))
           GROUP BY pt.key, pt.name_uz, pt.name_en, pt.name_ru, pt.icon, pt.order_no
           ORDER BY pt.order_no
         ) row
        ), '[]'::json
      ) AS counts_by_type
    `;

    const result = await this.qazoRepo.manager.query(sql, params);
    const raw = result[0];

    return {
      prayers: raw.prayers,
      totalPrayers: raw.total_prayers,
      completedCount: raw.completed_count,
      uncompletedCount: raw.uncompleted_count,
      countsByType: raw.counts_by_type.map((item: any) => ({
        prayerType: item.prayer_type,
        total: item.total,
        completed: item.completed,
      })),
    };
  }

  /**
   * Qazo namozini bajarilgan deb belgilash
   */
  async completePrayer(prayerId: string, userId: string): Promise<void> {
    await this.qazoRepo.update({ id: prayerId, userId }, { isCompleted: true });
  }
}

// src/qazo/qazo.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QazoPrayer } from './entities/prayer.entity';
import { User } from '../users/entities/user.entity';
import { PrayerTypes } from 'src/prayerTypes/entities/prayerTypes.entity';

const PRAYER_NAMES = ['bomdod', 'peshin', 'asr', 'shom', 'xufton'] as const;

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
      date_series.date::date,
      pt.id,
      $3,
      false
    FROM generate_series(
      to_date($1, 'DD-MM-YYYY'),
      to_date($2, 'DD-MM-YYYY'),
      INTERVAL '1 day'
    ) AS date_series(date)
    CROSS JOIN prayer_types pt
    WHERE pt.key IN ('bomdod', 'peshin', 'asr', 'shom', 'xufton','vitr')
    ORDER BY date_series.date, pt.order_no
    ON CONFLICT ("userId", date, "prayerTypeId") DO NOTHING
  `;
    await this.qazoRepo.manager.query(sql, [fromDate, toDate, user.userId]);
    return {
      success: true,
    };
  }

  /**
   * Userning qazo namozlarini olish
   */
  async getUserPrayers(userId: string, dateFrom?: string, dateTo?: string) {
    const qb = this.qazoRepo
      .createQueryBuilder('prayer')
      .where('prayer.userId = :userId', { userId })
      .leftJoinAndSelect('prayer.prayerType', 'prayerType')
      .orderBy('prayer.date', 'ASC');
    if (dateFrom) qb.andWhere('prayer.date >= :dateFrom', { dateFrom });
    if (dateTo) qb.andWhere('prayer.date <= :dateTo', { dateTo });

    return qb.getMany();
  }

  /**
   * Qazo namozini bajarilgan deb belgilash
   */
  async completePrayer(prayerId: string, userId: string): Promise<void> {
    await this.qazoRepo.update({ id: prayerId, userId }, { isCompleted: true });
  }
}

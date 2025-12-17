// src/qazo/qazo.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QazoPrayer } from './entities/prayer.entity';
import { User } from '../users/entities/user.entity';

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
  ): Promise<QazoPrayer[]> {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const prayers: QazoPrayer[] = [];

    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]; // "2025-01-15"

      for (const prayerName of PRAYER_NAMES) {
        const prayer = this.qazoRepo.create({
          date: dateStr,
          prayerName,
          userId: user.userId,
        });
        prayers.push(prayer);
      }
    }
    return this.qazoRepo.save(prayers);
  }

  /**
   * Userning qazo namozlarini olish
   */
  async getUserPrayers(userId: string, dateFrom?: string, dateTo?: string) {
    const qb = this.qazoRepo
      .createQueryBuilder('prayer')
      .where('prayer.userId = :userId', { userId })
      .orderBy('prayer.date', 'ASC')
      .addOrderBy('prayer.prayerName', 'ASC');

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

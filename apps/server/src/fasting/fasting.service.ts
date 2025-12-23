// src/qazo/qazo.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QazoFasting } from './entities/fasting.entity';
import moment from 'moment-hijri';

interface RamadanDate {
  date: string; // YYYY-MM-DD (milodiy)
  hijriDate: string; // iYYYY/iMM/iDD
  dayOfRamadan: number; // 1-30
  year: number; // gregorian year
  hijriYear: number; // hijri year
}

@Injectable()
export class FastingService {
  constructor(
    @InjectRepository(QazoFasting)
    private fastingRepo: Repository<QazoFasting>,
  ) {}

  /**
   * Qazo ro'za kunlarini generatsiya qilish
   */
  async generateFastingPrayers(
    userId: string,
    fromYear: number,
    toYear: number,
  ): Promise<{ success: boolean; generated: number }> {
    // Barcha yillar uchun Ramazon sanalarini olish
    const allRamadanDates = this.getAllRamadanDates(fromYear, toYear);
    if (allRamadanDates.length === 0) {
      return { success: true, generated: 0 };
    }
    const values = allRamadanDates
      .map(
        (date) =>
          `('${userId}', '${date.date}', '${date.hijriDate}', ${date.dayOfRamadan}, ${date.year}, ${date.hijriYear})`,
      )
      .join(', ');
    await this.fastingRepo.query(
      `
        INSERT INTO qazo_fasting (user_id, date, hijri_date, day_of_ramadan, gregorian_year, hijri_year)
        VALUES ${values}
      `,
    );

    return {
      success: true,
      generated: allRamadanDates.length,
    };
  }

  /**
   * Berilgan yillar oralig'idagi barcha Ramazon kunlarini topish
   */
  private getAllRamadanDates(fromYear: number, toYear: number): RamadanDate[] {
    const allDates: RamadanDate[] = [];

    for (let year = fromYear; year <= toYear; year++) {
      const ramadanDates = this.getRamadanDatesForYear(year);
      allDates.push(...ramadanDates);
    }

    return allDates;
  }

  /**
   * Bitta gregorian yil uchun Ramazon oyining barcha kunlarini topish
   */
  private getRamadanDatesForYear(gregorianYear: number): RamadanDate[] {
    const ramadanDates: RamadanDate[] = [];

    // Yilning boshi va oxiri
    const startOfYear = moment(`${gregorianYear}-01-01`, 'YYYY-MM-DD');
    const endOfYear = moment(`${gregorianYear}-12-31`, 'YYYY-MM-DD');

    // Shu yilda qaysi hijriy yillar bo'lgan
    const hijriYearStart = startOfYear.iYear();
    const hijriYearEnd = endOfYear.iYear();

    // Har bir hijriy yil uchun tekshirish
    // (bir gregorian yilda 1 yoki 2 ta Ramazon bo'lishi mumkin)
    for (
      let hijriYear = hijriYearStart;
      hijriYear <= hijriYearEnd;
      hijriYear++
    ) {
      // Ramazon 1-kuni (9-oy)
      const ramadanStart = moment(`${hijriYear}/09/01`, 'iYYYY/iMM/iDD');

      // Agar bu Ramazon berilgan gregorian yilga to'g'ri kelsa
      if (ramadanStart.year() === gregorianYear) {
        // 30 kun generate qilish (Ramazon 29 yoki 30 kun bo'lishi mumkin)
        // Lekin biz 30 kun generate qilamiz
        for (let day = 1; day <= 30; day++) {
          const fastingDate = moment(`${hijriYear}/09/${day}`, 'iYYYY/iMM/iDD');

          ramadanDates.push({
            date: this.formatDate(fastingDate),
            hijriDate: fastingDate.format('iYYYY/iMM/iDD'),
            dayOfRamadan: day,
            year: gregorianYear,
            hijriYear: hijriYear,
          });
        }
      }
    }

    return ramadanDates;
  }

  /**
   * Qazo ro'zani bajarilgan deb belgilash
   */
  async completeFasting(fastingId: string, userId: string): Promise<void> {
    await this.fastingRepo.update(
      { id: fastingId },
      {
        isCompleted: true,
        completedAt: new Date(),
      },
    );
  }

  /**
   * Foydalanuvchining qazo ro'zalari ro'yxatini olish
   */
  async getUserFastings(userId: string, year?: number) {
    const query = this.fastingRepo
      .createQueryBuilder('fasting')
      .where('fasting.user_id = :userId', { userId });

    if (year) {
      query.andWhere('fasting.gregorian_year = :year', { year });
    }

    query.orderBy('fasting.date', 'ASC');

    // Barcha ma'lumotlarni olish
    const fastingList = await query.getMany();

    // Statistikani hisoblash
    const totalCount = fastingList.length;
    const completedCount = fastingList.filter((f) => f.isCompleted).length;
    const uncompletedCount = totalCount - completedCount;

    return {
      totalCount,
      completedCount,
      uncompletedCount,
      fastingList,
    };
  }

  // formatDate
  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

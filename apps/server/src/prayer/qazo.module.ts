// src/qazo/qazo.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QazoPrayer } from './entities/prayer.entity';
import { PrayerService } from './prayer.service';
import { PrayerController } from './prayer.controller';
import { PdfService } from './pdf.service';

@Module({
  imports: [TypeOrmModule.forFeature([QazoPrayer])],
  providers: [PrayerService, PdfService],
  controllers: [PrayerController],
  exports: [PrayerService],
})
export class PrayerModule {}

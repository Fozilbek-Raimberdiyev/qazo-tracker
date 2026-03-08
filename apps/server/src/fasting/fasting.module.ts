// src/qazo/qazo.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QazoFasting } from './entities/fasting.entity';
import { FastingService } from './fasting.service';
import { FastingController } from './fasting.controller';
import { FastingPdfService } from './fasting-pdf.service';

@Module({
  imports: [TypeOrmModule.forFeature([QazoFasting])],
  providers: [FastingService, FastingPdfService],
  controllers: [FastingController],
  exports: [FastingService],
})
export class QazoFastingModule {}

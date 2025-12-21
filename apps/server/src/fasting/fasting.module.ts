// src/qazo/qazo.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QazoFasting } from './entities/fasting.entity';
import { FastingService } from './fasting.service';
import { FastingController } from './fasting.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QazoFasting])],
  providers: [FastingService],
  controllers: [FastingController],
  exports: [FastingService],
})
export class QazoFastingModule {}

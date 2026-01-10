// src/qazo/qazo.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrayerType } from './entities/prayerTypes.entity';
import { PrayerTypeService } from './prayerType.service';
import { PrayerTypeController } from './prayerType.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PrayerType])],
  providers: [PrayerTypeService],
  controllers: [PrayerTypeController],
  exports: [PrayerTypeService],
})
export class PrayerTypesModule {}

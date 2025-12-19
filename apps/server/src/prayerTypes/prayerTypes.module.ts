// src/qazo/qazo.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrayerTypes } from './entities/prayerTypes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrayerTypes])],
  providers: [PrayerTypes],
  controllers: [],
  exports: [],
})
export class PrayerTypesModule {}

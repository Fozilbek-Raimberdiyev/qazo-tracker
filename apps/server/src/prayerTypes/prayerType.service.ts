import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrayerType } from './entities/prayerTypes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PrayerTypeService {
  constructor(
    @InjectRepository(PrayerType)
    private readonly prayerTypeRepo: Repository<PrayerType>,
  ) {}

  async getPrayerTypes(): Promise<PrayerType[]> {
    return await this.prayerTypeRepo.find();
  }
}

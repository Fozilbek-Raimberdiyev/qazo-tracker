/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserProvider } from './entities/user-provider.entity';
import { QazoPrayer } from 'src/prayer/entities/prayer.entity';
import { QazoFasting } from 'src/fasting/entities/fasting.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserProvider)
    private userProviderRepository: Repository<UserProvider>,
    @InjectRepository(QazoPrayer)
    private qazoRepo: Repository<QazoPrayer>,
    @InjectRepository(QazoFasting)
    private fastingRepo: Repository<QazoFasting>,
  ) {}

  /**
   * Barcha foydalanuvchilarni olish
   */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['providers'],
    });
  }

  /**
   * ID bo'yicha foydalanuvchini olish
   */
 async findOne(id: string): Promise<User | null> {
  const user = await this.usersRepository.findOne({
    where: { id },
    relations: ['providers'],
  });

  // 1. Umumiy statistika (barcha yozuvlar, completed true/false farqi yo'q)
  const prayerOverallStats = await this.qazoRepo
    .createQueryBuilder('prayer')
    .select([
      'COUNT(*) AS count',
      'MAX(prayer.date) AS maxDate',
      'MIN(prayer.date) AS minDate',
    ])
    .where('prayer.userId = :userId', { userId: id })
    .getRawOne();

  // 2. Faqat qazo bo'lganlar statistikasi (isCompleted = false)
  const prayerUncompletedStats = await this.qazoRepo
    .createQueryBuilder('prayer')
    .select([
      'COUNT(*) AS uncompletedCount',
      'MAX(prayer.date) AS maxUncompletedDate',
      'MIN(prayer.date) AS minUncompletedDate',
    ])
    .where('prayer.userId = :userId AND prayer.isCompleted = false', { userId: id })
    .getRawOne();

  // Ro'za uchun ham xuddi shunday
  const fastingOverallStats = await this.fastingRepo
    .createQueryBuilder('fasting')
    .select([
      'COUNT(*) AS count',
      'MAX(fasting.date) AS maxDate',
      'MIN(fasting.date) AS minDate',
    ])
    .where('fasting.user_id = :userId', { userId: id })
    .getRawOne();

  const fastingUncompletedStats = await this.fastingRepo
    .createQueryBuilder('fasting')
    .select([
      'COUNT(*) AS uncompletedCount',
      'MAX(fasting.date) AS maxUncompletedDate',
      'MIN(fasting.date) AS minUncompletedDate',
    ])
    .where('fasting.user_id = :userId AND fasting.isCompleted = false', { userId: id })
    .getRawOne();

  return {
    ...user,
    // Namoz
    // @ts-expect-error
    qazoPrayersCount: Number(prayerUncompletedStats?.uncompletedcount) || 0,
    hasQazoPrayers: (Number(prayerUncompletedStats?.uncompletedcount) || 0) > 0,
    maxPrayerDate: prayerOverallStats?.maxdate || null,               // barcha namozlar
    minPrayerDate: prayerOverallStats?.mindate || null,               // barcha namozlar
    maxPrayerUncompletedDate: prayerUncompletedStats?.maxuncompleteddate || null,  // faqat qazo
    minPrayerUncompletedDate: prayerUncompletedStats?.minuncompleteddate || null,  // faqat qazo

    // Ro'za
    qazoFastingCount: Number(fastingUncompletedStats?.uncompletedcount) || 0,
    hasQazoFasting: (Number(fastingUncompletedStats?.uncompletedcount) || 0) > 0,
    maxFastingDate: fastingOverallStats?.maxdate || null,             // barcha ro'zalar
    minFastingDate: fastingOverallStats?.mindate || null,             // barcha ro'zalar
    maxFastingUncompletedDate: fastingUncompletedStats?.maxuncompleteddate || null,  // faqat qazo
    minFastingUncompletedDate: fastingUncompletedStats?.minuncompleteddate || null,  // faqat qazo
  };
}

  /**
   * Email bo'yicha foydalanuvchini olish
   * (Auth uchun kerak)
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['providers'],
    });
  }

  /**
   * Yangi foydalanuvchi yaratish
   */
  async create(userData: Partial<User>): Promise<User> {
    // Agar password bo'lsa, uni hash qilish
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  /**
   * Foydalanuvchini yangilash
   */
  async update(id: string, userData: Partial<User>): Promise<User> {
    // Agar password yangilanyapti bo'lsa, uni hash qilish
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    await this.usersRepository.update(id, userData);
    const updatedUser = await this.findOne(id);

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  /**
   * Foydalanuvchini o'chirish
   */
  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  /**
   * Provider orqali avtorizatsiya qilgan foydalanuvchini topish
   */
  async findProviderById(
    providerUserId: string,
    provider: string,
  ): Promise<UserProvider | null> {
    return this.userProviderRepository.findOne({
      where: { providerUserId, provider },
      relations: ['user'],
    });
  }

  /**
   * Yangi provider ma'lumotlarini saqlash
   */
  async createProvider(
    providerData: Partial<UserProvider>,
  ): Promise<UserProvider> {
    const provider = this.userProviderRepository.create(providerData);
    return this.userProviderRepository.save(provider);
  }

  /**
   * Foydalanuvchiga yangi provider qo'shish
   */
  async addProviderToUser(
    userId: string,
    providerData: Partial<UserProvider>,
  ): Promise<User> {
    const user = await this.findOne(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const provider = await this.createProvider({
      ...providerData,
      user,
    });

    if (!user.providers) {
      user.providers = [];
    }
    user.providers.push(provider);

    return this.usersRepository.save(user);
  }
}

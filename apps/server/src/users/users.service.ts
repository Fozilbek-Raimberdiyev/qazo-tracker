import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserProvider } from './entities/user-provider.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserProvider)
    private userProviderRepository: Repository<UserProvider>,
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
    return this.usersRepository.findOne({
      where: { id },
      relations: ['providers', 'qazoPrayers'],
    });
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

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserProvider } from './entities/user-provider.entity';
import { UsersController } from './users.controller';
import { QazoPrayer } from 'src/prayer/entities/prayer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProvider, QazoPrayer])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Boshqa modullarda foydalanish uchun
})
export class UsersModule {}

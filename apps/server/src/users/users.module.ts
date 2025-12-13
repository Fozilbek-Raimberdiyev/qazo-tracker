import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserProvider } from './entities/user-provider.entity';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProvider])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Boshqa modullarda foydalanish uchun
})
export class UsersModule {}

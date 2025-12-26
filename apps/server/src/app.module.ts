import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrayerModule } from './prayer/qazo.module';
import { PrayerTypesModule } from './prayerTypes/prayerTypes.module';
import { QazoFastingModule } from './fasting/fasting.module';
import { StatisticModule } from './statistic/statistic.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    PrayerModule,
    PrayerTypesModule,
    QazoFastingModule,
    StatisticModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

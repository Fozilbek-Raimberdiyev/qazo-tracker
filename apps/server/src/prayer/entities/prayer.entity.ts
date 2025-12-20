import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PrayerTypes } from '../../prayerTypes/entities/prayerTypes.entity';

@Entity('qazo_prayers')
@Unique(['userId', 'date', 'prayerTypeId'])
export class QazoPrayer {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '2025-12-18' })
  @Column({ type: 'date', nullable: true })
  date: Date; // ISO format: "YYYY-MM-DD"

  @ApiProperty({})
  @ManyToOne(() => PrayerTypes, { eager: true })
  @JoinColumn({ name: 'prayerTypeId' })
  prayerType: PrayerTypes;

  @ApiProperty()
  @Column()
  prayerTypeId: string;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isCompleted: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.qazoPrayers, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty()
  @Column()
  userId: string;
}

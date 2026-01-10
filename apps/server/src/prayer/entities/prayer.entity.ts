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
import { PrayerType } from '../../prayerTypes/entities/prayerTypes.entity';

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
  @ManyToOne(() => PrayerType, { eager: true })
  @JoinColumn({ name: 'prayerTypeId' })
  prayerType: PrayerType;

  @ApiProperty()
  @Column()
  prayerTypeId: string;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isCompleted: boolean;

  @ApiProperty({ example: '2025-12-18T14:30:00Z' })
  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.qazoPrayers, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty()
  @Column()
  userId: string;
}

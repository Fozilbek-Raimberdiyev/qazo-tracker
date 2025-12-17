import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('qazo_prayers')
export class QazoPrayer {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '2025-12-18' })
  @Column()
  date: string; // ISO format: "YYYY-MM-DD"

  @ApiProperty({ example: 'bomdod' })
  @Column()
  prayerName: 'bomdod' | 'peshin' | 'asr' | 'shom' | 'xufton';

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

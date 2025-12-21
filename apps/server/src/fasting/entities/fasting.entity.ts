import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('qazo_fasting')
export class QazoFasting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.qazoFastings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })  
  user: User;

  @Column({ type: 'date' })
  date: Date; // iso format (milodiy)

  @Column({ type: 'varchar', length: 20, nullable: true })
  hijri_date: string; // "1446/09/15"

  @Column({ type: 'integer' })
  day_of_ramadan: number; // 1-30

  @Column({ type: 'integer' })
  gregorian_year: number; // 2024

  @Column({ type: 'integer' })
  hijri_year: number; // 1446

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

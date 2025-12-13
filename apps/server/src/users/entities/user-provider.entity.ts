import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_providers')
export class UserProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  provider: string; // 'google', 'facebook', 'github', etc.

  @Column({ unique: true })
  providerUserId: string; // Providerdan kelgan unique ID

  @ManyToOne(() => User, (user) => user.providers, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'jsonb', nullable: true })
  providerData: any; // Qo'shimcha malumotlar

  @CreateDateColumn()
  createdAt: Date;
}
